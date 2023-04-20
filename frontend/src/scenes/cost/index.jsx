import React, { useContext, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl,  IconButton,  InputLabel, MenuItem, Select, TextField, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/Header';
import { useDeleteCostMutation, useGetCostsQuery, useUpdateCostMutation } from 'state/api';
import { useAddNewCostMutation } from 'state/api';
import { Add, Delete, Edit } from '@mui/icons-material';
import { I18nContext } from 'i18n';
import ConfirmDialog from 'components/ConfirmDialog';

const initialValues = { name: '', description: '', priceComponents: [] };

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const usdPrice = {
  type: "number",
  valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
};

function Cost() {
  const theme = useTheme();
  const { translate: t } = useContext(I18nContext);

  const { data, isLoading } = useGetCostsQuery(null, { pollingInterval: 30000 });
  const [addNewCost] = useAddNewCostMutation();
  const [updateCost, responseUpdate] = useUpdateCostMutation();
  const [deleteCost, responseCost] =
  useDeleteCostMutation();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [addMode, setAddMode] = useState(false)

  const handleOpen = ({row}) => {
    if (row) {
        setAddMode(row._id)
        setValues(row)
    }
    setOpen(true)
};;

  const handleClose = () => {
    setOpen(false);
    setValues(initialValues);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleServiceRemove = (index) => {
    const list = [...values.priceComponents];
    list.splice(index, 1);
    setValues({ ...values, priceComponents: list });
  };

  const handleAddPriceComponent = () => {
    setValues({ ...values, priceComponents: [...values.priceComponents, { type_: "", tax: 0, price: 0, gracePeriod: 0 }] });
  };


  const handlePriceComponentChange = (e, index) => {
    const { name, value } = e.target;

    // // let list = [...values.priceComponents];
    // console.log("==>",index, name)
    // // list[index][name] = value;
    
    const list = JSON.parse(JSON.stringify(values.priceComponents));
    list[index][name] = value;
    setValues({ ...values, priceComponents: list });
  };

  const columns = [
    {
      field: 'name',
      headerName: t("rates.datagrid.name"),
      flex: 0.3,
      headerAlign: "center"
    },
    {
      field: 'description',
      headerName: t("rates.datagrid.description"),
      flex: 0.8,
      headerAlign: "center"
    },
    {
      field: 'cost',
      headerName: t("rates.datagrid.cost"),
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => {
        const CellComponent = params.row.priceComponents.map((component, idx) => (
          <div key={component._idx} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4>{(component.type_).toUpperCase()}</h4>
            <div style={{ display: "flex", justifyContent: "space-evenly", width: "60%", marginBottom: 15 }}>
              <div>Price: {currencyFormatter.format(Number(component.price))} </div>
              <div>Tax: {currencyFormatter.format(Number(component.tax))}</div>
              <div>Grace Period: {component.gracePeriod}</div>
            </div>
            {idx < params.row.priceComponents.length - 1 && <Divider />}
          </div>
        ));
        return CellComponent;
      }
    },
    {
        field: "action",
        headerName: t("rates.datagrid.actions"),
        sortable: false,
        flex: 0.5,
        renderCell: (params) => {
            const onClickDelete = (e) => {
                //e.stopPropagation(); // don't select this row after clicking
                
                deleteCost(params.id);
            };

            return (
                <ButtonGroup
                    variant="contained"
                    aria-label="outlined primary button group"
                >
                    <IconButton>
                        <Edit onClick={() => handleOpen(params)} />
                    </IconButton>
                    <IconButton onClick={() => setConfirmOpen(true)}>
                        <Delete />
                    </IconButton>
                    <ConfirmDialog
                        title= {t("rates.datagrid.actions.deleteMessageTitle")}
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={onClickDelete}
                    >
                        {t("rates.datagrid.actions.deleteMessage")}
                    </ConfirmDialog>
                </ButtonGroup>
            );
        },
    },
  ];

  const handleAdd = () => {
    addNewCost(values).unwrap()
      .then(() => handleClose())
      .catch((error) => console.log(error));
  };

  const handleUpdate = () => {
    const arg = {
        payload: values,
        id: addMode,
    }
    

    // delete arg.payload._id
    // delete arg.payload._v
    // delete arg.payload.updatedAt
    // delete arg.payload.createdAt


    updateCost(arg)
        .unwrap()
        .then(() => {
            handleClose()
        })
        .then((error) => {
            console.log(error)
        })
}

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title={t("rates.title")} subtitle={t("rates.subtitle")} />

      <Box
        mt='40px'
        height='75vh'
        // sx={{
        //   '& .MuiDataGrid-root': { border: 'none', },
        //   '& .MuiDataGrid-cell': { borderBottom: 'none', },
        //   '& .MuiDataGrid-columnHeaders': {
        //     backgroundColor: theme.palette.background.alt,
        //     color: theme.palette.secondary[100],
        //     borderBottom: 'none',
        //   },
        //   '& .MuiDataGrid-virtualScroller': {
        //     backgroundColor: theme.palette.primary.light,
        //   },
        //   '& .MuiDataGrid-footerContainer': {
        //     backgroundColor: theme.palette.background.alt,
        //     color: theme.palette.secondary[100],
        //     borderTop: 'none',
        //   },
        //   '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
        //     color: `${theme.palette.secondary[200]} !important`,
        //   },
        // }}
      >
        <Button onClick={handleOpen} variant='contained' startIcon={<Add />}>{t("rates.dialog.buttons.add")}</Button>
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
          getRowHeight={() => 'auto'}
        />
        <Dialog open={open} onClose={handleClose} maxWidth="xl">
          <DialogTitle>{t("rates.dialog.title")}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '35ch' }, }}>
              <TextField autoFocus margin='dense' id='name' name="name" label={t("rates.datagrid.name")} type='text' size="small" onChange={(e) => handleChange(e)} value={values.name} />
              <TextField type='text' margin='dense' id='description' name="description" label={t("rates.datagrid.description")} size="small" onChange={(e) => handleChange(e)} value={values.description} />
            </Box>
            {values.priceComponents.map((component, index) => (
              <Box
                key={index} component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{t("rates.dialog.fields.typeField.name")}</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={component.type_}
                    size="small"
                    name='type_'
                    label="Type"
                    onChange={(e) => handlePriceComponentChange(e, index)}
                  >
                    <MenuItem value={"energy"}>{t("rates.dialog.fields.typeField.energy")}</MenuItem>
                  </Select>
                </FormControl>
                <TextField name='tax' label={t("rates.dialog.fields.tax")} id="outlined-size-small" size="small" defaultValue={0} value={component.tax} onChange={(e) => handlePriceComponentChange(e, index)} />
                <TextField name='price' label={t("rates.dialog.fields.price")} id="outlined-size-small" size="small" defaultValue={0} value={component.price} onChange={(e) => handlePriceComponentChange(e, index)} />
                <TextField name='gracePeriod' label={t("rates.dialog.fields.gracePeriod")} id="outlined-size-small" size="small" defaultValue={0} value={component.gracePeriod} onChange={(e) => handlePriceComponentChange(e, index)} />
                <Button onClick={() => handleServiceRemove(index)} variant="outlined" color="error" startIcon={<DeleteIcon />}>{t("rates.dialog.buttons.delete")}</Button>
              </Box>
            ))}
            <Button startIcon={<Add />}  variant="primary" fullWidth onClick={handleAddPriceComponent}
              sx={{ borderWidth: "2px", borderStyle: "dashed", margin: "20px 0" }}>{t("rates.dialog.buttons.addRate")}</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("rates.dialog.buttons.cancel")}</Button>
            <Button onClick={addMode ? handleUpdate : handleAdd}>{addMode ? "Update" : t("rates.dialog.buttons.add")}</Button>
          </DialogActions>
        </Dialog>
        
      </Box>
    </Box>
  );
}

export default Cost;

// import { Delete, Edit, Info, Visibility, Add } from '@mui/icons-material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//     Box,
//     Button,
//     ButtonGroup,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Divider,
//     FormControl,
//     IconButton,
//     InputLabel,
//     MenuItem,
//     Select,
//     TextField,
//     useTheme,
// } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import Header from 'components/Header';
// import React, { useState } from 'react'
// import { useGetCostsQuery, useAddNewCostMutation } from 'state/api';

// const initialValues = { name: '', description: "" }


// const currencyFormatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
// });

// const usdPrice = {
//     type: "number",
//     valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
// };


// function Cost() {
//     const theme = useTheme();
//     const { data, isLoading } = useGetCostsQuery();
//     const [addNewCost, response] = useAddNewCostMutation();
//     const [open, setOpen] = useState(false);
//     const [values, setValues] = useState(initialValues);
//     const [priceComponents, setPriceComponents] = useState([])



//     const handleOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false)
//         setValues(initialValues)
//         setPriceComponents([])
//     };
//     const handleChange = (e) => {

//         if (e.target.name === 'connectors') {
//             const regex = /^[0-9\b]+$/;
//             if (e.target.value === '' || regex.test(e.target.value)) {
//                 setValues({ ...values, [e.target.name]: e.target.value });
//             }
//         } else {
//             setValues({ ...values, [e.target.name]: e.target.value });
//         }
//     };

//     const handleAdd = () => {
//         addNewCost(values).unwrap()
//             .then(() => {
//                 handleClose()
//             })
//             .then((error) => {
//                 console.log(error)
//             })
//     };

//     const handleAddPriceComponent = () => {
//         setPriceComponents([...priceComponents, {
//             type_: "",
//             tax: 0,
//             price: 0,
//             gracePeriod: 0
//         }])
//     };

//     const handlePriceComponentChange = (e, index) => {
//         const { name, value } = e.target;
//         const list = [...priceComponents];
//         list[index][name] = value;
//         setPriceComponents(list);
//         setValues({ ...values, priceComponents: priceComponents });
//     };

//     const handleServiceRemove = (index) => {
//         const list = [...priceComponents];
//         list.splice(index, 1);
//         setPriceComponents(list);
//     };



//     const columns = [
//         {
//             field: 'name',
//             headerName: 'Name',
//             flex: 0.5,
//             headerAlign: "center"
//         },
//         {
//             field: 'description',
//             headerName: "Description",
//             flex: 1,
//             headerAlign: "center"
//         },
//         {
//             field: 'cost',
//             headerName: 'Cost',
//             flex: 0.7,
//             headerAlign: "center",
//             renderCell: (params) => {

//                 console.log(params.row.priceComponents)
//                 const CellComponent = params.row.priceComponents.map((component, idx) => (
//                     <div key={component._idx} style={{
//                         width: "100%", display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center"
//                     }}>
//                         <h4>

//                             {(component.type_).toUpperCase()}
//                         </h4>
//                         <div style={{
//                             display: "flex",
//                             justifyContent: "space-evenly",
//                             width: "60%",
//                             marginBottom: 15

//                         }}>
//                             <div>Price: {currencyFormatter.format(Number(component.price))} </div>
//                             <div>Tax: {currencyFormatter.format(Number(component.tax))}</div>
//                             <div>Grace Period: {component.gracePeriod}</div>
//                         </div>

//                         {idx < params.row.priceComponents.length - 1 && <Divider />}
//                     </div>
//                 ))
//                 return CellComponent
//             }
//         },

//     ];
//     return (
//         <Box m='1.5rem 2.5rem'>
//             <Header title='Cost' subtitle='List of Costs' />

//             <Box
//                 mt='40px'
//                 height='75vh'
//                 sx={{
//                     '& .MuiDataGrid-root': {
//                         border: 'none',
//                     },
//                     '& .MuiDataGrid-cell': {
//                         borderBottom: 'none',
//                     },
//                     '& .MuiDataGrid-columnHeaders': {
//                         backgroundColor: theme.palette.background.alt,
//                         color: theme.palette.secondary[100],
//                         borderBottom: 'none',
//                     },
//                     '& .MuiDataGrid-virtualScroller': {
//                         backgroundColor: theme.palette.primary.light,
//                     },
//                     '& .MuiDataGrid-footerContainer': {
//                         backgroundColor: theme.palette.background.alt,
//                         color: theme.palette.secondary[100],
//                         borderTop: 'none',
//                     },
//                     '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
//                         color: `${theme.palette.secondary[200]} !important`,
//                     },
//                 }}
//             >
//                 <Button onClick={handleOpen} variant='contained' startIcon={<Add />}>
//                     Add
//                 </Button>
//                 <DataGrid
//                     loading={isLoading || !data}
//                     getRowId={(row) => row._id}
//                     rows={data || []}
//                     columns={columns}
//                     getRowHeight={() => 'auto'}

//                 />
//                 <Dialog open={open} onClose={handleClose} maxWidth="xl">
//                     <DialogTitle>Add Rate</DialogTitle>
//                     <DialogContent>
//                         <Box  component="form"
//                                 sx={{
//                                     '& > :not(style)': { m: 1, width: '35ch' },
//                                 }}>
//                         <TextField
//                             autoFocus
//                             margin='dense'
//                             id='name'
//                             name="name"
//                             label='Name'
//                             type='text'
//                             size="small"
                            
                   
//                             onChange={(e) => handleChange(e)}
//                             value={values.name}
//                         />
//                         <TextField
//                             type='text'
//                             margin='dense'
//                             id='description'
//                             name="description"
//                             label='Description'
//                             size="small"
                     
                        
//                             onChange={(e) => handleChange(e)}
//                             value={values.description}
//                         />
//                         </Box>
//                         {/* <TextField
//                             type='text'
//                             margin='dense'
//                             id='cost'
//                             name="cost"
//                             label='Cost'
//                             variant='standard'
//                             fullWidth
//                             onChange={(e) => handleChange(e)}
//                             value={values.cost}
//                         /> */}

//                         {priceComponents.map((component, index) =>
//                         (
//                             <Box
//                                 key={index}
//                                 component="form"
//                                 sx={{
//                                     '& > :not(style)': { m: 1, width: '25ch' },
//                                 }}
//                                 noValidate
//                                 autoComplete="off"
//                             >

// <FormControl fullWidth>
//         <InputLabel id="demo-simple-select-label">Type</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={component.type_}
//           size="small"
//           name='type_'
//           label="Type"
//           onChange={(e) => handlePriceComponentChange(e, index)}
//         >
//           <MenuItem value={"energy"}>ENERGY (per kWh)</MenuItem>
          
//         </Select>
//       </FormControl>
               
//                                 <TextField
//                                     name='tax'
//                                     label="Tax *"
//                                     id="outlined-size-small"
//                                     size="small"
//                                     defaultValue={0}
//                                     value={component.tax}
//                                     onChange={(e) => handlePriceComponentChange(e, index)}
//                                 />
//                                 <TextField
//                                     name='price'
//                                     label="Price *"
//                                     id="outlined-size-small"
//                                     size="small"
//                                     defaultValue={0}
//                                     value={component.price}
//                                     onChange={(e) => handlePriceComponentChange(e, index)}
//                                 />
//                                 <TextField
//                                     name='gracePeriod'
//                                     label="Grace Period *"
//                                     id="outlined-size-small"
//                                     size="small"
//                                     defaultValue={0}
//                                     value={component.gracePeriod}
//                                     onChange={(e) => handlePriceComponentChange(e, index)}
//                                 />
//                                 <Button onClick={() => handleServiceRemove(index)} variant="outlined" color="error" startIcon={<DeleteIcon />}>
//                                     Delete
//                                 </Button>
//                             </Box>
//                         )
//                         )}

//                         <Button startIcon={<Add />} variant="outlined" variant="primary" fullWidth onClick={handleAddPriceComponent} sx={{
//                             borderWidth: "2px",
//                             borderStyle: "dashed",
//                             margin: "20px 0"
//                         }}>Add Price Component</Button>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleClose}>Cancel</Button>
//                         <Button onClick={handleAdd}>Add</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </Box>
//     )
// }

// export default Cost

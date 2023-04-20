import { Add } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Header from 'components/Header'
import MapViewGoogleApi from 'components/MapViewGoogleApi';
import { I18nContext } from 'i18n';
import React, { useContext, useState } from 'react'
import { useAddNewLocationMutation, useGetLocationsQuery } from 'state/api';

const initialValues = { name: '', address: '', city: "", latitude: "", longitude: "" };

function Locations() {
    const theme = useTheme();
    const { translate: t } = useContext(I18nContext);

    const { data, isLoading } = useGetLocationsQuery();
    console.log("🚀 ~ file: index.jsx:19 ~ Locations ~ data:", data)
    const [addNewLocation] = useAddNewLocationMutation();
    

    const [open, setOpen] = useState(false);
    const [values, setValues] = useState(initialValues);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
      setOpen(false);
      setValues(initialValues);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };

      const handleAdd = () => {
        addNewLocation(values).unwrap()
          .then(() => handleClose())
          .catch((error) => console.log(error));
      };

    const columns = [
        {
          field: 'name',
          headerName: t("locations.datagrid.name"),
          flex: 0.5,
          headerAlign: "center"
        },
        {
          field: 'address',
          headerName: t("locations.datagrid.address"),
          flex: 1,
          headerAlign: "center"
        },

        {
            field: 'city',
            headerName: t("locations.datagrid.city"),
            flex: 1,
            headerAlign: "center"
          },
  

      ];
  

  return (
    <Box m='1.5rem 2.5rem'>
    <Header title={t("locations.title")} subtitle={t("locations.subtitle")} />

    <Box
      mt='40px'
      height='75vh'
    //   sx={{
    //     '& .MuiDataGrid-root': { border: 'none', },
    //     '& .MuiDataGrid-cell': { borderBottom: 'none', },
    //     '& .MuiDataGrid-columnHeaders': {
    //       backgroundColor: theme.palette.background.alt,
    //       color: theme.palette.secondary[100],
    //       borderBottom: 'none',
    //     },
    //     '& .MuiDataGrid-virtualScroller': {
    //       backgroundColor: theme.palette.primary.light,
    //     },
    //     '& .MuiDataGrid-footerContainer': {
    //       backgroundColor: theme.palette.background.alt,
    //       color: theme.palette.secondary[100],
    //       borderTop: 'none',
    //     },
    //     '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
    //       color: `${theme.palette.secondary[200]} !important`,
    //     },
    //   }}
    >
        
      <Button onClick={handleOpen} variant='contained' startIcon={<Add />}>{t("locations.buttons.addNew")}</Button>
      {!isLoading && <MapViewGoogleApi data={data}/>}
      <DataGrid
        loading={isLoading || !data}
        getRowId={(row) => row._id}
        rows={data || []}
        columns={columns}
        getRowHeight={() => 'auto'}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogTitle>{t("locations.dialog.title")}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '35ch' }, }}>
            <TextField autoFocus margin='dense' id='name' name="name" label={t("locations.dialog.fields.name")} type='text' size="small" onChange={(e) => handleChange(e)} value={values.name} />
            <TextField type='text' margin='dense' id='address' label={t("locations.dialog.fields.address")} name='address' size="small" onChange={(e) => handleChange(e)} value={values.address} />
            <TextField type='text' margin='dense' id='city' label={t("locations.dialog.fields.city")} name='city' size="small" onChange={(e) => handleChange(e)} value={values.city} />
            <TextField type='text' margin='dense' id='latitude' label={t("locations.dialog.fields.latitude")} name='latitude' size="small" onChange={(e) => handleChange(e)} value={values.latitude} />
            <TextField type='text' margin='dense' id='longitude' label={t("locations.dialog.fields.longitude")} name='longitude' size="small" onChange={(e) => handleChange(e)} value={values.longitude} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("locations.dialog.buttons.cancel")}</Button>
          <Button onClick={handleAdd}>{t("locations.dialog.buttons.add")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  </Box>
  )
}

export default Locations

import React, { useContext, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, TextField, useTheme } from "@mui/material";
import { useAddNewCompanyMutation, useGetCompaniesQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { I18nContext } from "i18n";
import { Add } from "@mui/icons-material";

const initialValues = { name: '', email: '', address: "", city:"", country:"", phone:"" };

const Companies= () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCompaniesQuery();
  const [addNewCompany] = useAddNewCompanyMutation();
  const { translate: t } = useContext(I18nContext);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [addMode, setAddMode] = useState(false)

  const handleOpen = () => {
    
        setValues(true)
    
    setOpen(true)
};

  const handleClose = () => {
    setOpen(false);
    setValues(initialValues);
  };

  const handleAdd = () => {
    addNewCompany(values).unwrap()
    .then(() => handleClose())
    .catch((error) => console.log(error));
  };

  const handleUpdate = () => {
    
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };


  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: t("customers.datagrid.name"),
      flex: 0.5,
    },
    {
      field: "email",
      headerName: t("customers.datagrid.email"),
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
        field: "address",
        headerName: "Address",
        flex: 1,
      },
      {
        field: "city",
        headerName: "City",
        flex: 0.4,
      },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "created",
      headerName: "Created At",
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title={t("companies.title")} subtitle={t("companies.subtitle")}  />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <Button onClick={handleOpen} variant='contained' startIcon={<Add />}>{t("companies.dialog.buttons.add")}</Button>
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
             <Dialog open={open} onClose={handleClose} maxWidth="xl">
          <DialogTitle>{t("companies.dialog.title")}</DialogTitle>
          <DialogContent>      
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }}>
                <TextField name='name' label={t("companies.dialog.fields.name")} id="outlined-size-small" size="small" value={values.name} onChange={handleChange} />
                <TextField name='email' label={t("companies.dialog.fields.email")} id="outlined-size-small" size="small" value={values.email} onChange={handleChange} />
                <TextField name='address' label={t("companies.dialog.fields.address")} id="outlined-size-small" size="small" value={values.address} onChange={handleChange} />
                <TextField name='city' label={t("companies.dialog.fields.city")} id="outlined-size-small" size="small" value={values.city} onChange={handleChange} />
                <TextField name='country' label={t("companies.dialog.fields.country")} id="outlined-size-small" size="small" value={values.country} onChange={handleChange} />
                <TextField name='phone' label={t("companies.dialog.fields.phone")} id="outlined-size-small" size="small" value={values.phone} onChange={handleChange} />
       </Box>
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("companies.dialog.buttons.cancel")}</Button>
            <Button onClick={addMode ? handleUpdate : handleAdd}>{addMode ? "Update" : t("companies.dialog.buttons.add")}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Companies;

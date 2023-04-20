import React, { useContext, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { Link } from "react-router-dom";
import { I18nContext } from "i18n";

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const usdPrice = { type: 'number', valueFormatter: ({ value }) => currencyFormatter.format(Number(value)) };

const Transactions = () => {
  const theme = useTheme();
  const { translate: t } = useContext(I18nContext);

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
  

  const columns = [
    {
      field: "transactionId",
      headerName: t("transactions.datagrid.transactionId"),
      flex: 0.8,
    },
    {
        field: "chargerPointId", headerName:  t("transactions.datagrid.chargerPoint"), flex: 1, 
        valueFormatter: ({ value }) => {return value ? value.charger_box_id : "NULL"},
        renderCell: (params) => {
            if (params.row.chargerPointId?._id) {
                return (
                    <Link to={`/charger-stations/transactions/${params.row.chargerPointId._id}`} style={{
                        color: "inherit",
                        textDecoration: "inherit"
                    }}>{params.row.chargerPointId.charger_box_id} </Link>
                )
            }
            return "NA"
        }
    },
    {
      field: "user",
      headerName:  t("transactions.datagrid.user"),
      flex: 1,
      valueFormatter: ({ value }) => {return value ? value.email : "NULL"},
      renderCell: (params) => {
                if (params.row.user) {
                    return params.row.user.email
                } else {
                    return 'N/A'
                }
            }
    },
    { field: "connectorId", headerName:  t("transactions.datagrid.connectorId"), flex: 0.5, sortable: false },
    {
      field: "start_timestamp",
      headerName:  t("transactions.datagrid.startTime"),
      flex: 1,
      type: 'dateTime', 
      valueFormatter: params => (new Date(params.value)).toLocaleString()
    },
    {
        field: "start_value",
        headerName:  t("transactions.datagrid.startValue"),
        flex: 0.8,
        renderCell: (params) => `${Number(params.value).toFixed(2)/1000}`,
      },
      {
        field: "stop_timestamp",
        headerName:  t("transactions.datagrid.stopTime"),
        flex: 1,
        type: 'dateTime', 
        valueFormatter: params => (new Date(params.value)).toLocaleString()
      },
      {
          field: "stop_value",
          headerName:  t("transactions.datagrid.stopValue"),
          flex: 0.8,
          renderCell: (params) => `${Number(params.value).toFixed(2)/1000}`,
        },
        {
            field: "total_power", headerName:  t("transactions.datagrid.consumption"), flex: 1, 
                valueFormatter: ({value}) => value,
                renderCell: (params) => {
                const startValue = params.row.start_value
                const stopValue = params.row.stop_value
                return (stopValue - startValue) / 1000
            }
        },

    {
      field: "cost",
      headerName:  t("transactions.datagrid.cost"),
      flex: 0.8,
      ...usdPrice
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title= {t("transactions.title")} subtitle={t("transactions.subtitle")} />
      <Box
        height="80vh"
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
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          //sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch, fileName:`Transactions ${(new Date()).toLocaleString()}`  },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;

import { Delete, Edit, Info, Visibility, Add, BlurCircular, Block, BatteryChargingFull, Battery0Bar, BatteryFull, LinkOff, Power } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmDialog from "components/ConfirmDialog";
import Header from "components/Header";
import { I18nContext } from "i18n";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    useGetChargerPointsQuery,
    useAddNewChargerStationMutation,
    useDeleteChargerStationMutation,
    useStartRemoteChargerStationMutation,
    useStopRemoteChargerStationMutation,
    useGetCostsQuery,
    useAddNewConnectorMutation,
    useGetLocationsQuery,
    useUpdateChargerStationMutation,
} from "state/api";

const initialValues = { charger_box_id: "", rates: "", location: "", connectors: [] };

const ChargerPoints = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { translate: t } = useContext(I18nContext);

    const { data, isLoading } = useGetChargerPointsQuery(null, { pollingInterval: 30000 });
    const [addNewChargerStation, response] = useAddNewChargerStationMutation();
    const [addNewConnector, responseConnector] = useAddNewConnectorMutation();
    const [updateChargerStation, responseUpdate] = useUpdateChargerStationMutation();
    const [deleteChargerStation, responseDelete] =
        useDeleteChargerStationMutation();
    const [startRemoteCP, responseStartCP] =
        useStartRemoteChargerStationMutation();
    const [stopRemoteCP, responseStopCP] = useStopRemoteChargerStationMutation();
    const { data: dataCost, isLoading: isLoadingCost } = useGetCostsQuery();
    const { data: dataLocation, isLoading: isLoadingLocation } = useGetLocationsQuery();


    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [IdCP, setIdCP] = useState(null);

    const [values, setValues] = useState(initialValues);
    const [valuesAdd, setValuesAdd] = useState({ connectors: [] });
    const [addMode, setAddMode] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false);
    const [cpInfo, setCpInfo] = useState(null)


    const sty = ( info=false)=> {
        if(!info){            
                return {
                    backgroundColor: "#fafafa",
                border: "1px solid rgba(224, 224, 224, 1)"    
                }          
        }

        return {
            border: "1px solid rgba(224, 224, 224, 1)"
          }
    };

    const handleCloseInfo = () => {
      setOpenInfo(false);
    };
  
    const handleOpenInfo = ({row}) => {
      setCpInfo(row)
      setOpenInfo(true);
    };


    const handleOpen = ({ row }) => {
        if (row) {
            setAddMode(row._id)
            const data = {
                charger_box_id: row.charger_box_id, rates: row?.rates, location: row?.location._id, connectors: row.connectors
            }
            setValues(data)
        }
        setOpen(true)
    };

    const viewCP = (row) => {


    }


    const handleOpenAdd = (id) => {
        setOpenAdd(true)
        setIdCP(id)
    };
    const handleClose = () => {
        setOpen(false);
        setValues(initialValues);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
        setValuesAdd({ connectors: [] });
    };
    const handleChange = (e) => {
        if (e.target.name === "connectors") {
            const regex = /^[0-9\b]+$/;
            if (e.target.value === "" || regex.test(e.target.value)) {
                setValues({ ...values, [e.target.name]: e.target.value });
            }
        } else {
            setValues({ ...values, [e.target.name]: e.target.value });
        }
    };

    const handleAdd = () => {
        addNewChargerStation(values)
            .unwrap()
            .then(() => {
                handleClose();
            })
            .then((error) => {
                console.log(error);
            });
    };

    const handleUpdate = () => {
        const arg = {
            payload: values,
            id: addMode,
        }
        updateChargerStation(arg)
            .unwrap()
            .then(() => {
                handleClose()
            })
            .then((error) => {
                console.log(error)
            })
    }

    const handleAddNewConnector = () => {
        const arg = {
            payload: valuesAdd.connectors,
            id: IdCP,
        }
        addNewConnector(arg)
            .unwrap()
            .then(() => {
                handleCloseAdd();
            })
            .then((error) => {
                console.log(error);
            });
    };

    const handleServiceRemove = (index) => {
        const list = [...values.connectors];
        list.splice(index, 1);
        setValues({ ...values, connectors: list });
    };

    const handleAddServiceRemove = (index) => {
        const list = [...valuesAdd];
        list.splice(index, 1);
        setValues({ ...valuesAdd, connectors: list });
    };

    const handleAddConnector = () => {
        setValues({
            ...values,
            connectors: [
                ...values.connectors,
                { format: "", type: "", powerType: "", power: 0 },
            ],
        });
    };

    const handleAddOtherConnector = () => {
        setValuesAdd({
            ...valuesAdd,
            connectors: [
                ...valuesAdd.connectors,
                { format: "", type: "", powerType: "", power: 0 },
            ],
        });
    };

    const handleChangeConnector = (e, index) => {
        const { name, value } = e.target;
        // const list = [...values.connectors];
        const list = JSON.parse(JSON.stringify(values.connectors));
        list[index][name] = value;
        setValues({ ...values, connectors: list });
    };

    const handleChangeAddConnector = (e, index) => {
        const { name, value } = e.target;
        const list = [...valuesAdd.connectors];
        list[index][name] = value;
        setValuesAdd({ ...valuesAdd, connectors: list });
    };


    function getRealtimeData(data) {
        console.log("🚀 ~ file: index.jsx:65 ~ getRealtimeData ~ getStation", data);
    }



    useEffect(() => {
        //const sse = new EventSource('http://192.168.0.6:3000/ocpp/chargerPoints/status')
        const sse = new EventSource(
            "http://192.168.0.6:3030/ocpp/chargerPoints/status"
        );
        sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
        sse.onerror = () => {
            console.log("Error");

            sse.close();
        };
        return () => {
            sse.close();
        };
    }, []);

    console.log(values.location)  

    const columns = [
        {
            field: "charger_box_id",
            headerName: t("chargerPoints.datagrid.name"),
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Link
                        style={{
                            color: "inherit",
                            textDecoration: "inherit",
                        }}
                        to={`transactions/${params.row._id}`}
                    >
                        {params.row.charger_box_id}
                    </Link>
                );
            },
        },
        {
            field: "status",
            headerName: t("chargerPoints.datagrid.status"),
            flex: 0.5,
            renderCell: ({ row }) => {
                return (
                    <Tooltip title={row.status}>
                        {row.status === "online" ? <Power /> : <LinkOff />}
                    </Tooltip>
                );
            }
        },
        {
            field: "location",
            headerName: t("chargerPoints.datagrid.location"),
            flex: 0.5,
            renderCell: (params) => params.row.location?.name ,
        },

        {
            field: "connector",
            headerName: t("chargerPoints.datagrid.connectors"),
            flex: 0.5,
            renderCell: ({ row }) => {
                const connectors = row.connectors.map((con, idx) => {
                    if (con.status === "Available") {
                        return (
                            <Tooltip title={con.status} key={idx}>
                                <BlurCircular />
                            </Tooltip>
                        );
                    }
                    if (con.status === "Charging") {
                        return (
                            <Tooltip title={con.status} key={idx}>
                                <BatteryChargingFull />
                            </Tooltip>
                        );
                    }
                    if (con.status === "Finishing") {
                        return (
                            <Tooltip title={con.status} key={idx}>
                                <BatteryFull />
                            </Tooltip>
                        );
                    }
                    if (con.status === "Preparing") {
                        return (
                            <Tooltip title={con.status} key={idx}>
                                <Battery0Bar />
                            </Tooltip>
                        );
                    }
                    if (con.status === "SuspendedEVSE" || con.status === "SuspendedEV") {
                        return (
                            <Tooltip title={con.status} key={idx}>
                                <Block />
                            </Tooltip>
                        );
                    }
                });

                const addConnector = <IconButton onClick={() => handleOpenAdd(row._id)}><Add /></IconButton>

                return <div style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between", alignItems: "baseline"
                }}><div>{connectors}</div>{addConnector}</div>;
            }
        },
        {
            field: "remoteCommands",
            headerName: t("chargerPoints.datagrid.remoteCommands"),
            sortable: false,
            flex: 1,
            renderCell: (params) => {
                const onClickRemoteStart = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const data = {
                        id: `/${params.row.charger_box_id}`,
                        connector: 1,
                    };

                    startRemoteCP(data);
                };

                const onClickRemoteStop = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const data = {
                        id: `/${params.row.charger_box_id}`,
                        connector: 1,
                    };

                    stopRemoteCP(data);
                };

                return (
                    <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                    >
                        <Button
                            color="success"
                            style={{ textTransform: "none" }}
                            onClick={onClickRemoteStart}
                        >
                            Start
                        </Button>
                        <Button
                            color="error"
                            style={{ textTransform: "none" }}
                            onClick={onClickRemoteStop}
                        >
                            Stop
                        </Button>
                        <Button style={{ textTransform: "none" }}>Spare</Button>
                    </ButtonGroup>
                );
            },
        },
        {
            field: "action",
            headerName: t("chargerPoints.datagrid.actions"),
            sortable: false,
            flex: 1,
            renderCell: (params) => {
                const onClickDelete = (e) => {
                    //e.stopPropagation(); // don't select this row after clicking

                    deleteChargerStation(params.id);
                };

                return (
                    <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                    >
                        <IconButton  onClick={()=>handleOpenInfo(params)}>
                            <Info />
                        </IconButton>
                        <IconButton onClick={() => navigate(`transactions/${params.row._id}`)}>
                            <Visibility />
                        </IconButton>
                        <IconButton>
                            <Edit onClick={() => handleOpen(params)} />
                        </IconButton>
                        <IconButton onClick={() => setConfirmOpen(true)}>
                            <Delete />
                        </IconButton>
                        <ConfirmDialog
                            title= {t("chargerPoints.datagrid.actions.deleteMessageTitle")}
                            open={confirmOpen}
                            setOpen={setConfirmOpen}
                            onConfirm={onClickDelete}
                        >
                            {t("chargerPoints.datagrid.actions.deleteMessage")}
                        </ConfirmDialog>
                    </ButtonGroup>
                );
            },
        },
    ];
    return (
        <Box m="1.5rem 2.5rem">
            <Header title={t("chargerPoints.title")} subtitle={t("chargerPoints.subtitle")} />

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
                <Button onClick={handleOpen} variant="contained" startIcon={<Add />}>
                    {t("chargerPoints.buttons.add")}
                </Button>
                <DataGrid
                    loading={isLoading || !data}
                    getRowId={(row) => row._id}
                    rows={data || []}
                    columns={columns}
                />
                <Dialog open={open} onClose={handleClose} maxWidth="xl">
                    <DialogTitle>{t("chargerPoints.dialog.title")}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="charger_box_id"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => handleChange(e)}
                            value={values.charger_box_id}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{t("chargerPoints.dialog.field.lcoation")}</InputLabel>
                            <Select
                                name="location"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={values.location}
                                label="Cost"
                                onChange={(e) => handleChange(e)}
                            >
                                {dataLocation &&
                                    dataLocation.map((data) => (
                                        <MenuItem key={data._id} value={data._id}>
                                            {data.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{t("chargerPoints.dialog.field.rate")}</InputLabel>
                            <Select
                                name="rates"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={values.rates}
                                label="Cost"
                                onChange={(e) => handleChange(e)}
                            >
                                {dataCost &&
                                    dataCost.map((data) => (
                                        <MenuItem key={data._id} value={data._id}>
                                            {data.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        {values.connectors.map((component, index) => (
                            <>
                                <Box
                                    key={index}
                                    component="form"
                                    sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            {t("chargerPoints.dialog.field.format")}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.format}
                                            size="small"
                                            name="format"
                                            label="Format"
                                            onChange={(e) => handleChangeConnector(e, index)}
                                        >
                                            <MenuItem value={"cable"}>Cable</MenuItem>
                                            {/* <MenuItem value={"energy"}>Socket</MenuItem> */}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">{t("chargerPoints.dialog.field.type")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.type}
                                            size="small"
                                            name="type"
                                            label="Type"
                                            onChange={(e) => handleChangeConnector(e, index)}
                                        >
                                            <MenuItem value={"Type 1"}>Type 1</MenuItem>
                                            <MenuItem value={"Type 2"}>Type 2</MenuItem>
                                            <MenuItem value={"CCS1"}>CCS1</MenuItem>
                                            <MenuItem value={"CCS2"}>CCS2</MenuItem>
                                            <MenuItem value={"CHAdeMO"}>CHAdeMO</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            {t("chargerPoints.dialog.field.powerType")}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.powerType}
                                            size="small"
                                            name="powerType"
                                            label="Power Type"
                                            onChange={(e) => handleChangeConnector(e, index)}
                                        >
                                            <MenuItem value={"AC"}>AC</MenuItem>
                                            <MenuItem value={"DC"}>DC</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        name="power"
                                        label="Power *"
                                        id="outlined-size-small"
                                        size="small"
                                        defaultValue={0}
                                        value={component.power}
                                        onChange={(e) => handleChangeConnector(e, index)}
                                    />
                                    <Button onClick={() => handleServiceRemove(index)} variant="outlined" color="error" startIcon={<DeleteIcon />}>{t("chargerPoints.dialog.field.delete")}</Button>
                                </Box>
                                {index >= 0 && index < values.connectors.length - 1 && (
                                    <Divider />
                                )}
                            </>
                        ))}
                        <Button
                            startIcon={<Add />}
                            variant="primary"
                            fullWidth
                            onClick={handleAddConnector}
                            sx={{
                                borderWidth: "2px",
                                borderStyle: "dashed",
                                margin: "20px 0",
                            }}
                        >
                            {t("chargerPoints.dialog.field.addConnector")}
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t("chargerPoints.dialog.buttons.cancel")}</Button>
                        <Button onClick={addMode ? handleUpdate : handleAdd}>{addMode ? "UPDATE" : t("chargerPoints.dialog.buttons.add")}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="xl">
                    <DialogTitle>Add Connector</DialogTitle>
                    <DialogContent>

                        {valuesAdd.connectors.map((component, index) => (
                            <>
                                <Box
                                    key={index}
                                    component="form"
                                    sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Format
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.format}
                                            size="small"
                                            name="format"
                                            label="Format"
                                            onChange={(e) => handleChangeAddConnector(e, index)}
                                        >
                                            <MenuItem value={"cable"}>Cable</MenuItem>
                                            {/* <MenuItem value={"energy"}>Socket</MenuItem> */}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.type}
                                            size="small"
                                            name="type"
                                            label="Type"
                                            onChange={(e) => handleChangeAddConnector(e, index)}
                                        >
                                            <MenuItem value={"Type 1"}>Type 1</MenuItem>
                                            <MenuItem value={"Type 2"}>Type 2</MenuItem>
                                            <MenuItem value={"CCS1"}>CCS1</MenuItem>
                                            <MenuItem value={"CCS2"}>CCS2</MenuItem>
                                            <MenuItem value={"CHAdeMO"}>CHAdeMO</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Power Type
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={component.powerType}
                                            size="small"
                                            name="powerType"
                                            label="Power Type"
                                            onChange={(e) => handleChangeAddConnector(e, index)}
                                        >
                                            <MenuItem value={"AC"}>AC</MenuItem>
                                            <MenuItem value={"DC"}>DC</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        name="power"
                                        label="Power *"
                                        id="outlined-size-small"
                                        size="small"
                                        defaultValue={0}
                                        value={component.power}
                                        onChange={(e) => handleChangeAddConnector(e, index)}
                                    />
                                    <Button onClick={() => handleAddServiceRemove(index)} variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                                </Box>
                                {index >= 0 && index < valuesAdd.connectors.length - 1 && (
                                    <Divider />
                                )}
                            </>
                        ))}
                        <Button
                            startIcon={<Add />}
                            variant="primary"
                            fullWidth
                            onClick={handleAddOtherConnector}
                            sx={{
                                borderWidth: "2px",
                                borderStyle: "dashed",
                                margin: "20px 0",
                            }}
                        >
                            Add Price Connector
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAdd}>Cancel</Button>
                        <Button onClick={handleAddNewConnector}>Add</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openInfo} onClose={handleCloseInfo}>
        <DialogTitle>{`Chargestation Information: ${cpInfo?.charger_box_id || ""}(${cpInfo?.location.address})`}</DialogTitle>
        <DialogContent >
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={sty(false)} colSpan={2}>Manufacturer</TableCell>
                  <TableCell sx={sty(false)} colSpan={1}>Serial Number</TableCell>
                </TableRow>               <TableRow>
                  <TableCell sx={sty(true)} colSpan={2}>{cpInfo?.charge_point_vendor || ""}</TableCell>
                  <TableCell sx={sty(true)} colSpan={1}>REVISAR</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={sty(false)} colSpan={1}>Firmware</TableCell>
                  <TableCell sx={sty(false)} colSpan={1}>ICCID</TableCell>
                  <TableCell sx={sty(false)} colSpan={1}>IMSI</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={sty(true)}>{cpInfo?.fw_version || ""}</TableCell>
                  <TableCell sx={sty(true)}>{cpInfo?.iccid || ""}</TableCell>
                  <TableCell sx={sty(true)}>{cpInfo?.imsi || ""}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
            </Box>
        </Box>
    );
};

export default ChargerPoints;

import React, { useState, useEffect } from "react";

import {
  TextField,
  Modal,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Toolbar,
} from "@material-ui/core";

import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import { Search, Close as CloseIcon } from "@material-ui/icons";

import Controls from "../components/controls/Controls";

import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import { create, list, remove } from "./api-station";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    maxWidth: 650,
    marginBottom: theme.spacing(2),
    margin: "auto",
  },
  button: {
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  card: {
    maxWidth: 300,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
}));

const headCells = [
  { id: 'station', label: 'Estación' },
]


export default function Dashboard() {
  const classes = useStyles();
  const [cp, setCp] = useState([]);
  const [update, setUpdate] = useState(false);
  const [records, setRecords] = useState(
    list().then((data) => {
      if (!data.error) {
        return data;
      }
    })
  );
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [values, setValues] = useState({
    chargerPointID: "",
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleOpen = (id) => {
    setOpen(true);
    console.log(id);
  };

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    console.log(id);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    setOpen(false);
    console.log(id);
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const station = {
      chargerPointID: values.chargerPointID || undefined,
    };
    create(station).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "" });
        setUpdate(true);
      }
    });
  };
  useEffect(async () => {
    list().then((data) => {
      if (data.error) {
        // setValues({ ...values, error: data.error });
      } else {
        // setValues({ ...values, error: '' });
        setCp(data);
        setUpdate(false);
      }
    });
  }, [update]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <TextField
        // error
        id="chargerPointID"
        label="Estacion ID"
        value={values.chargerPointID}
        onChange={handleChange("chargerPointID")}
        variant="filled"
      />
      <Button
        color="primary"
        variant="contained"
        onClick={clickSubmit}
        className={classes.submit}
      >
        Submit
      </Button>
      <br />
    </div>
  );

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    remove(id).then((data) => {
      if (data.error) {
        // setValues({ ...values, error: data.error });
        console.log(data.error);
      } else {
        // setValues({ ...values, error: '' });
        setNotify({
          isOpen: true,
          message: "Deleted Successfully",
          type: "error",
        });
        setUpdate(true);
      }
    });
    // setRecords(employeeService.getAllEmployees())
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Estaciones de carga
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {cp.length}
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.button}>
        <Button
          className={classes.submit}
          variant="contained"
          onClick={handleOpen}
        >
          Agregar Estación
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>

      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search Employees"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>

      <TableContainer className={classes.table} component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Estación de Carga</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cp.length > 0 &&
              cp.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {row.chargerPointID}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this record?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(row._id);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                    {/* <Tooltip title="Borrar" placement="right" arrow>
                      <IconButton id="222" aria-label="delete" onClick={handleOpenDialog}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Dialog
                      open={openDialog}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Esta seguro de Eliminar Estación de Carga?"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Disagree
                        </Button>
                        <Button onClick={()=>handleDelete(row.chargerPointID)} color="primary" autoFocus>
                          Agree
                        </Button>
                      </DialogActions>
                    </Dialog> */}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}

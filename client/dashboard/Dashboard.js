import React, { useState, useEffect } from "react";

import {
  Card,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  InputAdornment,
  Toolbar,
  CardContent,
  Typography,
} from "@material-ui/core";

import useTable from "../components/useTable";

import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import Popup from "../components/Popup";
import StationForm from "./StationForm";
import {
  Search,
  Close as CloseIcon,
  EditOutlined as EditOutlinedIcon,
  Add as AddIcon,
} from "@material-ui/icons";

import Controls from "../components/controls/Controls";

import { makeStyles } from "@material-ui/core/styles";

import { create, list, remove, update } from "./api-station";

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

const headCells = [{ id: "station", label: "Estación" },{ id: 'actions', label: 'Actions', disableSorting: true }];

export default function Dashboard() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [openPopup, setOpenPopup] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
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

 

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn );

  

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.chargerPointID.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const addOrEdit = (station, resetForm) => {
    if (station.id == 0) {
      create(station).then((data) => {
        if (data.error) {
        } else {
          resetForm();
          setRecordForEdit(null);
          setOpenPopup(false);
          setUpdateTable(true);
          setNotify({
            isOpen: true,
            message: "Submitted Successfully",
            type: "success",
          });
        }
      });
    }else {
      update(station).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          resetForm();
          setRecordForEdit(null);
          setOpenPopup(false);
          setUpdateTable(true);
            setNotify({
            isOpen: true,
            message: "Submitted Successfully",
            type: "success",
          });
        }
      });
    }

  };

  const openInPopup = (item) => {
     setRecordForEdit(item);
    setOpenPopup(true);
  };

  useEffect(async () => {
    list().then((data) => {
      if (data.error) {
      } else {
        setRecords(data);
        setUpdateTable(false)
      }
    });
  }, [updateTable]);

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    remove(id).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setNotify({
          isOpen: true,
          message: "Deleted Successfully",
          type: "error",
        });
        setUpdateTable(true);
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Estaciones de carga
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {records.length}
          </Typography>
        </CardContent>
      </Card>

      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search Stations"
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
              <TableRow key={item._id}>
                <TableCell>{item.chargerPointID}</TableCell>
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
                          onDelete(item._id);
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
      <Popup
        title="Station Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <StationForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}

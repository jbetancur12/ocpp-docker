import React, { useEffect, useState } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import Station from "../components/stations";
import QR from "./Qr";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

function QRScanModule() {
  const classes = useStyles();
  const [values, setValues] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const sse = new EventSource("/ocpp/chargerPoints/status");
    function getRealtimeData(data) {
      const getStation = JSON.parse(data);
      getStation.forEach((station) => {
        if (station.id === `/${values}`) {
          setStations([station]);
          setValues("");
        }
      });
    }
    sse.onmessage = (e) => getRealtimeData(e.data);
    sse.onerror = () => {
      console.log("Error");

      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/ocpp/chargerPoints/" + values)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  return (
    <>
      <QR />
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          onChange={handleInputChange}
          id="id"
          label="Station"
          value={values}
        />
      </form>
      {stations.length > 0 && <Station stations={stations} />}
      {}
    </>
  );
}

export default QRScanModule;

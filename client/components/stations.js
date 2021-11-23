import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import {
  Power as PowerIcon,
  EvStation as EvStationIcon,
} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root:{
    display: "flex",
    justifyContent: 'center',
  },
  station: {
    background: "gray",
    borderRadius: "5px",
    width: "200px",
    height: "400px",
    position: "relative",
    display: "inline-block",
    marginRight: "60px",
    marginTop: "50px",
    marginLeft: "30px",
    "&:after": {
      background: "gray",
      borderRadius: "5px",
      height: "40px",
      left: "-20px",
      right: "-20px",
      top: "-20px",
      position: "absolute",
      zIndex: "2",
      content: '" "',
    },
  },
  stationTitle: {
    top: "30px",
    left: "30px",
    right: "30px",
    height: "60px",
    zIndex: "5",
    lineHeight: "30px",
    background: "#fff",
    width: "100%",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  measurements:{
    paddingLeft: "20px",
  },
  status: {
    fontWeight: "bold",
    color: "#feba19",
  },
  statusOnline: {
    color: "#7ab342",
  },
  statusOffline: {
    color: "#f04d3a",
  },

  conector: {
    padding: "19px",
    margin: "20px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    border: "none",
    cursor: "pointer",
    overflow: "hidden",
    outline: "none",
  },
}));

const toogleConnector = (id, connector) => {
  fetch("/ocpp/chargerPoints" + id + "/" + connector.connectorId, {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.info(data);
    });
};

function Station(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.stations.length > 0 &&
        props.stations.map((item) => (
          <div className={classes.station} key={item.id}>
            {item.connectors.map((connector) => (
              <div key={connector.connectorId} className={classes.conector}>
                <div className={classes.stationTitle}>
                  <div className={classes.measurements}>
                    Total kWh: <span>10</span>
                  {/* {item.id.substring(1)} */}
                  <div className={[classes.status, classes.statusOnline]}>
                    Costo: <span>10</span>
                  </div>
                  </div>
                </div>
                <Button
                  onClick={() => toogleConnector(item.id, connector)}
                  variant="contained"
                  startIcon={
                    <EvStationIcon
                      style={{
                        color: `${
                          connector.status !== "Available"
                            ? "#7ab342"
                            : "#f04d3a"
                        }`,
                      }}
                    />
                  }
                >
                  {connector.status !== "Available" ? "Stop" : "Start"}
                </Button>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default Station;

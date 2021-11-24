import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import {
  Power as PowerIcon,
  EvStation as EvStationIcon,
} from "@material-ui/icons";
import auth from "../auth/auth-helper";

// Create our number formatter.
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
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
  measurements: {
    paddingLeft: "20px",
    textAlign: "center",
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



function Station(props) {


  const classes = useStyles();
  const [TotalKW, setTotalKW] = useState(0)
  const [load, setLoad] = useState(false)
  const {stations} = props

 const getValue = (value) => {
   return value
 }

  const toogleConnector = (id, connector) => {
    
    const jwt = auth.isAuthenticated();
    const t = jwt.token;
    const data = { id: id, 
      connector: connector.connectorId, 
      //transactionId: connector.transactionId 
    };

    

    stations.forEach(station => {
      if(station.id === id){
        station.connectors.forEach(conn => {
          if(conn.connectorId == data.connector ){
            console.log(conn.value)
          }
        });
      }
    });

    fetch("/ocpp/chargerPoints/start/" + jwt.user._id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authentication: "Bearer " + t,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.info(data);
      });
  };
  return (
    <div className={classes.root}>
      {props.stations.length > 0 &&
        props.stations.map((item) => (
          <div className={classes.station} key={item.id}>
            {item.connectors &&
              item.connectors.map((connector) => (
                <div key={connector.connectorId} className={classes.conector}>
                  <div className={classes.stationTitle}>
                    <div className={classes.measurements}>
                      <b>kwh:</b>{" "}
                      <span>{connector.value ? getValue(connector.value) : 0}</span>
                      {/* {item.id.substring(1)} */}
                      <div className={[classes.status, classes.statusOnline]}>
                        <b> Cost: </b>
                        <span>
                          {connector.value
                            ? formatter.format(connector.value * 600)
                            : 0}
                        </span>
            
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

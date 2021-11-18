import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  station: {
    background: "#222",
    borderRadius: "5px",
    width: "200px",
    height: "400px",
    position: "relative",
    display: "inline-block",
    paddingTop: "120px",
    marginRight: "60px",
    marginTop: "50px",
    marginLeft: "30px",
    "&:before": {
      background: "#fff",
      borderRadius: "5px",
      height: "80px",
      left: "20px",
      right: "20px",
      top: "20px",
      position: "absolute",
      zIndex: "2",
      content: '" "',
    },
    "&:after": {
      background: "#222",
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
    position: "absolute",
    top: "30px",
    left: "30px",
    right: "30px",
    height: "60px",
    zIndex: "5",
    lineHeight: "30px",
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
    width: "96px",
    height: "96px",
    border: "1px solid #fff",
    borderRadius: "500px",
    padding: "19px",
    margin: "20px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button:{
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
  },
}));



export default function Clients() {
  const classes = useStyles();
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const sse = new EventSource("/ocpp/chargerPoints/status");
    function getRealtimeData(data) {
      setStations(JSON.parse(data));
    }
    sse.onmessage = (e) => getRealtimeData(e.data);
    sse.onerror = () => {
      console.log("Error");

      sse.close();
    };
    return () => {
      sse.close();
    };
  }, []);

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

  return (
    <div>
      {stations.length > 0 && stations.map((item) => (
        <div className={classes.station} key={item.id}>
          <div className={classes.stationTitle}>
            {item.id.substring(1)}
            <div className={[classes.status, classes.statusOnline]}>Online</div>
          </div>
          {item.connectors.map((connector) => (
            <div key={connector.connectorId}className={classes.conector}>
              <button  className={classes.button} onClick={()=>toogleConnector(item.id, connector)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="64px"
                  height="64px"
                  viewBox="-2 -2 64 64"
                >
                  <path
                    fillRule="evenodd"
                    fill={
                      connector.status !== "Available" ? "#7ab342" : "#f04d3a"
                    }
                    d="M45.405,13.386 L51.285,19.266 L43.016,27.535 L49.005,33.525 L38.525,44.005 L38.349,43.830 C34.411,48.801 28.334,52.000 21.500,52.000 C9.626,52.000 -0.000,42.374 -0.000,30.500 C-0.000,23.666 3.199,17.589 8.170,13.651 L7.995,13.475 L18.475,2.995 L23.635,8.155 L31.405,0.386 L37.285,6.266 L29.573,13.978 L37.193,21.598 L45.405,13.386 Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Station from '../components/stations';
import NotStation from './NotStation';

function QRScanModule() {
  // const { hasMounted } = useMounted()
  const [values, setValues] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stationParam = urlParams.get('station');

    const sse = new EventSource('/ocpp/chargerPoints/status');

    !isLoaded &&
      fetch('/ocpp/chargerPoints/' + stationParam)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setValues(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          },
        );

    function getRealtimeData(data) {
      const getStation = JSON.parse(data);
      if (getStation && getStation.length < 1) setStations([]);
      getStation.forEach((station) => {
        if (station.id === `/${stationParam}`) {
          setStations([station]);
        } else {
          setStations([]);
        }
      });
    }
    sse.onmessage = (e) => getRealtimeData(e.data);
    sse.onerror = () => {
      console.log('Error');

      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [values]);

  return (
    <>
      {stations.length > 0 ? <Station stations={stations} /> : <NotStation />}
    </>
  );
}

export default QRScanModule;

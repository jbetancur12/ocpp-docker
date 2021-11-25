import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';

const URL = 'ws://localhost:3000/simulador-Server';

export default function Operations() {
  const [ws, setWs] = useState(new WebSocket(URL, ['ocpp1.6']));

  useEffect(() => {
    console.log(ws);
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onerror = (err) => {
      console.log(err);
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
    };

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

  const submitMessage = () => {
    ws.send(JSON.stringify([2, uuidv4(), 'Reset', { type: 'Soft' }]));
  };

  return (
    <div>
      <Button
        color='primary'
        variant='contained'
        onClick={submitMessage}
        // className={classes.submit}
      >
        Send
      </Button>
    </div>
  );
}

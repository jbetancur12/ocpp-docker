import React, { useEffect, useState } from "react";
import QRScan from "qrscan";

export default function QR() {
  const [valuex, setValuex] = useState("");
  const [watching, setWatching] = useState(false);
  const onFind = (value) => {
    setValuex(value);
    setWatching(false);
  };
  return (
    <>
      {watching ? (
        <QRScan onFind={onFind} />
      ) : (
        <>
          <button onClick={() => setWatching(true)}>Scan</button>
          <h4>value: {valuex}</h4>
        </>
      )}
    </>
  );
}

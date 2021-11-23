import React, { useState  } from "react";
import QrReader from "react-qr-reader";

export default function QR() {
  const [result, SetResult] = useState("No result");
  const handleScan = (data) => {
    if (data) {
      SetResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <p>{result}</p>
    </div>
  );
}

import config from "./../config/config";
import app from "./express";
import mongoose from "mongoose";
import WebSocket from "ws";

const server = require("http").createServer(app);

const wss = new WebSocket.Server({ server: server });
export { wss };
require("./ws");


server.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});


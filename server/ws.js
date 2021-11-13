import { wss } from "./server";
import {
  messageController,
} from "./controllers/message.controller";

const CLIENTS = {};
wss.on("connection", async (socket, req) => {
  let origin = req.url;
  let originArray = origin.split("/");
  let chargerSerial = originArray[originArray.length - 1];
  CLIENTS[chargerSerial] = socket
  socket.on("message", async (message) => {
    const msgParsed = JSON.parse(message);
    console.log(msgParsed)
    messageController(wss, socket, message, req.url);
 
    // if(server || socket == CLIENTS[socket.id]){
    //   //const msg = JSON.stringify(CLIENTS[msgParsed.id].send(JSON.stringify([2, uuidv4(), "ChangeAvailability", {connectorId: 1, type: "Operative"}])))
    //   //CLIENTS[msgParsed.id].send(JSON.stringify([2, uuidv4(), "GetLocalListVersion", {}]))
    //   messageFromServerController(wss, CLIENTS[stationId], message, req.url)

    // }
  });
});

export default wss;

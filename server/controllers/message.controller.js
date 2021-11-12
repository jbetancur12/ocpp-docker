import actions from "../actions/chargePoint.action";
import ChargerPoint from "../models/chargerPoint.model";
import extend from "lodash/extend";
import errorHandler from "../helpers/dbErrorHandler";
import { v4 as uuidv4 } from 'uuid';

async function messageController(ws, socket, message, url) {
  const body = JSON.parse(message);
  if (body[0] === 2) {
    switch (body[2]) {
      case actions.AUTHORIZE:
        break;

      case actions.BOOT_NOTIFICATION:
        try {
          let chargerPoint = await ChargerPoint.findOne({
            chargerPointID: url.substring(1),
          });
          if (!chargerPoint) {
            console.log("ChargerPoint does not exist in DB");
            return socket.send(
              JSON.stringify([
                3,
                body[1],
                {
                  currentTime: new Date().toISOString(),
                  interval: 300,
                  status: "Rejected",
                },
              ])
            );
          }

          return socket.send(
            JSON.stringify([
              3,
              body[1],
              {
                currentTime: new Date().toISOString(),
                interval: 300,
                status: "Accepted",
              },
            ])
          );
        } catch (err) {
          return socket.send(
            JSON.stringify({
              error: errorHandler.getErrorMessage(err),
            })
          );
        }
        break;

      case actions.START_TRANSACTION:
        socket.send(
          JSON.stringify([
            3,
            body[1],
            {
              idTagInfo: {
                status: "Accepted",
              },
              transactionId: uuidv4(),
            },
          ])
        );

      default:
        break;
    }
  }else if(body[0]==3){
    console.log("3=> ",body)
  }
}

async function messageFromServerController(wss, socket, message, url) {
  console.log(JSON.parse(message));
  socket.send(message);
}

function senMessage(wss, socket, message, url) {
  return new Promise((resolve, reject) => {
    socket.send(message);
  });
}

export { messageController, messageFromServerController };

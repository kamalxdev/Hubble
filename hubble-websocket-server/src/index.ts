import { WebSocketServer } from "ws";
import generateSocketID from "./lib/generateSocketId";
import { iwebsocket, iwebsocketServer } from "./ws";
import { onlineUser, socketIDtoWebsocket, socketIdtoDBuserID } from "./lib/user";
import { message, sendMessageToAll } from "./message";

export const wss = new WebSocketServer({ port: 8080 }) as iwebsocketServer;

wss.on("connection", function connection(ws: iwebsocket) {
  // generates a unique id for clients
  ws.id = generateSocketID();
  console.log("Connected: ", ws.id);
  
  socketIDtoWebsocket.set(ws.id, ws);
  //on error
  ws.on("error", console.error);
  // handling messages from client
  ws.on("message", (data: any, isBinary) => {
    try {
      if (data) {
        const parsedData = JSON.parse(data);
        message(parsedData, ws);
      } else {
        ws.send("No data to send");
      }
    } catch (error) {
      console.log("error on sending message",error);
      ws.send("Error on sending message");
    }
  });
  // handling disconnection
  ws.on("close", (code, reason) => {
    onlineUser.forEach((value, key, map) => {
      if (value == ws?.id) {
        sendMessageToAll({event:"user-offline",payload:{id:key}})
        onlineUser.delete(key);
      }
    });
    socketIdtoDBuserID.delete(ws?.id)
    console.log("Disconnect: ", ws.id, +" Reason: " + code);
  });
  ws.send(`Connected ${ws.id}`);
});

export { iwebsocketServer };

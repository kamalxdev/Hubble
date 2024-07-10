import { wss } from ".";
import { onlineUser, socketIdtoDBuserID } from "./lib/user";
import { iwebsocket } from "./ws";
import WebSocket from "ws";

export function sendMessageToAll(data: any) {
  wss.clients.forEach(function each(client: iwebsocket) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export function sendMessageToSpecific(data: any, socketID: string) {
  wss.clients.forEach(function each(client: iwebsocket) {
    if (client?.id == socketID && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export function message(data: { event: string; payload: any }, ws: iwebsocket) {
  if (data?.event) {
    switch (data?.event) {
      case "user-connected":
        console.log("user-connected: ", JSON.stringify(data), ws.id);
        if (data?.payload?.id) {
          socketIdtoDBuserID.set(ws?.id, data?.payload?.id);
          onlineUser.set(data?.payload?.id, ws?.id);
          console.log({ socketIdtoDBuserID });
          sendMessageToAll({
            event: "user-online",
            payload: { id: data?.payload?.id },
          });
        }
        break;
      case "user-online-request":
        console.log("user-online-request ", JSON.stringify(data), ws.id);
        if (data?.payload?.id && onlineUser.has(data?.payload?.id)) {
          ws.send(
            JSON.stringify({
              event: "user-online-response",
              payload: { id: data?.payload?.id },
            })
          );
        }
        break;
      case "message-send":
        console.log("message-send", JSON.stringify(data), ws.id);
        if (
          data?.payload?.to &&
          data?.payload?.from &&
          data?.payload?.message
        ) {
          socketIdtoDBuserID.forEach((value, key, map) => {
            if (value == data?.payload?.to) {
              sendMessageToSpecific(
                {
                  event: "message-recieved",
                  payload: {
                    from: data?.payload?.from,
                    message: data?.payload?.message,
                    time:data?.payload?.time || new Date()
                  },
                },
                key
              );
            }
          });
        }
        break;
      default:
        console.log("No event found");

        break;
    }
  } else {
    console.log("Event missing");
    ws.send("Event missing");
  }
}

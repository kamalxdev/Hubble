import { findOnlineUsers, setOnlineUsers } from "../lib/onlineuser";
import { iwebsocket } from "../types/ws";
import { newCall, updateCall } from "./calls";
import { sendMessageToAll, sendMessageToSpecific, updateChatsInDB, updateReadChatsInDB } from "./chats";



export async function message(data: { event: string; payload: any }, ws: iwebsocket) {
  const message_recieved_from = await findOnlineUsers('ws',ws.id)
  if (data?.event) {
    switch (data?.event) {
      case "user-connected":
        console.log("user-connected: ", JSON.stringify(data), ws.id);
        if (data?.payload?.id) {
          // socketIdtoDBuserID.set(ws?.id, data?.payload?.id);
          // onlineUser.set(data?.payload?.id, ws?.id);
          await setOnlineUsers({ws_id:ws?.id,db_id:data?.payload?.id})
          // console.log({ socketIdtoDBuserID, onlineUser });
          sendMessageToAll({
            event: "user-online",
            payload: { id: data?.payload?.id },
          });
        }
        break;
      case "user-online-request":

        if (data?.payload?.id && await findOnlineUsers('db',data?.payload?.id)) {
          ws.send(
            JSON.stringify({
              event: "user-online-response",
              payload: { id: data?.payload?.id },
            })
          );
        }
        break;
      // listen to user message and redirect it to 'to user'

      case "message-send":
        console.log("message-send", JSON.stringify(data), ws.id);
        if (
          data?.payload?.to &&
          data?.payload?.from &&
          data?.payload?.message
        ) {
          updateChatsInDB(
            data?.payload?.to,
            data?.payload?.from,
            data?.payload?.message,
            data?.payload?.time || new Date(),
            data?.payload?.status
          );
              sendMessageToSpecific(
                {
                  event: "message-recieved",
                  payload: {
                    from: data?.payload?.from,
                    message: data?.payload?.message,
                    time: data?.payload?.time || new Date(),
                    status: data?.payload?.status,
                  },
                },data?.payload?.to
              );
            
        }
        break;
      //
      //
      case "message-read":
        if (
          data?.payload?.id
        ) {
          updateReadChatsInDB(
            message_recieved_from?.db_id as string,
            data?.payload?.id);
          sendMessageToSpecific(
            {
              event: "message-read-recieved",
              payload: {
                id:message_recieved_from?.db_id,
              },
            },
            data?.payload?.id
          );
        }
        break;
      //
      // sending user typing event
      case "message-send-start-typing":
        if (data?.payload?.to) {
              sendMessageToSpecific(
                {
                  event: "message-recieved-start-typing",
                  payload: { id:message_recieved_from?.db_id,},
                },
                data?.payload?.to
              );
            
        }
        break;
      //
      // transferring call to given user
      case "call-user":
        if (data?.payload?.id && data?.payload?.type) {

          const call = await newCall(data?.payload?.id,message_recieved_from?.db_id as string,data?.payload?.type)
          sendMessageToSpecific(
            {
              event: "call-user-recieved",
              payload: {
                id:message_recieved_from?.db_id,
                callID:call?.id,
                type: data?.payload?.type,
              },
            },
            data?.payload?.id
          );
        }
        break;
      //
      case "call-user-answer":
        if (data?.payload?.id && data?.payload?.callID) {

          await updateCall(data?.payload?.callID,data?.payload?.accepted)
          sendMessageToSpecific(
            {
              event: "call-user-answer-recieved",
              payload: {
                id:message_recieved_from?.db_id,
                accepted: data?.payload?.accepted,
                type: data?.payload?.type,
              },
            },
            data?.payload?.id
          );
        }
        break;
      // listening to user call offer from sender and sending to the specified user i.e. reciever of call
      case "call-offer":

        if (
          data?.payload?.id &&
          data?.payload?.offer &&
          data?.payload?.type &&
          (await findOnlineUsers('db',data?.payload?.id))?.db_id
        ) {

          sendMessageToSpecific(
            {
              event: "call-offer-recieved",
              payload: {
                id:message_recieved_from?.db_id,
                type: data?.payload?.type,
                offer: data?.payload?.offer,
              },
            },
            data?.payload?.id
          );
        }
        break;
      // listening to call answer from reciever
      case "call-answer":

        if (
          data?.payload?.id &&
          data?.payload?.answer &&
          data?.payload?.type &&
          (await findOnlineUsers('db',data?.payload?.id))?.db_id
        ) {
          sendMessageToSpecific(
            {
              event: "call-answer-recieved",
              payload: {
                id:message_recieved_from?.db_id,
                answer: data?.payload?.answer,
                type: data?.payload?.type,
              },
            },
            data?.payload?.id
          );
        }
        break;
      //
      //
      case "call-user-iceCandidate":
        if (
          data?.payload?.id &&
          data?.payload?.iceCandidate &&
          data?.payload?.from &&
          (await findOnlineUsers('db',data?.payload?.id))?.db_id
        ) {
          sendMessageToSpecific(
            {
              event: "call-user-iceCandidate-recieved",
              payload: {
                id:message_recieved_from?.db_id,
                from: data?.payload?.from,
                iceCandidate: data?.payload?.iceCandidate,
              },
            },
            data?.payload?.id
          );
        }
        break;
        //
        //
        case 'call-end':
          if(data?.payload?.id){
            sendMessageToSpecific(
              {
                event: "call-ended",
                payload: {
                  id:message_recieved_from?.db_id,
                  reason:'user ended the call'
                },
              },
              data?.payload?.id
            );
          }
          break;
        //
      default:
        console.log("No event found");

        break;
    }
  } else {
    console.log("Event missing");
    ws.send("Event missing");
  }
}


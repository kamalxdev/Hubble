import { icurrentUserChats, iOpenChatValue } from "../context/OpenedChat";
import { iwebRTCcontext } from "../context/webRTC";

export async function listenMessages(
  openChat: iOpenChatValue,
  socket: WebSocket,
  webRTC: iwebRTCcontext,
  data: { event: string; payload: any }
) {
  if (data?.event) {
    switch (data?.event) {
      // listening and handling user offline

      case "user-offline":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          openChat.setCurrentUserOnline(false);
        }
        break;
      // listening to user online

      case "user-online":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          openChat.setCurrentUserOnline(true);
        }
        break;
      // listening to requested user online response

      case "user-online-response":
        if (
          data?.payload?.id &&
          openChat.currentUniqueUserId == data?.payload?.id
        ) {
          console.log("user online resopnse");

          openChat.setCurrentUserOnline(true);
        }
        break;
      //
      // listen to user message and set it in alluser chats
      case "message-recieved":
        if (
          openChat?.allUserChats &&
          openChat?.allUserChats[data?.payload?.from]
        ) {
          openChat.setAllUserChats({
            ...openChat?.allUserChats,
            [data?.payload?.from]: [
              ...openChat?.allUserChats[data?.payload?.from],
              {
                type: "sender",
                message: data?.payload?.message,
                time: data?.payload?.time,
                status:
                  openChat?.currentUniqueUserId == data?.payload?.from
                    ? "read"
                    : data?.payload?.status,
              },
            ],
          });
        } else {
          openChat.setAllUserChats({
            ...openChat?.allUserChats,
            [data?.payload?.from]: [
              {
                type: "sender",
                message: data?.payload?.message,
                time: data?.payload?.time,
                status:
                  openChat?.currentUniqueUserId == data?.payload?.from
                    ? "read"
                    : data?.payload?.status,
              },
            ],
          });
        }

        break;
      //
      //
      case "message-read-recieved":
        if (data?.payload?.id) {
          const chatupdated: icurrentUserChats[] =
            openChat?.allUserChats &&
            openChat?.allUserChats[openChat?.currentUniqueUserId]?.map(
              (chat) => {
                if (
                  chat?.type == "reciever" &&
                  chat?.status == "unread"
                ) {
                  return { ...chat, status: "read" };
                }
                return chat;
              }
            );

          openChat?.setAllUserChats({
            ...openChat?.allUserChats,
            [openChat?.currentUniqueUserId]: chatupdated,
          });
        }
        break;
      //
      // listening to user typing event
      case "message-recieved-start-typing":
        if (data?.payload?.id) {
          if (openChat.typing) {
            openChat.setTyping({
              ...openChat?.typing,
              [data?.payload?.id]: true,
            });
            setTimeout(() => {
              openChat.setTyping({
                ...openChat?.typing,
                [data?.payload?.id]: false,
              });
            }, 1000);
          } else {
            openChat.setTyping({ [data?.payload?.id]: true });
            setTimeout(() => {
              openChat.setTyping({ [data?.payload?.id]: false });
            }, 2500);
          }
        }
        break;
      //
      // reciever side: reciever gets call from sender(who initiated the call)
      case "call-user-recieved":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.callID) {
          webRTC?.setCall({
            ...webRTC?.call,
            user: { id: data?.payload?.id },
            type: data?.payload?.type,
            Useris: "reciever",
            answered: false,
            callID:data?.payload?.callID
          });
        }
        break;
      //
      //
      case "call-user-answer-recieved":
        if (data?.payload?.id) {
          if (data?.payload?.accepted) {
            webRTC?.setCall({ ...webRTC?.call, answered: true });
            webRTC?.sendData(data?.payload?.type);
          } else {
            webRTC?.setCall({});
          }
        }
        break;
      //
      // reciever part: listening to call offer from sender(who initiated the call)
      case "call-offer-recieved":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.offer) {
          await webRTC?.peer?.reciever?.setRemoteDescription(
            data?.payload?.offer
          );
          let answer = await webRTC?.peer?.reciever?.createAnswer();
          await webRTC?.peer?.reciever?.setLocalDescription(answer);
          webRTC?.setCall({ ...webRTC?.call, answered: true });
          socket.send(
            JSON.stringify({
              event: "call-answer",
              payload: {
                id: data?.payload?.id,
                type: webRTC?.call?.type,
                answer: webRTC?.peer?.reciever?.localDescription,
              },
            })
          );
        }
        break;
      //
      // sender part: listening to senders call offer answer sent earlier
      case "call-answer-recieved":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.answer) {
          await webRTC?.peer?.sender?.setRemoteDescription(
            data?.payload?.answer
          );
        }

        break;
      //
      //
      case "call-user-iceCandidate-recieved":
        if (data?.payload?.iceCandidate && data?.payload?.from) {
          if (data?.payload?.from == "reciever") {
            console.log("icecandidate set to sender");

            await webRTC?.peer?.sender?.addIceCandidate(
              data?.payload?.iceCandidate
            );
          }
          if (data?.payload?.from == "sender") {
            console.log("icecandidate set to reciever");

            await webRTC?.peer?.reciever?.addIceCandidate(
              data?.payload?.iceCandidate
            );
          }
        }
        break;
      //
      //
      case "call-ended":
        if (data?.payload?.id) {
          webRTC?.setCall({});
          webRTC?.peer?.sender?.close();
          webRTC?.peer?.reciever?.close();
          webRTC?.setPeer({
            sender: new RTCPeerConnection(),
            reciever: new RTCPeerConnection(),
          });
        }
        break;
      //
      default:
        console.log("no event found");

        break;
    }
  } else {
    console.log("no event found");
  }
}

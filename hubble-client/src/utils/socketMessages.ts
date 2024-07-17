import { iOpenChatValue } from "../context/OpenedChat";
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
              },
            ],
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
            }, 2500);
          } else {
            openChat.setTyping({ [data?.payload?.id]: true });
            setTimeout(() => {
              openChat.setTyping({ [data?.payload?.id]: false });
            }, 2500);
          }
        }
        break;
      //
      // reciever part
      case "call-offer-recieved":
        if (
          data?.payload?.id &&
          data?.payload?.type &&
          data?.payload?.senderOFFER
        ) {
          webRTC?.setPeer({
            sender: new RTCPeerConnection(),
            reciever: new RTCPeerConnection(),
          });

          await webRTC?.peer?.reciever?.setRemoteDescription(
            data?.payload?.senderOFFER
          );
          const recieverANSWER = await webRTC?.peer?.reciever?.createAnswer();
          await webRTC?.peer?.reciever?.setLocalDescription(recieverANSWER);
          let senderOFFER = await webRTC?.peer?.sender?.createOffer();
          await webRTC?.peer?.sender?.setLocalDescription(senderOFFER);

          webRTC?.setCall({
            user: { id: data?.payload?.id },
            type: data?.payload?.type,
            answered: true,
          });
          socket.send(
            JSON.stringify({
              event: "call-answer",
              payload: {
                id: data?.payload?.id,
                recieverANSWER: webRTC?.peer?.reciever?.localDescription,
                senderOFFER: webRTC?.peer?.sender?.localDescription,
                type: data?.payload?.type,
              },
            })
          );
        }
        break;
      //
      // sender part
      case "call-answer-recieved":
        if (
          data?.payload?.id &&
          data?.payload?.type &&
          data?.payload?.recieverANSWER &&
          data?.payload?.senderOFFER
        ) {
          await webRTC?.peer?.sender.setRemoteDescription(
            data?.payload?.recieverANSWER
          );
          await webRTC?.peer?.reciever.setRemoteDescription(
            data?.payload?.senderOFFER
          );
          let recieverANSWER = await webRTC?.peer?.reciever?.createAnswer();
          await webRTC?.peer?.reciever.setLocalDescription(recieverANSWER);
          socket.send(
            JSON.stringify({
              event: "call-answered",
              payload: {
                id: data?.payload?.id,
                type:data?.payload?.type,
                recieverANSWER: webRTC?.peer?.reciever?.localDescription,
              },
            })
          );
          // navigator.mediaDevices
          //   .getUserMedia({ video: true, audio: true })
          //   .then((stream) => {
          //     stream.getTracks().forEach((track) => {
          //       webRTC?.peer?.sender?.addTrack(track);
          //     });
          //   });
        }

        break;
      //
      // reciever part
      case 'call-answered-recieved':
        if(data?.payload?.id && data?.payload?.recieverANSWER && data?.payload?.type){
          await webRTC?.peer?.sender?.setRemoteDescription(data?.payload?.recieverANSWER)
        }
        break;
      //
      //
      case "call-user-iceCandidate-recieved":
        if (data?.payload?.iceCandidate) {
          await webRTC?.peer?.sender?.addIceCandidate(
            data?.payload?.iceCandidate
          );
          await webRTC?.peer?.reciever?.addIceCandidate(
            data?.payload?.iceCandidate
          );
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

import { createContext, useContext, useEffect, useState } from "react";
import { socketContext } from "./socket";
import { iOpenChatValue, OpenChatContext } from "./OpenedChat";

export type iwebRTCcontext = {
  peer: iPeer;
  setPeer: (x: iPeer) => void;
  setCall: (x: iCall) => void;
  call: iCall;
  media: MediaStream;
  setMedia: (x: MediaStream) => void;
};
export type iPeer = {
  sender: RTCPeerConnection;
  reciever: RTCPeerConnection;
};
type iCall = {
  user: {
    id: string;
  };
  type: string;
  answered:boolean
};

export const webRTCcontext = createContext<iwebRTCcontext | {}>({});

export function WebRTCcontextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useContext(socketContext) as WebSocket;
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const [call, setCall] = useState<iCall>();
  const [media, setMedia] = useState<MediaStream>();
  const [peer, setPeer] = useState<iPeer>({
    sender: new RTCPeerConnection(),
    reciever: new RTCPeerConnection(),
  });
  if (peer?.sender) {
    peer.sender.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-user-iceCandidate",
            payload: { id: call?.user?.id, iceCandidate: event?.candidate },
          })
        );
      }
    };
    peer.sender.onnegotiationneeded = async ()=>{
        let offer = await peer?.sender?.createOffer();
    await peer?.sender?.setLocalDescription(offer);
    socket.send(
      JSON.stringify({
        event: "call-offer",
        payload: {
          id: openChat?.currentUniqueUserId,
          type:call?.type,
          senderOFFER: peer?.sender?.localDescription,
        },
      })
    );
    }
  }
  if (peer?.reciever) {
    peer.reciever.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-user-iceCandidate",
            payload: { id: call?.user?.id, iceCandidate: event?.candidate },
          })
        );
      }
    };
  }

  return (
    <webRTCcontext.Provider
      value={{ peer, setPeer, call, setCall, media, setMedia }}
    >
      {children}
    </webRTCcontext.Provider>
  );
}

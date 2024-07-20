import { createContext, useContext, useEffect, useState } from "react";
import { socketContext } from "./socket";
import { iOpenChatValue, OpenChatContext } from "./OpenedChat";

export type iwebRTCcontext = {
  peer: iPeer;
  setCall: (x: iCall |{}) => void;
  call: iCall;
};
export type iPeer = {
  sender: RTCPeerConnection;
  reciever: RTCPeerConnection;
};
export type iCall = {
  user: {
    id: string;
    username?: string;
    name?: string;
    email?: string;
  };
  iceCandidate?: any;
  senderOffer?: any;
  type: string;
  Useris: "sender" | "reciever";
  answered: boolean;
};

export const webRTCcontext = createContext<iwebRTCcontext | {}>({});

export function WebRTCcontextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [call, setCall] = useState<iCall | {}>({});
  const socket = useContext(socketContext) as WebSocket;
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const [peer, setPeer] = useState<iPeer>({
    sender: new RTCPeerConnection(),
    reciever: new RTCPeerConnection(),
  });
  useEffect(() => {
    console.log("call from rtc:", call);
  });
  if (peer?.sender) {
    peer.sender.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-user-iceCandidate",
            
            payload: {
              id: (call as iCall)?.user?.id,
              from:'sender',
              iceCandidate: event?.candidate,
            },
          })
        );
      }
    };
    peer.sender.onnegotiationneeded = async () => {
      // generating offer and starting connection
      let offer = await peer?.sender?.createOffer();
      await peer?.sender?.setLocalDescription(offer);
      socket.send(
        JSON.stringify({
          event: "call-offer",
          payload: {
            id: (call as iCall)?.user?.id ,
            type: (call as iCall)?.type,
            offer: peer?.sender?.localDescription,
          },
        })
      );
    };
  }
  if (peer?.reciever) {
    peer.reciever.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-user-iceCandidate",
            payload: {
              id: (call as iCall)?.user?.id,
              from:'reciever',
              iceCandidate: event?.candidate,
            },
          })
        );
      }
    };
  }

  return (
    <webRTCcontext.Provider value={{ peer, call, setCall }}>
      {children}
    </webRTCcontext.Provider>
  );
}

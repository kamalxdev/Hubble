import { createContext, useContext, useEffect, useState } from "react";
import { socketContext } from "./socket";

export type iwebRTCcontext = {
  peer: iPeer;
  setCall: (x: iCall | {}) => void;
  call: iCall;
  setPeer: (x: iPeer) => void;
  sendVideo:()=>void
};
export type iPeer = {
  sender: RTCPeerConnection | null;
  reciever: RTCPeerConnection | null;
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

  const [peer, setPeer] = useState<iPeer>({
    sender: null,
    reciever: null,
  });
  // useEffect(() => {
  //   console.log("call from rtc:", call);
  // });
  useEffect(()=>{
    // if(peer?.sender && !peer?.sender?.remoteDescription){sendVideo()}
    if(!peer?.sender){
      setPeer({...peer,
        sender: new RTCPeerConnection()
      })
    }
    if(!peer?.reciever){
      setPeer({...peer,
        reciever: new RTCPeerConnection()
      })
    }
  },[peer])
  function sendVideo() {
    if(peer?.sender){
      navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        peer?.sender?.addTrack(stream.getAudioTracks()[0]);
        peer?.sender?.addTrack(stream.getVideoTracks()[0]);
        // stream.getTracks().forEach((track) => {
        //   peer?.sender?.addTrack(track);
        // });
      });
    }
  }
  if (peer?.sender) {
    peer.sender.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-user-iceCandidate",

            payload: {
              id: (call as iCall)?.user?.id,
              from: "sender",
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
            id: (call as iCall)?.user?.id,
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
              from: "reciever",
              iceCandidate: event?.candidate,
            },
          })
        );
      }
    };
  }

  return (
    <webRTCcontext.Provider value={{ peer, call, setCall, setPeer ,sendVideo}}>
      {children}
    </webRTCcontext.Provider>
  );
}

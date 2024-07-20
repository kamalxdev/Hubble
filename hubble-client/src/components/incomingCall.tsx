import { User } from "lucide-react";
import { memo, useContext, useEffect } from "react";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";
import useGetData from "../hooks/axios/getData";
import { useCookies } from "react-cookie";
import { iUser } from "../types/user";
import { socketContext } from "../context/socket";

function IncomingCall() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const socket = useContext(socketContext) as WebSocket;

  const [cookies] = useCookies();

  const getUser = useGetData(
    `/user?id=${webRTC?.call?.user?.id}`,
    {
      headers: {
        authorization: cookies["auth"],
      },
    },
    true,
    [webRTC?.call?.user?.id]
  );

  // call ringtone
  const audio = new Audio("/audio/ring.mp3");

  // function to handle call answer
  async function handleAnswerCall() {
    audio.pause();

    // streaming media from reciever side
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          webRTC?.peer?.sender?.addTrack(track);
        });
      });

    socket.send(JSON.stringify({event:'call-user-answer',payload:{id:webRTC?.call?.user?.id,accepted:true,type:webRTC?.call?.type}}))
    // await webRTC?.peer?.reciever?.setRemoteDescription(
    //   webRTC?.call?.senderOffer
    // );
    // const recieverANSWER = await webRTC?.peer?.reciever?.createAnswer();
    // await webRTC?.peer?.reciever?.setLocalDescription(recieverANSWER);
    // let senderOFFER = await webRTC?.peer?.sender?.createOffer();
    // await webRTC?.peer?.sender?.setLocalDescription(senderOFFER);

    // webRTC?.setCall({...webRTC?.call,answered:true})

    // socket.send(
    //   JSON.stringify({
    //     event: "call-answer",
    //     payload: {
    //       id: webRTC?.call?.user?.id,
    //       recieverANSWER: webRTC?.peer?.reciever?.localDescription,
    //       senderOFFER: webRTC?.peer?.sender?.localDescription,
    //       type: webRTC?.call?.type,
    //     },
    //   })
    // );
  }

  // function to handle call rejection
  function handleRejectCall() {
    audio.pause();
    webRTC?.setCall({})
    socket.send(JSON.stringify({event:'call-user-answer',payload:{id:webRTC?.call?.user?.id,accepted:false,type:webRTC?.call?.type}}))
  }

  useEffect(() => {
    if (getUser?.response?.success) {
      audio.loop = true;
      audio.play();
      webRTC.setCall({
        ...webRTC.call,
        user: getUser?.response?.user as iUser,
      });
      // webRTC.call={...webRTC.call,user:getUser?.response?.user as iUser}
    }
    // let timeout=setTimeout(()=>{handleRejectCall},10000)
    return () => {
      audio.pause();
    };
  }, []);

  return (
    <div
      className={`absolute first-letter top-5 z-50 w-full justify-center flex`}
    >
      <div className="flex justify-start items-center gap-4 p-2 mx-5 my-2 bg-slate-900 text-white  transition rounded-md animate-bounce">
        <span
          key={"call_user_avatar"}
          className="flex justify-center items-center border rounded-full border-white p-1"
        >
          <User />
        </span>
        <span className="flex flex-col w-full font-semibold">
          <h1>{webRTC?.call?.user?.name}</h1>
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={handleAnswerCall}
            className="rounded-md py-1 px-3 bg-green-700 outline-green-900 text-white transition hover:bg-green-800  text-sm font-semibold"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleRejectCall}
            className="rounded-md py-1 px-3 bg-red-600 text-white transition hover:bg-red-800 text-sm font-semibold"
          >
            Reject
          </button>
        </span>
      </div>
    </div>
  );
}

export default memo(IncomingCall);

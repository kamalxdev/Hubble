import { memo, useContext, useEffect } from "react";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";
import useGetData from "../hooks/axios/getData";
import { socketContext } from "../context/socket";

function IncomingCall() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const socket = useContext(socketContext) as WebSocket;


  const getUser = useGetData(
    `/user?id=${webRTC?.call?.user?.id}`,
    {},
    true,
    [webRTC?.call?.user?.id]
  );
  useEffect(()=>{
    if(getUser?.response?.user){
      webRTC?.setCall({...webRTC?.call,user:getUser?.response?.user})
    }
  },[getUser?.response?.user])
  
  // call ringtone
  const audio = new Audio("/audio/ring.mp3");
  if (getUser?.response?.success) {
    audio.loop = true;
    audio.play();
  }
  const callTimeout=setTimeout(()=>{
    audio.pause();
    if(!webRTC?.call?.answered){
      webRTC?.setCall({})
    socket.send(JSON.stringify({event:'call-user-answer',payload:{id:webRTC?.call?.user?.id,accepted:false,type:webRTC?.call?.type}}))
    }
  },10000)

  useEffect(()=>{
    return () => {
      audio.pause();
      audio.remove();
      clearTimeout(callTimeout)
    };
  },[callTimeout])


  // function to handle call answer
  function handleAnswerCall() {
    navigator.mediaDevices.getUserMedia({audio:webRTC?.call?.type=='video',video:true}).then(()=>{

      audio.pause();
      // streaming media from reciever side
      webRTC?.sendData(webRTC?.call?.type)
      socket.send(JSON.stringify({event:'call-user-answer',payload:{id:webRTC?.call?.user?.id,accepted:true,type:webRTC?.call?.type,callID:webRTC?.call?.callID}}))
    })
  }

  // function to handle call rejection
  function handleRejectCall() {
    audio.pause();
    webRTC?.setCall({})
    socket.send(JSON.stringify({event:'call-user-answer',payload:{id:webRTC?.call?.user?.id,accepted:false,type:webRTC?.call?.type,callID:webRTC?.call?.callID}}))
  }
  return (
    <div
      className={`absolute first-letter top-5 z-50 w-full justify-center ${getUser?.response?.success?"flex":'hidden'} `}
    >
      <div className="flex justify-start items-center gap-4 p-2 mx-5 my-2 bg-slate-900 text-white  transition rounded-md animate-bounce">
        <img
        src={
          getUser?.response?.user?.avatar
            ? getUser?.response?.user?.avatar
            : import.meta.env.VITE_DEFAULT_AVATAR_URL
        }
        className="flex justify-center items-center border rounded-full w-9"
      />
        <span className="flex flex-col w-full font-semibold">
          <h1>{getUser?.response?.user?.name}</h1>
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

import { Maximize, MicOff, Phone, VideoOff } from "lucide-react";
import { memo, useContext, useEffect, useRef } from "react";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";

function PhoneBox() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  if(!webRTC?.call?.user?.id){
    return <div className="bg-slate-950 w-full h-full flex justify-center items-center text-white"></div>;
  }
  return (
    <div className="w-full h-full bg-slate-950 ">
      <VideoCall />
      <div className="absolute w-full h-full top-0 z-40 flex flex-col items-center justify-end pb-5">
        <div className="bg-slate-800 flex gap-3 w-auto pr-7 pl-5 py-2 rounded-md ">
          <button
            type="button"
            className="text-white p-3 rounded-md transition hover:bg-slate-700"
            title="Mic off"
          >
            <MicOff size={20}/>
          </button>
          <button
            type="button"
            className="text-white p-3 rounded-md hover:bg-slate-700 transition"
            title="Video off"
          >
            <VideoOff size={20}/>
          </button>
          <button
            type="button"
            className="text-white p-3 rounded-md hover:bg-slate-700 transition"
            title="Full screen"
          >
            <Maximize size={20}/>
          </button>
          <button
            type="button"
            className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition"
            title="End call"
          >
            <Phone className="origin-center rotate-[138deg]" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// const VoiceCall = memo(function VoiceCall() {
//   return <div></div>;
// });

const VideoCall = memo(function VideoCall() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;

  const another_user_video = useRef<HTMLVideoElement>(null);
  const current_user_video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (current_user_video?.current) {
          current_user_video.current.srcObject = stream;
        }
      });
      if (webRTC?.peer?.reciever) {
        webRTC.peer.reciever.ontrack = (event) => {
          if (another_user_video?.current) {
            another_user_video.current.srcObject = new MediaStream([
              event.track,
            ]);
          }
        };
      }
    setTimeout(() => {
      if (webRTC?.peer?.reciever) {
        const track1= webRTC?.peer?.reciever?.getTransceivers()[0]?.receiver?.track
        const track2= webRTC?.peer?.reciever?.getTransceivers()[1]?.receiver?.track

          if (another_user_video?.current) {
            
            another_user_video.current.srcObject = new MediaStream([track1,track2]);
          }
      }
    }, 5000);
  }, []);
  return (
    <div className="w-full h-full ">
      <div className="w-full h-full">
        <video
          autoPlay
          ref={another_user_video}
          className="w-full h-full rounded-md "
        ></video>
      </div>
      <div className="absolute w-2/12 h-auto z-40 bottom-20 right-20">
        <video
          autoPlay
          ref={current_user_video}
          muted
          className="w-full h-full rounded-md"
        ></video>
      </div>
    </div>
  );
});

export default memo(PhoneBox);

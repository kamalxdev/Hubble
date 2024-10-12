import { Maximize, MicOff, Phone, VideoOff } from "lucide-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";
import { socketContext } from "../context/socket";

function PhoneBox() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const socket = useContext(socketContext) as WebSocket;
  const [togglebtn, setToggleBtn] = useState({
    audio: true,
    video: true,
  });
  
  function handleEndCall() {
    webRTC?.peer?.sender?.close();
    webRTC?.peer?.reciever?.close();
    webRTC?.setPeer({
      sender: new RTCPeerConnection(),
      reciever: new RTCPeerConnection(),
    });
    socket.send(
      JSON.stringify({
        event: "call-end",
        payload: { id: webRTC?.call?.user?.id },
      })
    );
    webRTC?.setCall({});
  }
  function handleToggleMic() {
    if (webRTC?.peer?.sender?.getSenders()[1]?.track?.kind == "audio") {
      (webRTC.peer.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !webRTC?.peer?.sender?.getSenders()[1]?.track?.enabled;
    } else if (webRTC?.peer?.sender?.getSenders()[0]?.track?.kind == "audio") {
      (
        (webRTC.peer.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !webRTC?.peer?.sender?.getSenders()[0]?.track?.enabled;
    }
    setToggleBtn({ ...togglebtn, audio: !togglebtn.audio });
    console.log(
      "audio: ",
      webRTC?.peer?.sender?.getSenders()[0].track?.enabled
    );
  }
  async function handleToggleVideo() {
    if (webRTC?.peer?.sender?.getSenders()[1]?.track?.kind == "video") {
      (webRTC.peer.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !webRTC?.peer?.sender?.getSenders()[1]?.track?.enabled;
    } else if (webRTC?.peer?.sender?.getSenders()[0]?.track?.kind == "video") {
      (
        (webRTC.peer.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !webRTC?.peer?.sender?.getSenders()[0]?.track?.enabled;
    }
    setToggleBtn({ ...togglebtn, video: !togglebtn.video });
  }
  if (!webRTC?.call?.user?.id) {
    return (
      <div className="bg-slate-950 w-full h-full flex justify-center items-center text-white text-opacity-20">
        Your calls will be visible here
      </div>
    );
  }
  return (
    <section className="lg:absolute lg:p-5 lg:pl-2 w-full h-full">
    <div className="relative  w-full h-full bg-slate-900 top-0 rounded-md ">
      {webRTC?.call?.type == "video" ? (
        <VideoCall video={togglebtn?.video} />
      ) : (
        <VoiceCall />
      )}
      <div className="absolute w-full h-full top-0 z-40 flex flex-col items-center justify-end lg:pb-5">
        <div className="bg-slate-950 justify-around flex lg:gap-3 w-full lg:w-auto pr-7 pl-5 py-2 lg:rounded-md">
          <button
            type="button"
            className={`text-white p-3 rounded-md  transition ${
              togglebtn?.audio
                ? "bg-transparent hover:bg-slate-700"
                : "bg-green-500 hover:bg-green-700 "
            }`}
            title="Mic off"
            onClick={handleToggleMic}
          >
            <MicOff size={20} />
          </button>
          {webRTC?.call?.type == "video" && (
            <button
              type="button"
              className={`text-white p-3 rounded-md  transition ${
                togglebtn?.video
                  ? "bg-transparent hover:bg-slate-700"
                  : "bg-green-500 hover:bg-green-700 "
              }`}
              title="Video off"
              onClick={handleToggleVideo}
            >
              <VideoOff size={20} />{" "}
            </button>
          )}

          <button
            type="button"
            disabled
            className="text-white p-3 rounded-md hover:bg-slate-700 transition"
            title="Full screen"
          >
            <Maximize size={20} />
          </button>
          <button
            type="button"
            className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition"
            title="End call"
            onClick={handleEndCall}
          >
            <Phone className="origin-center rotate-[138deg]" size={20} />
          </button>
        </div>
      </div>
    </div>
    </section>
  );
}

const VideoCall = memo(function VideoCall(props: { video: boolean }) {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;

  const another_user_video = useRef<HTMLVideoElement>(null);
  const current_user_video = useRef<HTMLVideoElement>(null);
  const another_user_mic = useRef<HTMLAudioElement>(null);
  if (!props.video) {
    current_user_video?.current?.pause();
  } else {
    current_user_video?.current?.play();
  }

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
          another_user_video.current.srcObject = new MediaStream([event.track]);
        }
      };
    }
    if (webRTC?.peer?.reciever) {
      const track1 =
        webRTC?.peer?.reciever?.getTransceivers()[0]?.receiver?.track;
      const track2 =
        webRTC?.peer?.reciever?.getTransceivers()[1]?.receiver?.track;

      if (
        another_user_video?.current &&
        another_user_mic.current &&
        track1 &&
        track2
      ) {
        const another_user_audio = new Audio();
        another_user_audio.srcObject = new MediaStream([track1]);
        another_user_audio.play();
        another_user_mic.current.srcObject = new MediaStream([track1]);
        another_user_video.current.srcObject = new MediaStream([track2]);
      }
    }
  }, [webRTC?.peer?.reciever?.getTransceivers()[1]?.receiver?.track, webRTC?.peer?.reciever?.getTransceivers()[0]?.receiver?.track]);
  return (
    <div className="w-full h-full">
      <div className="w-full h-full object-contain flex items-center justify-center">
        <video
          autoPlay
          ref={another_user_video}
          className="absolute rounded-md w-full h-full"
        ></video>
        <audio ref={another_user_mic} className="hidden" autoPlay></audio>
      </div>
      <div className="absolute w-2/12 h-auto z-40 bottom-20 right-20 drop-shadow-2xl">
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

const VoiceCall = memo(function VideoCall() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;

  const another_user_mic = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (webRTC?.peer?.reciever) {
      const track =
        webRTC?.peer?.reciever?.getTransceivers()[0]?.receiver?.track;
      if (another_user_mic.current && track) {
        const another_user_audio = new Audio();
        another_user_audio.srcObject = new MediaStream([track]);
        another_user_audio.play();
        another_user_mic.current.srcObject = new MediaStream([track]);
      }
    }
  }, [webRTC?.peer?.reciever?.getTransceivers()[0]?.receiver?.track]);
  return (
    <div className="w-full h-full ">
      <div className="w-full h-full">
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={
              webRTC?.call?.user?.avatar
                ? webRTC?.call?.user?.avatar
                : import.meta.env.VITE_DEFAULT_AVATAR_URL
            }
            className="flex justify-center items-center border-4 p-3 border-green-500 rounded-full animate-pulse w-48"
          />
          <img
            src={
              webRTC?.call?.user?.avatar
                ? webRTC?.call?.user?.avatar
                : import.meta.env.VITE_DEFAULT_AVATAR_URL
            }
            className=" absolute flex justify-center items-center border-4 p-3 border-green-500 rounded-full animate-ping w-40"
          />
        </div>
        <audio ref={another_user_mic} className="hidden" autoPlay></audio>
      </div>
      <div className="absolute w-2/12 h-auto z-40 bottom-20 right-20 drop-shadow-2xl"></div>
    </div>
  );
});

export default memo(PhoneBox);

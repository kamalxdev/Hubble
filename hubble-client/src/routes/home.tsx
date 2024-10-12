import Chatbox from "../components/chatbox";
import Messages from "../components/messages";
import useGetData from "../hooks/axios/getData";
import { useContext, useEffect } from "react";
import IncomingCall from "../components/incomingCall";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";
import Calls from "../components/calls";
import PhoneBox from "../components/phoneBox";
import { iToggleContext, toggleContext } from "../context/toggle";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import Avatar from "../components/avatar";
import Profile from "../components/profile";
import { X } from "lucide-react";

export default function Home() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;
  const toggle = useContext(toggleContext) as iToggleContext;
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const cUser = useGetData(`/user/verify`, {}, true);
  useEffect(() => {
    if (cUser.response && !cUser?.response?.success) {
      console.log({ cUser });
      window.location.href = "/login";
    }
  }, [cUser]);

  return (
    <>
      {webRTC?.call?.user?.id &&
        webRTC?.call?.Useris == "reciever" &&
        (webRTC?.call?.answered ? "" : <IncomingCall />)}

      <div className=" transition flex flex-col-reverse lg:flex-row w-full h-dvh lg:h-screen ">
        <div className=" lg:grid lg:grid-cols-3 w-full h-full bg-slate-950">
          {(toggle.sidebar == "calls" && (
                <section className="absolute lg:relative w-full transition-all z-30 h-full">
                  <Calls />
                </section>
            ))}
          {toggle.sidebar == "chats" && (
              <section className="absolute lg:relative w-full transition-all z-30 h-full">
                <Messages key={"messages"} />
              </section>
          )}
          {toggle.sidebar == "profile" && (
            
              <section className="w-full h-full transition-all z-50 lg:z-30 bg-slate-950 py-10 flex flex-col gap-5 overflow-y-scroll">
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    title="Close"
                    className="p-2 mr-2 text-white opacity-70 transition-all hover:text-black hover:bg-red-500 rounded-full"
                    onClick={() => toggle.setSidebar("chats")}
                  >
                    <X />
                  </button>
                </div>{" "}
                <Avatar />
                <Profile />
              </section>
          )}
          {(webRTC?.call?.user?.id && webRTC?.call?.Useris == "sender") ||
          (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered) ? (
            <section
              className={`w-full h-full transition-all absolute top-0 lg:relative col-span-2 z-40 lg:block ${
                (webRTC?.call?.user?.id && webRTC?.call?.Useris == "sender") ||
                (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered)
                  ? "block"
                  : "hidden"
              }`}
            >
              <PhoneBox />
            </section>
          ) : (
            <section
              className={` w-full h-full transition-all absolute top-0 lg:relative col-span-2 z-40 lg:block ${
                openChat?.currentUniqueUserId ? "block" : "hidden"
              }`}
            >
              <Chatbox />
            </section>
          )}
        </div>
      </div>
    </>
  );
}

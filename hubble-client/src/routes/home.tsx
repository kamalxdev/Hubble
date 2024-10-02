import Chatbox from "../components/chatbox";
import Messages from "../components/messages";
import Sidebar from "../components/sidebar";
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
        <Sidebar />
        <div className=" lg:grid lg:grid-cols-3 w-full h-full bg-slate-950">
          {(webRTC?.call?.user?.id && webRTC?.call?.Useris == "sender") ||
            (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered) ||
            (toggle.sidebar == "calls" && (
              <>
                <section className="absolute lg:relative w-full transition-all shadow-xl z-30 h-full">
                  <Calls />
                </section>
              </>
            ))}
          {toggle.sidebar == "chats" && (
            <>
              <section className="absolute lg:relative w-full transition-all z-30 h-full">
                <Messages key={"messages"} />
              </section>
            </>
          )}
          {toggle.sidebar == "profile" && (
            <>
              <section className="w-full h-full transition-all z-50 bg-slate-900 py-10 flex flex-col gap-5">
                <Avatar />
                <Profile />
              </section>
            </>
          )}
          {(webRTC?.call?.user?.id && webRTC?.call?.Useris == "sender") ||
          (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered) ? (
            <section
              className={`w-full h-full lg:h-screen transition-all absolute top-0 lg:relative col-span-2 z-40 lg:block ${
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

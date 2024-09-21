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

      <div className="transition flex flex-cols w-full">
        <Sidebar />
        <div className="lg:grid lg:grid-cols-3 w-full">
          {(webRTC?.call?.user?.id && webRTC?.call?.Useris == "sender") ||
          (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered) ||
          toggle.sidebar == "calls" ? (
            <>
              <section className="transition-all shadow-xl">
                <Calls />
              </section>
              <section
                className={`w-full h-screen transition-all absolute top-0 lg:relative col-span-2 z-40 lg:block ${
                  (webRTC?.call?.user?.id &&
                    webRTC?.call?.Useris == "sender") ||
                  (webRTC?.call?.Useris == "reciever" && webRTC?.call?.answered)
                    ? "block"
                    : "hidden"
                }`}
              >
                <PhoneBox />
              </section>
            </>
          ) : (
            <>
              <section className="transition-all">
                <Messages key={"messages"} />
              </section>
              <section
                className={`w-full transition-all absolute top-0 lg:relative col-span-2 z-40 lg:block ${
                  openChat?.currentUniqueUserId ? "block" : "hidden"
                }`}
              >
                <Chatbox />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

import Chatbox from "../components/chatbox";
import Messages from "../components/messages";
import Sidebar from "../components/sidebar";
import useGetData from "../hooks/axios/getData";
import { useCookies } from "react-cookie";
import { useContext, useEffect } from "react";
import IncomingCall from "../components/incomingCall";
import { iwebRTCcontext, webRTCcontext } from "../context/webRTC";
import Calls from "../components/calls";
import PhoneBox from "../components/phoneBox";

export default function Home() {
  const webRTC = useContext(webRTCcontext) as iwebRTCcontext;

  const [cookies] = useCookies();

  const cUser = useGetData(
    `/user/verify`,
    {
      headers: {
        authorization: cookies["auth"],
      },
    },
    true
  );
  useEffect(() => {
    if (cUser.response && !cUser?.response?.success) {
      console.log({ cUser });
      window.location.href = "/login";
    }
  }, [cUser]);

  return (
    <>
      {(webRTC?.call?.user?.id && webRTC?.call?.Useris=='reciever') && (webRTC?.call?.answered?'':<IncomingCall />)}

      <div className="transition flex flex-cols w-full">
        <Sidebar theme="white" />
        <div className="grid grid-cols-3 w-full">
          {(webRTC?.call?.user?.id && webRTC?.call?.Useris=='sender') || (webRTC?.call?.Useris=='reciever' && webRTC?.call?.answered)  ? (
            <>
              <section className="transition-all shadow-xl">
                <Calls />
              </section>
              <section className="transition-all  relative col-span-2">
                <PhoneBox />
              </section>
            </>
          ) : (
            <>
              <section className="transition-all ">
                <Messages key={"messages"} />
              </section>
              <section className="transition-all relative col-span-2">
                <Chatbox />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

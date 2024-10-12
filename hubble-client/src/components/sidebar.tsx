import { Chat, Phone } from "phosphor-react";
import { memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iToggleContext, toggleContext } from "../context/toggle";

function Sidebar() {
  const user = useContext(currentUser) as iCurrentUserContext;
  const toggle = useContext(toggleContext) as iToggleContext;
  const hover_btn_class =
    "hover:bg-slate-700 py-2 px-3 rounded-md transition flex flex-col items-center justify-center gap-2";
  return (
    <section className=" flex flex-row items-center justify-between py-2 px-7 lg:w-full w-screen bg-slate-950 z-40 text-white shadow-[-5px_-2px_50px_-12px_#1a202c] rounded-t-3xl">
      <div className="flex flex-row gap-2">
        <button
          type="button"
          className={hover_btn_class }
          onClick={() => toggle?.setSidebar("profile")}
        >
          <img
            src={user?.user?.avatar ? user?.user?.avatar:
              import.meta.env.VITE_DEFAULT_AVATAR_URL
            }
            className="flex justify-center items-center border rounded-full w-6"
          /> <p className="opacity-50 font-semibold text-sm">Profile</p>
        </button>

        <div className="flex flex-row gap-2">
          <button
            type="button"
            title="Chat"
            className={ `${toggle?.sidebar=="chats" && "bg-slate-800"} + ${hover_btn_class}`}
            onClick={() => toggle?.setSidebar("chats")}
          >
            <Chat size={24} className="relative" /><p className="opacity-50 font-semibold text-sm">Chats</p>
          </button>
          <button
            type="button"
            title="Calls"
            className={ `${toggle?.sidebar=="calls" && "bg-slate-800"} + ${hover_btn_class}`}
            onClick={() => toggle?.setSidebar("calls")}
          >
            <Phone size={24} className="relative" /><p className="opacity-50 font-semibold text-sm">Calls</p>
          </button>
          {/* <button
            type="button"
            title="Notes"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("chats")}
          >
            <Notepad size={28} className="relative" />
          </button> */}
        </div>
      </div>
      {/* <div className="flex">
        <button type="button" title="Setting">
          <Gear size={28} />
        </button>
      </div> */}
    </section>
  );
}

export default memo(Sidebar);

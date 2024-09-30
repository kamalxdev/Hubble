import { Chat, Phone } from "phosphor-react";
import { memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iToggleContext, toggleContext } from "../context/toggle";

function Sidebar() {
  const user = useContext(currentUser) as iCurrentUserContext;
  const toggle = useContext(toggleContext) as iToggleContext;
  const hover_btn_class =
    "hover:bg-slate-700 lg:p-3 py-1 px-3 rounded-md transition";
  return (
    <section className=" absolute bottom-0 lg:top-0 lg:relative flex flex-row lg:flex-col items-center justify-between lg:p-2 p-3 lg:py-10 py-1 lg:w-auto w-screen h-auto bg-slate-800 z-40 text-white">
      <div className="lg:w-full lg:block flex flex-row">
        <button
          type="button"
          className="w-full p-2"
          onClick={() => toggle?.setSidebar("profile")}
        >
          <img
            src={user?.user?.avatar ? user?.user?.avatar:
              import.meta.env.VITE_DEFAULT_AVATAR_URL
            }
            className="flex justify-center items-center border rounded-full w-11"
          />
        </button>

        <div className="flex flex-row lg:flex-col lg:mt-5 gap-2">
          <button
            type="button"
            title="Chat"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("chats")}
          >
            <Chat size={28} className="relative" />
          </button>
          <button
            type="button"
            title="Calls"
            className={hover_btn_class}
            onClick={() => toggle?.setSidebar("calls")}
          >
            <Phone size={28} className="relative" />
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

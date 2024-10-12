import { Fragment, memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import { iUser } from "../types/user";
import MessagesLoader from "../loader/messages";
import SearchBar from "./searchBar";
import Sidebar from "./sidebar";

function Messages() {
  const user = useContext(currentUser) as iCurrentUserContext;

  if (user?.loading) {
    return <MessagesLoader />;
  }
  const friends = user?.friends as iUser[];

  return (
    <section
      className="relative bg-slate-950 h-full grid grid-rows-[auto_1fr_auto] items-end"
      key={"message"}
    >
      <div className=" h-fit ">
        <SearchBar placeholder="Search users" for="user" />
      </div>
      <div
        className="relative overflow-y-scroll h-full lg:mx-5 mx-1"
        key={"hell"}
      >
        <div className="relative">
          <div
            className="absolute inline-flex flex-col justify-center w-full"
            key={"friends"}
          >
            {friends?.length >= 1 ? (
              friends?.map((friend) => (
                <Fragment key={friend?.id}>
                  <Friend
                    name={friend?.name}
                    UniqueUserID={friend?.id}
                    key={friend?.username}
                    username={friend?.username}
                    avatar={friend?.avatar}
                  />
                </Fragment>
              ))
            ) : (
              <div className="flex w-full items-center justify-center text-white opacity-50">
                No messages
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit">
        <Sidebar />
      </div>
    </section>
  );
}

type iFriendProps = {
  name: string;
  UniqueUserID: string;
  username: string;
  avatar: string | null;
};

const Friend = memo(function Friend(props: iFriendProps) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;
  var unread_Message_Count: number = 0;
  openChat?.allUserChats &&
    openChat?.allUserChats[props.UniqueUserID]?.map((chat) => {
      if (chat.type == "sender" && chat?.status == "unread") {
        unread_Message_Count++;
      }
    });

  return (
    <button
      key={props.UniqueUserID}
      onClick={() => {
        openChat?.setUniqueUserId(props.UniqueUserID);
      }}
      className={`relative w-full flex justify-start items-center gap-1 text-white transition rounded-md overflow-hidden px-5 ${
        openChat?.currentUniqueUserId === props?.UniqueUserID
          ? "bg-slate-800"
          : "hover:bg-slate-700 "
      }`}
    >
      <img
        src={
          props?.avatar
            ? props?.avatar
            : import.meta.env.VITE_DEFAULT_AVATAR_URL
        }
        className="relative w-1/12 flex justify-center items-center border rounded-full"
      />
      <span
        className="relative w-11/12 flex flex-col border-y p-2 border-slate-800 "
        key={"user_details"}
      >
        <span className="flex justify-between">
          <span className="inline-flex items-center gap-2">
            <h1>{props.name}</h1>{" "}
            {unread_Message_Count > 0 && (
              <span className="text-[0.65rem] text-slate-900 rounded-full bg-green-500 w-5 h-5 font-bold flex items-center justify-center">
                {unread_Message_Count > 99 ? (
                  <p>99+</p>
                ) : (
                  <p>{unread_Message_Count}</p>
                )}
              </span>
            )}
          </span>
          <h3 className="opacity-75 text-xs">@{props.username}</h3>
        </span>
        <span
          className=" flex justify-between items-end text-slate-400 text-sm "
          key={"last_Chat_detail"}
        >
          {openChat?.typing && openChat?.typing[props.UniqueUserID] ? (
            <h6 className="text-xs text-green-500 font-semibold transition-all">
              typing...
            </h6>
          ) : (
            <>
              <p className="truncate w-9/12 text-left">
                {openChat?.allUserChats &&
                  openChat?.allUserChats[props?.UniqueUserID] &&
                  openChat?.allUserChats[props?.UniqueUserID][
                    openChat?.allUserChats[props.UniqueUserID]?.length - 1
                  ]?.message}
              </p>

              <p
                className={`text-xs ${
                  unread_Message_Count > 0 && "text-green-500"
                }`}
              >
                {openChat?.allUserChats &&
                openChat?.allUserChats[props?.UniqueUserID]
                  ? new Date(
                      openChat?.allUserChats[props?.UniqueUserID][
                        openChat?.allUserChats[props?.UniqueUserID]?.length - 1
                      ].time
                    )
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .toLowerCase()
                  : ""}
              </p>
            </>
          )}
        </span>
      </span>
    </button>
  );
});

export default memo(Messages);

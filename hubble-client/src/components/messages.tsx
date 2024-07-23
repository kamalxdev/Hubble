import { User } from "lucide-react";
import { Fragment, memo, useContext } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";
import { iUser } from "../types/user";
import MessagesLoader from "../loader/messages";
import SearchBar from "./searchBar";

function Messages() {
  const user = useContext(currentUser) as iCurrentUserContext;

  if (user.currentuser.loading || user.allUser.loading) {
    return <MessagesLoader />;
  }
  if (!user.allUser.response.success) {
    return <div>{user.allUser.error}</div>;
  }
  const friends = user?.allUser?.response?.allUser as iUser[];
  return (
    <section className="bg-slate-900" key={"message"}>
      <SearchBar placeholder="Search users" for='user'/>
      <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
        <div
          className=" inline-flex flex-col justify-center w-full"
          key={"friends"}
        >
          {friends.map((friend) => {
            return (
              <Fragment key={friend.id}>
                <Friend
                  name={friend.name}
                  UniqueUserID={friend.id}
                  key={friend.username}
                  username={friend?.username}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}


type iFriendProps = {
  name: string;
  UniqueUserID: string;
  username: string;
};

const Friend = memo(function Friend(props: iFriendProps) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  return (
    <button
      key={props.UniqueUserID}
      onClick={() => {
        openChat?.setUniqueUserId(props.UniqueUserID);
      }}
      className={`inline-flex justify-start items-center gap-4 px-2 mx-5 text-white transition rounded-md ${
        openChat?.currentUniqueUserId === props?.UniqueUserID
          ? "bg-slate-800"
          : "hover:bg-slate-700 "
      }`}
    >
      <span
        key={"user_avatar"}
        className="flex justify-center items-center border rounded-full p-1 border-white"
      >
        <User />
      </span>
      <span
        className="flex flex-col w-full border-y p-2 border-slate-800 "
        key={"user_details"}
      >
        <span className="flex justify-between">
          <h1>{props.name}</h1>
          <h3 className="opacity-75 text-xs">@{props.username}</h3>
        </span>
        <span
          className="flex justify-between items-end text-slate-400 text-sm"
          key={"last_Chat_detail"}
        >
          {openChat?.typing && openChat?.typing[props.UniqueUserID] ? (
            <h6 className="text-xs text-green-500 font-semibold transition-all">
              typing...
            </h6>
          ) : (
            <>
              <p>
                {openChat?.allUserChats &&
                openChat?.allUserChats[props.UniqueUserID]
                  ? openChat?.allUserChats[props.UniqueUserID][
                      openChat?.allUserChats[props.UniqueUserID]?.length - 1
                    ]?.message?.slice(0, 30) +
                    `${
                      openChat?.allUserChats[props.UniqueUserID][
                        openChat?.allUserChats[props.UniqueUserID]?.length - 1
                      ]?.message?.length > 30
                        ? "..."
                        : ""
                    }`
                  : "No message"}
              </p>

              <p className="text-xs">
                {openChat?.allUserChats &&
                openChat?.allUserChats[props.UniqueUserID]
                  ? new Date(
                      openChat?.allUserChats[props.UniqueUserID][
                        openChat?.allUserChats[props.UniqueUserID]?.length - 1
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

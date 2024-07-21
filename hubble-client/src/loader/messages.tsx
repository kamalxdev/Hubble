import { memo } from "react";
import { Fragment } from "react/jsx-runtime";

function MessagesLoader() {
  const friends = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];
  return (
    <section className="bg-slate-900" key={"message"}>
      <div className="flex justify-center w-full p-6 z-10 h-[10vh]">
      <div className="bg-slate-600 w-full h-full rounded-md animate-pulse"></div>
      </div>
      <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
        <div
          className=" inline-flex flex-col justify-center w-full"
          key={"friends"}
        >
          {friends.map((friend, index) => {
            return (
              <Fragment key={friend.id}>
                <FriendLoader UniqueUserID={index} key={friend.id} />
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type iFriendLoaderProps = {
  UniqueUserID: number;
};

const FriendLoader = memo(function FriendLoader(props: iFriendLoaderProps) {
  return (
    <button
      key={props.UniqueUserID}
      className={`inline-flex justify-start items-center gap-4 px-2 mx-5 text-white hover:bg-slate-600/50 transition rounded-md`}
    >
      <div className="bg-slate-600 w-8 h-7 rounded-full animate-pulse"></div>
      <span
        className="flex flex-col w-full border-y p-2 border-slate-800 "
        key={"user_details"}
      >
        <span className="flex justify-between">
          <div className="bg-slate-600 w-full h-3 rounded-md animate-pulse"></div>
        </span>
        <span
          className="flex justify-between items-end text-slate-400 text-sm"
          key={"last_Chat_detail"}
        >
          <div className="bg-slate-600 w-full h-5 rounded-md mb-2.5 mt-4 animate-pulse"></div>
        </span>
      </span>
    </button>
  );
});

export default memo(MessagesLoader);

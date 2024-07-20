import { Search, User } from "lucide-react";
import { Fragment, memo } from "react"



function Calls(){
    const friends =[
        {
            id:'sdfsdf',
            name:'Jasprit Bumrah',
            username:'bumrah'
        },
        {
            id:'sdfsdsdfsdff',
            name:'Jasprit Bumrah',
            username:'bumrah'
        },
        {
            id:'sdfsdfsdfsdf',
            name:'Jasprit Bumrah',
            username:'bumrah'
        }
    ]
    return <section className="" key={"message"}>
    <Searchbar />
    <div className="relative h-[90vh] overflow-y-scroll" key={"hell"}>
      <div
        className=" inline-flex flex-col justify-center w-full"
        key={"friends"}
      >
        {friends.map((friend, index) => {
          return (
            <Fragment key={friend.id}>
              <Friend
                name={friend.name}
                UniqueUserID={friend.id}
                key={friend.username}
                username={friend?.username}
              />
              <hr className="mx-10" key={index} />
            </Fragment>
          );
        })}
      </div>
    </div>
  </section>
}


const Searchbar = memo(function Searchbar() {
    return (
      <div className="flex justify-center w-full bg-white p-6 z-10 h-[10vh]">
        <div className="relative flex items-center gap-2 px-3 bg-slate-100 rounded-md w-full">
          <span>
            <Search size={16} />
          </span>
          <span className="w-full">
            <input
              type="search"
              placeholder="Search Calls"
              className=" w-full bg-transparent outline-none"
            />
          </span>
        </div>
      </div>
    );
  });


  type iFriendProps = {
    name: string;
    UniqueUserID: string;
    username: string;
  };
  
  const Friend = memo(function Friend(props: iFriendProps) {
  
    return (
      <button
        key={props.UniqueUserID}
        // onClick={() => {
        //   openChat?.setUniqueUserId(props.UniqueUserID);
        // }}
        className="inline-flex justify-start items-center gap-4 p-2 mx-5 my-2 hover:bg-slate-200/70 transition rounded-md"
      >
        <span
          key={"user_avatar"}
          className="flex justify-center items-center border rounded-full border-black p-1 text-black"
        >
          <User />
        </span>
        <span className="flex flex-col w-full" key={"user_details"}>
          <span className="flex justify-between">
            <h1>{props.name}</h1>
            <h3 className="text-slate-300 text-xs">@{props.username}</h3>
          </span>
          <span
            className="flex justify-between items-end text-slate-400 text-sm"
            key={"last_Chat_detail"}
          >
          </span>
        </span>
      </button>
    );
  });





export default memo(Calls)


import {Search, User } from "lucide-react";
import { memo,} from "react";




function MessagesLoader() {
    
  const friends = [{key:1},{key:2},{key:3},{key:4},{key:5}]
  return (
    <section className="animate-pulse">
      <SearchbarLoader />
      <div className="relative h-[90vh] overflow-y-scroll" >
        <div className=" inline-flex flex-col justify-center w-full">
          {/* <Friend /> */}
          {friends.map((f) => {
            return (
              <span key={'span'+f.key+'friend'}>
                <FriendLoader key={f.key}/>
                <hr className="mx-10" key={f.key+'hr'}/>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SearchbarLoader = memo(function SearchbarLoader() {
  return (
    <div className="flex justify-center w-full bg-white py-5 z-10 h-[10vh]">
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-sm">
        <span>
          <Search size={16} />
        </span>
        <span>
          <input
            type="search"
            placeholder="Search"
            className="bg-transparent outline-none"
          />
        </span>
      </div>
    </div>
  );
});



const FriendLoader = memo(function FriendLoader() {
  
  return (
    <button className="inline-flex justify-start items-center gap-4 p-2 mx-5 my-2 hover:bg-slate-200/70 transition rounded-md">
      <span key={"user_avatar"} className="flex justify-center items-center border rounded-full border-black p-1 text-black">
        <User />
      </span>
      <span className="flex flex-col w-full" key={"user_details"}>
        <span className="flex justify-between">
        <div className="bg-gray-400 h-2 rounded-full mb-2.5 mt-4 animate-pulse"></div>
        </span>
        <span className="flex justify-between text-slate-400 text-sm" key={"last_Chat_detail"}>
        <div className="bg-gray-200 h-2 rounded-full"></div>
        </span>
      </span>
    </button>
  );
});

export default memo(MessagesLoader);

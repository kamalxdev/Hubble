import { Search, User } from "lucide-react";
// import { MagnifyingGlass } from "phosphor-react"
import { memo } from "react";

function Messages() {
  const friends = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];
  return (
    <section className="">
      <Searchbar />
      <div className="relative h-[90vh] overflow-y-scroll">
        <div className=" inline-flex flex-col justify-center w-full">
          {/* <Friend /> */}
          {friends.map((index, friend) => {
            return (
              <>
                <Friend />
                <hr className="mx-10" />
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const Searchbar = memo(function Searchbar() {
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

const Friend = memo(function Friend() {
  return (
    <div className="inline-flex justify-start items-center gap-4 p-2 mx-5 my-2 hover:bg-slate-200/70 transition rounded-md">
      <span className="flex justify-center items-center border rounded-full border-black p-1 text-black">
        <User />
      </span>
      <span className="flex flex-col w-full">
        <span className="flex justify-between">
          <h1>Virat Kholi </h1>
          <h3 className="text-slate-300 text-xs">@userid</h3>
        </span>
        <span className="flex justify-between text-slate-400 text-sm">
          <p>Loreum ipsum sit itrem busdof dfds fhfisd kjl...</p>

          <p>02:45</p>
        </span>
      </span>
    </div>
  );
});

export default memo(Messages);

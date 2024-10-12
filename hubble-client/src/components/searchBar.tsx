import { Search} from "lucide-react";
import { memo, useContext, useState } from "react";
import useGetData from "../hooks/axios/getData";
import { iUser } from "../types/user";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";

type iSearchBarprops = {
  placeholder: string;
  for: "call" | "user";
};

function SearchBar(props: iSearchBarprops) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const [query, setQuery] = useState<string>("");

  const getSearchresults = useGetData(`/user/search?q=${query}`, {}, true, [
    query,
  ]);
  
  return (
    <div className="relative flex justify-center w-full h-full p-2 px-4 z-30 transition-all">
      <div className="relative w-full h-full transition-all">
        <div className="relative inline-flex flex-col items-center bg-slate-700 p-3 text-white rounded-md z-30 w-full h-full transition-all">
          <div className=" inline-flex items-center gap-2 w-full h-full">
            <span>
              <Search size={16}/>
            </span>
            <span className="w-full">
              <input
                type="search"
                onChange={(e) =>
                  setTimeout(
                    () => setQuery(e.target.value),
                    700
                  )
                }
                placeholder={props?.placeholder}
                className="bg-transparent outline-none w-full"
              />
            </span>
          </div>
          
          
          {query && getSearchresults?.response?.success && (
            <div className=" inline-flex items-center flex-col w-full z-30 mt-3 transition-all">
              {getSearchresults?.response?.searchResult.length >= 1 ? (
                getSearchresults?.response?.searchResult?.map((user: iUser) => {
                  return (
                    <SearchResult
                      id={user?.id}
                      name={user?.name}
                      username={user?.username}
                      key={"search" + user?.username}
                      avatar={
                        user?.avatar
                          ? user?.avatar
                          : import.meta.env.VITE_DEFAULT_AVATAR_URL
                      }
                      onClick={() => {
                        openChat?.setUniqueUserId(user?.id);
                        setQuery("");
                      }}
                    />
                  );
                })
              ) : (
                <h1 className="opacity-30">No results found</h1>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type iSearchresultprops = {
  name: string;
  id: string;
  username: string;
  onClick: () => void;
  avatar?: string;
};

const SearchResult = memo(function SearchResult(props: iSearchresultprops) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex items-center justify-between w-full px-2 rounded-md  transition-all hover:bg-slate-900"
      key={"search" + props.id}
    >
      <img
        src={props?.avatar}
        className="flex justify-center items-center border rounded-full w-8"
      />
      <div className="flex items-center justify-between w-full ml-3 border-y border-slate-600/30 py-2">
        <h1>{props?.name}</h1>
        <p className="text-sm opacity-75">@{props?.username}</p>
      </div>
    </button>
  );
});

export default memo(SearchBar);

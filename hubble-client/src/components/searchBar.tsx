import {Search, User } from "lucide-react";
import { memo, useContext, useState } from "react";
import useGetData from "../hooks/axios/getData";
import { iUser } from "../types/user";
import { iOpenChatValue, OpenChatContext } from "../context/OpenedChat";


type iSearchBarprops={
  placeholder:string,
  for:'call'|'user',
}


function SearchBar(props:iSearchBarprops) {
  const openChat = useContext(OpenChatContext) as iOpenChatValue;

  const [query,setQuery]=useState<string>('')

  const getSearchresults = useGetData(
    `/user/search?q=${query}`,
    {},
    true,
    [query]
  )

  
  return (
    <div className="flex justify-center w-full p-2 z-30 h-[10vh]">
      <div className="relative w-full">
        <div className="absolute inline-flex flex-col items-center bg-slate-700 p-3 text-white rounded-md z-30 w-full transition-all">
          <div className="inline-flex items-center gap-2 w-full">
            <span>
              <Search size={16} />
            </span>
            <span className="w-full">
              <input
                type="search"
                onChange={(e)=>setTimeout(()=>setQuery(e.target.value),700)}
                placeholder={props?.placeholder}
                className="bg-transparent outline-none w-full"
              />
            </span>
          </div>
          {(getSearchresults?.response?.success && query) && <div className="inline-flex items-center flex-col w-full z-30 mt-3">
            {getSearchresults?.response?.searchResult.length>=1? (getSearchresults?.response?.searchResult?.map((user:iUser)=>{
              return <SearchResult id={user?.id} name={user?.name} username={user?.username} key={'search'+user?.password} onClick={()=>
                {openChat?.setUniqueUserId(user?.id);setQuery('')}}/>
            })):<h1 className="opacity-30">No results found</h1>}
          </div>}
        </div>
      </div>
    </div>
  );
}


type iSearchresultprops={
  name:string,
  id:string,
  username:string
  onClick:()=>void
}



const SearchResult=memo(function SearchResult(props:iSearchresultprops){

  return <button
  type="button"
  onClick={props.onClick}
  className="flex items-center justify-between w-full px-2 rounded-md  transition-all hover:bg-slate-900"
  key={'search'+props.id}
>
  
    <span className="border p-1 rounded-full">
      <User size={20}/>
    </span>
  <div className="flex items-center justify-between w-full ml-3 border-y border-slate-600/30 py-2">
    <h1>{props?.name}</h1>
  <p className="text-sm opacity-75">@{props?.username}</p>
  </div>
</button>
})

export default memo(SearchBar);

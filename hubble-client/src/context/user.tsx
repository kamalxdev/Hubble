
import { createContext, useEffect, useState} from "react";
import useGetData from "../hooks/axios/getData";
import { iUser } from "../types/user";

export type iCurrentUserContext= {
    user:iUser,
    friends:iUser[],
    setUser:(user:iUser)=>void,
    setFriends:(friends:iUser[][])=>void,
    loading:Boolean
}



export const currentUser = createContext<iCurrentUserContext | {}>({})




export function CurrentUserProvider({ children }:{children:React.ReactNode}){
    const [user,setUser]=useState<iUser>()
    const [friends,setFriends]=useState<iUser[]>()
    const [loading,setloading]=useState<Boolean>(true)
    const cUser=useGetData(`/user/verify`,{},true);
    const allfriend=useGetData('/user/friends',{},true);
    
    useEffect(()=>{
        if(cUser?.response?.user){
            setUser(cUser?.response?.user)
        }
    },[cUser?.response])

    useEffect(()=>{
        if(!cUser?.loading && !allfriend?.loading){
            setloading(false)
        }
    },[cUser?.loading,allfriend?.loading])
    
    useEffect(()=>{
        if(allfriend?.response?.friends){
            setFriends(allfriend?.response?.friends)
        }

    },[allfriend?.response?.friends])
    
    return <currentUser.Provider value={{user,friends,setFriends,setUser,loading}}>
        {children}
    </currentUser.Provider>
}
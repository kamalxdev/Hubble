'use client';


import { verifyUser } from "@/actions/auth";
import { getAllUserfromDB } from "@/actions/user";
import { User } from "@prisma/client";
import { createContext, useEffect, useState } from "react";


export type iCurrentUserContext= {
    currentuser:User,
    allUser:User[]
}



export const currentUser = createContext<iCurrentUserContext | {}>({})




export function CurrentUserProvider({ children }:{children:React.ReactNode}){
    const [currentuser,setCurrentUser]=useState<User|{}>({})
    const [allUser,setAllUser]=useState<User[]>([])
    useEffect(()=>{
        verifyUser().then((data)=>{
            if(data.success){
                
                setCurrentUser(data.USER as User)
            }
        })
        getAllUserfromDB().then((data)=>{
            if(data.success){
                setAllUser(data.allUser as User[])
            }
        })
    },[])
    return <currentUser.Provider value={{currentuser,allUser}}>
        {children}
    </currentUser.Provider>
}
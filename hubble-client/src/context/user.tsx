
import { createContext, useEffect} from "react";
import useGetData, { igetData } from "../hooks/axios/getData";
import { useCookies } from "react-cookie";

export type iCurrentUserContext= {
    currentuser:igetData,
    allUser:igetData
}



export const currentUser = createContext<iCurrentUserContext | {}>({})




export function CurrentUserProvider({ children }:{children:React.ReactNode}){
    const [cookies] =useCookies()
    
    
    const authorizationHeader=  {
        headers:{
            authorization:cookies["auth"]
        }
    }
    const cUser=useGetData(`/user/verify`,authorizationHeader,true);
    const aUser=useGetData('/user/bulk',authorizationHeader,true);
    // useEffect(()=>{
    //     if(cUser.response && !cUser?.response?.success){
    //         console.log({cUser});
    //         window.location.href='/login'
    //     }
    // },[cUser])

    
    return <currentUser.Provider value={{currentuser:cUser,allUser:aUser}}>
        {children}
    </currentUser.Provider>
}
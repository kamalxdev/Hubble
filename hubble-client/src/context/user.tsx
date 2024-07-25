
import { createContext} from "react";
import useGetData, { igetData } from "../hooks/axios/getData";

export type iCurrentUserContext= {
    currentuser:igetData,
    friends:igetData
}



export const currentUser = createContext<iCurrentUserContext | {}>({})




export function CurrentUserProvider({ children }:{children:React.ReactNode}){
    
    const cUser=useGetData(`/user/verify`,{},true);
    const friends=useGetData('/user/friends',{},true);
    // useEffect(()=>{
    //     if(cUser.response && !cUser?.response?.success){
    //         console.log({cUser});
    //         window.location.href='/login'
    //     }
    // },[cUser])

    
    return <currentUser.Provider value={{currentuser:cUser,friends}}>
        {children}
    </currentUser.Provider>
}
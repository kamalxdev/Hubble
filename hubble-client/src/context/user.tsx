
import { createContext} from "react";
import useGetData, { igetData } from "../hooks/axios/getData";

export type iCurrentUserContext= {
    currentuser:igetData,
    allUser:igetData
}



export const currentUser = createContext<iCurrentUserContext | {}>({})




export function CurrentUserProvider({ children }:{children:React.ReactNode}){
    
    const cUser=useGetData(`/user/verify`,{},true);
    const aUser=useGetData('/user/bulk',{},true);
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
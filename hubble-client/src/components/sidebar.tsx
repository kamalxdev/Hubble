

import { Chat, Gear, Notepad, Phone, User } from "phosphor-react"
import { memo, useContext } from "react"
import { currentUser, iCurrentUserContext } from "../context/user";
import { Link } from "react-router-dom";


type iprops={
    theme:string
}


function Sidebar(props:iprops) {
    const user= useContext(currentUser) as iCurrentUserContext;
    const hover_btn_class='hover:bg-slate-700 p-3 rounded-md transition'
    return (
        <section className={`grid grid-cols-1 px-2 grid-rows-3 h-screen bg-slate-800 z-40 text-white`}>
            <div className="flex justify-center pt-20">
                {/* <Image src={'/vercel.svg'} width={100} height={100} alt="User_Profile_Photo"/> */}
                <Link to={'/'} >
                <span title={user?.currentuser?.response?.success && user.currentuser?(user?.currentuser?.response?.user?.name):"Your Account"} className={`flex justify-center items-center border rounded-full  p-1`} > <User size={32} className="relative"/></span>
                </Link>
            </div>
            <div className=" flex flex-col gap-10 justify-center items-center">
                <Link to={'/'} title="Chat" className={hover_btn_class}><Chat size={32} className="relative"/></Link>
                <Link to={'/'} title="Calls" className={hover_btn_class}><Phone size={32} className="relative"/></Link>
                <Link to={'/'} title="Notes" className={hover_btn_class}><Notepad size={32} className="relative"/></Link>
            </div>
            <div className= {`flex justify-center items-end pb-8`}>
                <Link to={'/'} title="Setting"><Gear size={32} /></Link>

            </div>
        </section>
    )
}



export default memo(Sidebar)
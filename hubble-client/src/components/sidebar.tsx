

import { Chat, Gear, Notepad, Phone, User } from "phosphor-react"
import { memo, useContext } from "react"
import { currentUser, iCurrentUserContext } from "../context/user";
import { Link } from "react-router-dom";


type iprops={
    theme:string
}


function Sidebar(props:iprops) {
    const user= useContext(currentUser) as iCurrentUserContext;
    
    const theme_class=(props?.theme)?(props.theme=="black"?"white":"black"):"black";
    const hover_btn_class=`before:hidden before:absolute before:-inset-2 before:bg-green-500 before:rounded-full relative hover:!text-white transition hover:before:block hover:before:animate-bounce text-${theme_class}`
    return (
        <section className={` w-20 grid grid-cols-1 grid-rows-3 h-screen shadow-2xl bg-${props?.theme} z-40`}>
            <div className="flex justify-center pt-20">
                {/* <Image src={'/vercel.svg'} width={100} height={100} alt="User_Profile_Photo"/> */}
                <Link to={'/'} >
                <span title={user?.currentuser?.response?.success && user.currentuser?(user?.currentuser?.response?.user?.name):"Your Account"} className={`flex justify-center items-center border rounded-full border-${theme_class} p-1 text-${theme_class}`} > <User size={32} className="relative"/></span>
                </Link>
            </div>
            <div className=" flex flex-col gap-10 justify-center items-center">
                <Link to={'/'} title="Chat" className={hover_btn_class}><Chat size={32} className="relative"/></Link>
                <Link to={'/'} title="Calls" className={hover_btn_class}><Phone size={32} className="relative"/></Link>
                <Link to={'/'} title="Notes" className={hover_btn_class}><Notepad size={32} className="relative"/></Link>
            </div>
            <div className= {`flex justify-center items-end pb-8 text-${theme_class}`}>
                <Link to={'/'} title="Setting"><Gear size={32} /></Link>

            </div>
        </section>
    )
}



export default memo(Sidebar)
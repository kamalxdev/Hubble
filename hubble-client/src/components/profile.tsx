import { memo, useContext, useEffect, useState } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import { Check, LoaderCircle, Pencil } from "lucide-react";
import useGetData from "../hooks/axios/getData";
import usePostData from "../hooks/axios/postData";
import axios from "axios";

export default function Profile() {
  const user = useContext(currentUser) as iCurrentUserContext;
  const logout = useGetData("/user/logout", undefined, false, [], "/login");
  const EditDetailsData: iEditDetail[] = [
    {
      heading: "Your name",
      for: "name",
      currentvalue: user?.user?.name,
    },
    {
      heading: "Your username",
      for: "username",
      currentvalue: user?.user?.username,
    },
    {
      heading: "Your email",
      for: "email",
      currentvalue: user?.user?.email as string,
    },
  ];
  return (
    <section className="flex flex-col gap-5 ">
      <div className="flex flex-col gap-5 ">
        {EditDetailsData.map((data) => (
          <EditDetail {...data} key={data?.for} />
        ))}
      </div>
      <div className="w-full text-white flex justify-center">
        <button
          className="px-5 py-1 bg-slate-800 hover:border"
          onClick={() => logout.call()}
        >
          Log out
        </button>
      </div>
    </section>
  );
}

type iEditDetail = {
  heading: string;
  for: string;
  currentvalue: string;
};
const EditDetail = memo(function EditDetail(props: iEditDetail) {
  const user = useContext(currentUser) as iCurrentUserContext;

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props?.currentvalue);
  const [loading, setloading] = useState<boolean>(false);

  const postUpdatedData = usePostData(
    "/user/profile",
    { [props?.for]: value },
    undefined
  );
  useEffect(() => {
    if (postUpdatedData?.response?.success) {
      user?.setUser(postUpdatedData?.response?.updatedUser);
    }
  }, [postUpdatedData?.response]);
  async function sendAndValidateOTP(email: string) {
    const otp_sent_to_email = await axios.post(
      import.meta.env.VITE_SERVER_URL + "/api/v1/auth/send-otp",
      { email }
    );
    if (!otp_sent_to_email?.data?.success) {
      alert(otp_sent_to_email?.data?.error);
      return false;
    }
    let otp_recieved = prompt(`Enter otp sent to ${email}`);
    if (otp_recieved) {
      let validate_otp_sent_to_email = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/auth/validate-otp",
        { email, otp: otp_recieved }
      );
      if (!validate_otp_sent_to_email?.data?.success) {
        alert(validate_otp_sent_to_email?.data?.error);
        return false;
      }
      return true;
    }
    return false;
  }

  async function handleSubmitUpdatedData() {
    if (edit && props?.currentvalue !=value) {
      if (props?.for == "email" ) {
        setloading(true);
        let otp_to_current_mail = await sendAndValidateOTP(props?.currentvalue);
        if (otp_to_current_mail) {
          let otp_to_updated_mail = await sendAndValidateOTP(value);
          setloading(false);
          otp_to_updated_mail && setValue(props?.currentvalue);
          await postUpdatedData.call();
        } else {
          setloading(false);
          setValue(props?.currentvalue);
        }
      } else {
        await postUpdatedData.call();
      }
    }
    setEdit(!edit);
  }
  return (
    <div className="text-white px-10" key={props?.heading}>
      <h1 className="opacity-50">{props?.heading}</h1>
      <span className="relative w-full flex gap-5  ml-2 ">
        <input
          type={edit ? "text" : "button"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name=""
          id=""
          className={`relative inline-block break-words bg-transparent w-full text-left transition outline-none ${
            edit && "border-b-2 border-green-500"
          } `}
        />
        <button
          onClick={handleSubmitUpdatedData}
          className="relative p-2 rounded-full transition-all hover:bg-slate-800"
        >
          {postUpdatedData?.loading || loading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : edit ? (
            <Check xlinkTitle="Submit" size={18} />
          ) : (
            <Pencil xlinkTitle="Edit" size={18} />
          )}
        </button>
      </span>
    </div>
  );
});

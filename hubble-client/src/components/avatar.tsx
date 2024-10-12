import { useContext, useEffect, useRef, useState } from "react";
import { currentUser, iCurrentUserContext } from "../context/user";
import usePostData from "../hooks/axios/postData";
import { LoaderCircle } from "lucide-react";

export default function Avatar() {
  const user = useContext(currentUser) as iCurrentUserContext;
  const [updatedform, setUpdatedForm] = useState<FormData>();
  const postUpdatedAvatar = usePostData(
    "/user/avatar",
    updatedform,
    undefined,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  useEffect(() => {
    if (postUpdatedAvatar?.response?.success) {
      user?.setUser({
        ...user?.user,
        avatar: postUpdatedAvatar?.response?.avatar,
      });
    }
  }, [postUpdatedAvatar?.response]);
  const InputFileref = useRef<HTMLInputElement>(null);
  const [changeAvatar, setchangeAvatar] = useState("");
  function checkUplodedFile(event: React.ChangeEvent<HTMLInputElement>) {
    let fileName = event.target.value;
    if (
      fileName.endsWith("jpg") ||
      fileName.endsWith("jpeg") ||
      fileName.endsWith("png")
    ) {
      setchangeAvatar(
        URL.createObjectURL((event?.target?.files as FileList)[0])
      );
      let formdata = new FormData();
      formdata.append("avatar", (event?.target?.files as FileList)[0]);
      setUpdatedForm(formdata);
    } else {
      if (InputFileref?.current) {
        InputFileref.current.value = "";
      }
      alert("Only .jpg,.png & .jpeg files are allowed");
    }
  }
  async function handleUploadAvatar() {
    try {
      await postUpdatedAvatar.call();
      setchangeAvatar("");
    } catch (error) {
      console.log("Error on posting updated avatar: ", error);
    }
  }
  return (
    <section className="w-full flex flex-col gap-4 justify-center items-center bg-slate-950">
      <span className="flex justify-center items-center border rounded-full w-44 h-44 bg-white overflow-hidden">
        <img
          src={
            postUpdatedAvatar?.response?.avatar
              ? postUpdatedAvatar?.response?.avatar
              : changeAvatar
              ? changeAvatar
              : user?.user?.avatar
              ? user?.user?.avatar
              : import.meta.env.VITE_DEFAULT_AVATAR_URL
          }
          width="auto"
          height={"auto"}
        />
      </span>
      {changeAvatar ? (
        <button
          onClick={handleUploadAvatar}
          className="bg-slate-800 px-5 py-2 rounded-md text-green-500"
        >
          {postUpdatedAvatar?.loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Upload"
          )}
        </button>
      ) : (
        <label
          htmlFor="upload-avatar"
          className="bg-slate-800 px-5 py-2 rounded-md text-white"
        >
          {user?.user?.avatar ? "Change Avatar" : "Add Avatar"}
        </label>
      )}
      <input
        type="file"
        ref={InputFileref}
        onChange={checkUplodedFile}
        className="hidden"
        name="avatar"
        accept="image/jpg,image/png,image/jpeg"
        id="upload-avatar"
      />
    </section>
  );
}

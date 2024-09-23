import { memo, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import usePostData from "../../hooks/axios/postData";
import axios from "axios";

function Register() {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    otp:"",
  });
  const [showOTPBOx,setshowOTPBOx]=useState(false)
  const registerUser = usePostData("/auth/register", data, "/login", {
    withCredentials: true,
  });
  const [loading,setLoading]=useState(false)
  async function handleSendOTP(){
    setLoading(true)
    const generateOTP= await axios.post(
      import.meta.env.VITE_SERVER_URL + "/api/v1/auth/send-otp",
      { email:data?.email,for:'register' }
    );
    if(!generateOTP?.data?.success){
      alert(generateOTP?.data?.error)
    }
    setLoading(false)
    alert(generateOTP?.data?.message)
    setshowOTPBOx(true)
  }
  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Create a free account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Already have an account?{" "}
            <a
              href="/login"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Login
            </a>
          </p>
          <form className="mt-8">
            <p className="ml-3 text-green-500 transition text-sm font-bold w-full flex justify-center">
              {registerUser?.response?.success
                ? "Registered Successfully. Redirecting you to login page..."
                : ""}
            </p>
            <p className="ml-3 text-red-500 transition text-sm font-bold w-full flex justify-center">
              {registerUser?.error
                ? typeof registerUser?.error === "string"
                  ? registerUser?.error
                  : ""
                : ""}
            </p>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Username{" "}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                    placeholder="Unique username"
                  ></input>
                  <p className="ml-3 text-red-500 transition text-sm font-bold">
                  {registerUser?.error
                      ? typeof registerUser?.error === "string"
                        ? ""
                        : registerUser?.error["username"]
                      : ""}
                  </p>
                </div>
                
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Name{" "}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Fullname"
                  ></input>
                  <p className="ml-3 text-red-500 transition text-sm font-bold">
                  {registerUser?.error
                      ? typeof registerUser?.error === "string"
                        ? ""
                        : registerUser?.error["name"]
                      : ""}
                  </p>
                </div>
              </div>
              <div>
              <div className="flex items-center justify-between">
                  <label
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email Address{" "}
                  </label>
                  
                    <button
                    type="button"
                    onClick={handleSendOTP}
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      {loading ? <LoaderCircle size={18} className="animate-spin"/>:showOTPBOx ? "Resend OTP":"Send OTP"}
                    </button>
                  
                  
                </div>
                <div className="mt-2">
                 <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    placeholder="Email"
                  ></input>
                  <p className="ml-3 text-red-500 transition text-sm font-bold">
                  {registerUser?.error
                      ? typeof registerUser?.error === "string"
                        ? ""
                        : registerUser?.error["email"]
                      : ""}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  OTP{" "}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="number"
                    onChange={(e) =>
                      setData({ ...data, otp: e.target.value })
                    }
                    placeholder="OTP sent on above email ID"
                  ></input>
                  <p className="ml-3 text-red-500 transition text-sm font-bold">
                  {registerUser?.error
                      ? typeof registerUser?.error === "string"
                        ? ""
                        : registerUser?.error["otp"]
                      : ""}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Password{" "}
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    placeholder="Password"
                  ></input>
                  <p className="ml-3 text-red-500 transition text-sm font-bold">
                  {registerUser?.error
                      ? typeof registerUser?.error === "string"
                        ? ""
                        : registerUser?.error["password"]
                      : ""}
                  </p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => registerUser.call()}
                  className={`inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ${
                    registerUser?.loading && "animate-pulse"
                  }`}
                >
                  {registerUser?.loading ? "Registering" : "Get started"}{" "}
                  <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default memo(Register);

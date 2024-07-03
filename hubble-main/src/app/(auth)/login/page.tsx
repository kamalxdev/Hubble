"use client";


import React, { memo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { login } from '@/actions/auth';
import { useRouter } from 'next/navigation'


function Login() {
  const router = useRouter()
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string |Map<any, any>>();
  const [loading, setLoading]=useState(false)
  const [success,setSuccess]=useState(false)
  function handleLoginButton() {
    setLoading(true)
    login(data.email, data.password).then(
      (data) => {
        setSuccess(data?.success as boolean)
        setLoading(false)
        if (!data?.success) {
          return setError(data?.error);
        }
        return router.push('/')
      }
    );
  }

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </a>
          </p>
          <form action="#" method="POST" className="mt-8">
          <p className="ml-3 text-red-500 transition text-sm font-bold w-full flex justify-center">
                  {typeof(error) === "string"?error:"" }
                  </p>
                  <p className="ml-3 text-green-500 transition text-sm font-bold w-full flex justify-center">
                  {success?"Logged in Successfully. Redirecting you to home page...":"" }
                  </p>
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-gray-900">
                  {' '}
                  Email address{' '}
                </label>
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
                  {typeof(error) === "string"?"":error?.get("email") }
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    {' '}
                    Password{' '}
                  </label>
                  <a href="#" title="" className="text-sm font-semibold text-black hover:underline">
                    {' '}
                    Forgot password?{' '}
                  </a>
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
                  {typeof(error) === "string"?"":error?.get("password") }
                  </p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleLoginButton}
                  className= {`inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ${loading && "animate-pulse"}`}
                >
                  {loading?"Logging in":"Get started"} <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}



export default memo(Login)
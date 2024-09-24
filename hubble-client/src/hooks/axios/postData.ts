import axios from "axios";
import { useState } from "react";

type ioptions = {
  [key: string]: any;
};

export default function usePostData(
  url: string,
  data: any,
  callback:string ="",
  options: ioptions = {}
) {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function call() {
    setLoading(true);
    await axios
      .post(import.meta.env.VITE_SERVER_URL + "/api/v1" + url, data, {...options,withCredentials:true})
      .then((res) => {
        setLoading(false);
        if(!res?.data?.success){
          return setError(res?.data?.error)
        }
        setResponse(res.data);
        if(callback){
          return window.location.href=callback
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(`Error getting ${url}: `, err);
      });
      return response
  }

  return { response, error, loading, call };
}

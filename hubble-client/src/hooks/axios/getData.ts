import axios from "axios";
import { useEffect, useState } from "react";

type ioptions = {
  [key: string]: any;
};

export type igetData={
  response:any,
  error:any,
  loading:boolean
}
export default function useGetData(
  url: string,
  options: ioptions = {},
  withUseEffect: boolean=false,
  dependency:any[]= [],
  callback:string ="",

) {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (withUseEffect) {
    useEffect(() => {
      axios
        .get(import.meta.env.VITE_SERVER_URL + "/api/v1" + url, {...options,withCredentials:true})
        .then((res) => {
          setResponse(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          console.log(`Error getting ${url}: `, err);
        });
    }, dependency);
  }
  function call(){
    !withUseEffect && axios
    .get(import.meta.env.VITE_SERVER_URL+'/api/v1' + url, {...options,withCredentials:true})
    .then((res) => {
      setResponse(res.data);
      setLoading(false);
      if(callback){
        return window.location.href=callback
      }
    })
    .catch((err) => {
      setLoading(false);
      setError(err);
      console.log(`Error getting ${url}: `, err);
    });
  }
  return { response, error, loading,call };
}

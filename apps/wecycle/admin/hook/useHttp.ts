import { Dispatch, SetStateAction, useState } from "react";
import type { Error } from "@tanbel/homezz/types";
import { toast } from "react-toastify";
import { useAction } from "./useAction";
import { useRouter } from "next/router";

export function useHttp<TResponse, TError = null | Record<string, any>>(
  callApi?: () => Promise<TResponse>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error<TError> | null>(null);
  const [data, setData] = useState<Awaited<TResponse>>(null!);
  const { logout } = useAction();
  const router = useRouter();

  const toggleLoading = () => {
    setLoading((prev) => !prev);
  };

  const request = async () => {
    setError(null);
    try {
      if (!callApi) throw new Error("callApi is not defined");
      toggleLoading();
      const res = await callApi();
      setData(res);
      toggleLoading();
      return res;
    } catch (error: any) {
      if (typeof error?.message === "string") {
        toast.error(error.message);
      } else {
        setError(error);
      }
      toggleLoading();
      if (error?.status === 401) {
        logout();
        router.push("/login");
      }
      throw error;
    }
  };

  const customRequest = (fn: any) => {
    setError(null);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<TResponse>(async (resolve, reject) => {
      try {
        toggleLoading();
        const res = await fn();
        setData(res);
        resolve(res);
        toggleLoading();
      } catch (error: any) {
        if (typeof error?.message === "string") {
          toast.error(error.message);
        } else {
          setError(error);
        }
        toggleLoading();
        if (error?.status === 401) {
          logout();
          router.push("/login");
        }
        reject(error);
      }
    });
  };

  return { data, loading, error, request, customRequest, setData };
}

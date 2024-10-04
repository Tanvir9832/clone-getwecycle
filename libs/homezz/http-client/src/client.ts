import { getLocal } from "@tanbel/utils";
import axios from "axios";
export interface AxiosConfig {
  token?: string;
}

const api_url = process.env["NEXT_PUBLIC_API_URL"] + "/api";

const $api = axios.create({
  baseURL: api_url,
});

$api.interceptors.request.use(
  async (config) => {
    let localToken = getLocal("TOKEN");
    config.headers.Authorization = `Bearer ${localToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const errorResponse = error?.response;
    return Promise.reject(
      errorResponse
        ? {
          message: errorResponse?.data?.message,
          status: errorResponse?.status,
        }
        : undefined
    );
  }
);

export default $api;

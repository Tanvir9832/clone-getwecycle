import { base_url } from "@tanbel/homezz/utils";
import { isNextJs, isNodeJs } from "@tanbel/utils";
import axios from "axios";
export interface AxiosConfig {
  token?: string;
}

const api_url =
  (isNextJs || isNodeJs() ? process.env["NEXT_PUBLIC_API_URL"] : base_url) +
  "/api";

const $api = axios.create({
  baseURL: api_url,
});

$api.interceptors.request.use(
  async (config) => {
    if (!isNodeJs()) {
      let localToken;

      if (isNextJs) {
        const data = await import("@tanbel/utils");
        localToken = data.getLocal("token");
      } else {
        const data = await import(
          /* webpackIgnore: true */ "@tanbel/react-native-utils"
        );
        localToken = data.getLocalItem("TOKEN");
      }
      config.headers.Authorization = `Bearer ${localToken}`;
    }

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
    if (!isNextJs && error.response) {
      console.log("");
      console.log(
        ` \x1b[33m status : \x1b[0m \x1b[41m ${error.response.status} \x1b[0m`
      );
      console.log(
        ` \x1b[33m url    : \x1b[0m ${error.config.baseURL + error.config.url}`
      );
      console.log(` \x1b[33m data   : \x1b[0m ${error?.config?.data}`);
      console.log(
        ` \x1b[33m error  : \x1b[0m ${error?.response?.data?.message}`
      );
    }
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

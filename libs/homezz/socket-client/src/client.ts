import { io } from "socket.io-client";
import { base_url } from "@tanbel/homezz/utils";
import { isNextJs } from "@tanbel/utils";

const URL = isNextJs
  ? (process.env["NEXT_PUBLIC_API_URL"] as string)
  : base_url;

export const $socket = io(URL);

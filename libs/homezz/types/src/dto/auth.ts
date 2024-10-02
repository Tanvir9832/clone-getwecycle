import { DTO } from ".";
import { IUser, IUserModel } from "../models/User";

export enum Platforms {
  CLIENT_APP = "CLIENT_APP",
  ADMIN_APP = "ADMIN_APP",
  CLIENT_WEB = "CLIENT_WEB",
  ADMIN_WEB = "ADMIN_WEB",
}

export type LoginDTO = DTO<
  IUser,
  {
    email: string;
    password: string;
    platform: Platforms;
  }
>;

export type OtpDTO = {
  tokenId: string;
  token: string;
};

export type ResendOtpDTO = {
  tokenId: string;
};

export type RegisterDTO = DTO<
  IUser,
  {
    username: string;
    email: string;
    password: string;
  }
>;

export type AuthSuccessDTO = {
  jwtToken: string;
  user: IUserModel;
};

export type RecoverDTO = DTO<
  IUser,
  {
    email: string;
  }
>;

export type ResetPasswordDTO = DTO<
  IUser,
  {
    password: string;
  }
>;

import {
  AuthSuccessDTO,
  IUserModel,
  IVerificationSession,
  IVerificationSessionModel,
  LoginDTO,
  OtpDTO,
  RecoverDTO,
  RegisterDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
} from "@tanbel/homezz/types";
import $api from "./client";

export const login = (
  data: LoginDTO
): Promise<AuthSuccessDTO & IVerificationSessionModel> => {
  return $api.post("/auth/login", data);
};

export const log_out = (): Promise<string> => {
  return $api.post("/auth/logout");
};

export const registration = (
  data: RegisterDTO
): Promise<IVerificationSessionModel> => {
  return $api.post("/auth/registration", data);
};

export const verify_otp = (
  data: OtpDTO,
  query?: { verifyOnly: string }
): Promise<AuthSuccessDTO> => {
  return $api.post(
    `/auth/otp/verify${query ? "?" + new URLSearchParams(query) : ""}`,
    data
  );
};

export const resend_otp = (
  data: ResendOtpDTO
): Promise<IVerificationSessionModel> => {
  return $api.post("/auth/otp/resend", data);
};

export const recover_password = (
  data: RecoverDTO
): Promise<IVerificationSessionModel> => {
  return $api.post("auth/recover", data);
};

export const change_password = (
  data: ResetPasswordDTO,
  params: { userId: string }
): Promise<IUserModel> => {
  return $api.post(`/auth/change-password/${params.userId}`, data);
};

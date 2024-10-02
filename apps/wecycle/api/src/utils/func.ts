// Destructuring environment variables
// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID_CODE_4, TWILIO_SERVICE_SID_CODE_6, OTP_ENABLE } = process.env;
import { v4 as uuid } from "uuid";
import { otpEmail } from "@tanbel/homezz/utils";
import VerificationSession from "../models/VerificationSession";
import UserSession from "../models/UserSession";
import { createToken } from "./jwt";
import { sendEmail } from "./email";

export const generateRandomNumber = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sendVerificationMail = async (
  { userId, email },
  sessionId?: string
) => {
  const code = generateRandomNumber();

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);

  if (sessionId) {
    const session = await VerificationSession.findByIdAndUpdate(
      sessionId,
      {
        user: userId,
        expireDate,
        token: code.toString(),
      },
      { new: true, upsert: true }
    );

    sendEmail({
      to: email,
      subject: "Verification code",
      template: otpEmail(code.toString()),
    });
    return session;
  }

  const newToken = new VerificationSession({
    expireDate,
    token: code,
    user: userId,
  });

  const tokenData = await newToken.save();

  sendEmail({
    to: email,
    subject: "Verification code",
    template: otpEmail(code.toString()),
  });

  return tokenData;
};

export const generateJwtToken = async ({ userId }) => {
  // Create and send JWT token
  const sessionUUID = uuid();
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 30);
  const sessionStructure = new UserSession({
    user: userId,
    sessionUUID,
    expireDate,
    verified: false,
  });

  const session = await sessionStructure.save();
  const jwtToken = createToken(session._id, session.sessionUUID);

  return jwtToken;
};

export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const allowChars = /^[0-9a-zA-Z_@.]+$/;
  const validEmail = re.test(email) && allowChars.test(email);
  return validEmail;
};

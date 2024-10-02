import bcrypt from "bcryptjs";
import UserSession from "../models/UserSession";
import User from "../models/User";
import {
  IAuthRequest,
  IRequest,
  LoginDTO,
  OtpDTO,
  Platforms,
  RecoverDTO,
  RegisterDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  UserType,
} from "@tanbel/homezz/types";
import { failed, success } from "../utils/response";
import FCM from "../models/FCM";
import { logger } from "../middleware/logger/logger";
import VerificationSession from "../models/VerificationSession";
import { generateJwtToken, sendVerificationMail } from "../utils/func";

// Registration API
export const registration = async (req: IRequest<RegisterDTO>, res, next) => {
  try {
    // Get user input
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(failed({ issue: "User already exists" }));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();

    const newToken = await sendVerificationMail({
      email,
      userId: user._id,
    });

    return res.status(201).json(success({ data: newToken }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

// Login API
export const login = async (req: IRequest<LoginDTO>, res) => {
  try {
    // Get user input
    const { email, password, platform } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json(failed({ issue: "User not found" }));
    }

    if (platform === Platforms.ADMIN_WEB) {
      const authorized = [
        UserType.ADMIN,
        UserType.SUPER_ADMIN,
        UserType.PROVIDER,
      ];
      if (!existingUser.userType.some((type) => authorized.includes(type))) {
        return res.status(401).json(failed({ issue: "Unauthorized" }));
      } else {
        const jwtToken = await generateJwtToken({
          userId: existingUser._id,
        });
        return res
          .status(200)
          .json(success({ data: { jwtToken, user: existingUser } }));
      }
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json(failed({ issue: "Invalid credentials" }));
    }

    if (existingUser.verification.email === false) {
      const newToken = await sendVerificationMail({
        email,
        userId: existingUser._id,
      });

      return res.status(200).json(success({ data: newToken }));
    } else {
      const jwtToken = await generateJwtToken({
        userId: existingUser._id,
      });

      return res
        .status(200)
        .json(success({ data: { jwtToken, user: existingUser } }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const verifyOtp = async (
  req: IRequest<OtpDTO, null, { verifyOnly: string }>,
  res
) => {
  try {
    const { token, tokenId } = req.body;

    const verifyOnly = req.query?.verifyOnly;

    const tokenSession = await VerificationSession.findOne({ _id: tokenId });

    if (!tokenSession) {
      return res.status(404).json(failed({ issue: "Invalid token" }));
    }

    if (tokenSession.expireDate < new Date()) {
      return res.status(404).json(failed({ issue: "Token expired" }));
    }

    if (tokenSession.token !== token) {
      return res.status(404).json(failed({ issue: "Invalid token" }));
    }

    if (verifyOnly === "true") {
      const user = await User.findOne({
        _id: tokenSession.user,
      });

      return res
        .status(200)
        .json(success({ message: "Verification successful", data: { user } }));
    }

    const user = await User.findOneAndUpdate(
      {
        _id: tokenSession.user,
      },
      {
        "verification.email": true,
      },
      {
        new: true,
      }
    );

    const jwtToken = await generateJwtToken({
      userId: tokenSession.user,
    });

    return res.status(200).json(success({ data: { jwtToken, user: user } }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const resendOtp = async (req: IRequest<ResendOtpDTO>, res) => {
  try {
    const { tokenId } = req.body;

    const tokenSession = await VerificationSession.findOneAndRemove({
      _id: tokenId,
    }).populate("user");

    if (!tokenSession) {
      return res.status(404).json(failed({ issue: "Invalid token" }));
    }

    const newToken = await sendVerificationMail(
      {
        email: tokenSession.user.email,
        userId: tokenSession.user._id,
      },
      tokenId
    );

    return res.status(200).json(success({ data: newToken }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

// Logout
export const logout = async (req: IAuthRequest, res) => {
  try {
    const sessionId = req.session;

    await FCM.findOneAndRemove({ session: sessionId });

    await UserSession.findOneAndRemove({ sessionUUID: sessionId });

    return res.status(200).json(success({ message: "Logged out" }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

// Recover password
export const recoverPasswordOtp = async (req: IRequest<RecoverDTO>, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json(failed({ issue: "User not found" }));
    }

    // remove the previous email verification record
    await VerificationSession.findOneAndRemove({
      user: existingUser._id,
    });

    // generate a new otp and send email with it
    const newToken = await sendVerificationMail({
      email,
      userId: existingUser._id,
    });

    return res.status(200).json(success({ data: newToken }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const changePassword = async (
  req: IRequest<ResetPasswordDTO, { userId: string }>,
  res
) => {
  try {
    const { password } = req.body;

    const { userId } = req.params;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );

    return res.status(200).json(success({ data: user }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

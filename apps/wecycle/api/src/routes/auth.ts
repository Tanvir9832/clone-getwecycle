import router from "express";
import {
  login,
  logout,
  recoverPasswordOtp,
  registration,
  resendOtp,
  changePassword,
  verifyOtp,
} from "../controllers/auth";
import {
  loginValidator,
  recoverValidator,
  registrationValidator,
  resetPasswordValidator,
} from "../middleware/validation/authValidator";
import { userAuthorization } from "../middleware/authorization";

const authRouter = router.Router();

authRouter.post("/auth/login", loginValidator, login);
authRouter.post("/auth/registration", registrationValidator, registration);
authRouter.post("/auth/otp/verify", verifyOtp);
authRouter.post("/auth/otp/resend", resendOtp);
authRouter.post("/auth/logout", userAuthorization, logout);
authRouter.post("/auth/recover", recoverValidator, recoverPasswordOtp);
authRouter.post(
  "/auth/change-password/:userId",
  resetPasswordValidator,
  changePassword
);

export default authRouter;

import { login } from "@tanbel/homezz/http-client";
import {
  IUserModel,
  IVerificationSessionModel,
  Platforms,
} from "@tanbel/homezz/types";
import { Button, Input, Space } from "@tanbel/react-ui";
import { setLocal } from "@tanbel/utils";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import { ChangePassword, SendEmail, VerifyOTP } from "../../components/auth";
import { useHttp } from "../../hook/useHttp";
import AuthLayout from "../../layout/authLayout";
import { useAppState } from "../../store/appState";
import Image from "next/image";

export enum Step {
  LOGIN = "LOGIN",
  RECOVERY_EMAIL = "EMAIL",
  VERIFY_OTP = "OTP",
  CHANGE_PASSWORD = "PASSWORD",
}

export default function Login() {
  const { setUser, user } = useAppState();
  const [step, setStep] = useState<Step>(Step.LOGIN);

  const [userData, setUserData] = useState<IUserModel>();
  const [tokenData, setTokenData] = useState<IVerificationSessionModel>();

  const STEP_LUT = {
    [Step.LOGIN]: <LoginCom setUser={setUser} />,
    [Step.RECOVERY_EMAIL]: (
      <SendEmail setTokenData={setTokenData} setStep={setStep} />
    ),
    [Step.VERIFY_OTP]: (
      <VerifyOTP
        tokenId={tokenData?._id}
        setUserData={setUserData}
        setTokenData={setTokenData}
        setStep={setStep}
      />
    ),
    [Step.CHANGE_PASSWORD]: (
      <ChangePassword userId={userData?._id} setStep={setStep} />
    ),
  };

  return (
    <AuthLayout>
      <div className="w-full flex justify-center m-2">
        <Image alt="logo" src={Logo} />
      </div>
      <Space height={30} />
      <div>
        {STEP_LUT[step]}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center mt-4 text-sm">
            {step === Step.LOGIN ? "Forgot Password? " : " "}
            <Button
              size="small"
              type="link"
              onClick={() => {
                if (step === Step.LOGIN) {
                  setStep(Step.RECOVERY_EMAIL);
                } else {
                  setStep(Step.LOGIN);
                }
              }}
            >
              {step === Step.LOGIN ? "Recover" : "Back to Login"}
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

function LoginCom({ setUser }: { setUser: (u: IUserModel) => void }) {
  const [cred, setCred] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCred({ ...cred, [name]: value });
  };

  const { loading, error, request } = useHttp(() => {
    return login({ ...cred, platform: Platforms.ADMIN_WEB });
  });

  const onSubmit = () => {
    return request().then((res) => {
      if (res) {
        setLocal("token", res.jwtToken);
        setUser(res.user);
        window.location.href = "/";
      }
    });
  };

  return (
    <>
      <div className="relative mb-3">
        <Input
          label="Email"
          name="email"
          error={error?.email}
          size="large"
          placeholder="example@gmail.com"
          onChange={handleChange}
        />
      </div>
      <div className="relative mb-3">
        <Input
          password
          label="Password"
          name="password"
          error={error?.password}
          size="large"
          placeholder="********"
          onChange={handleChange}
        />
      </div>
      <div className="text-center mt-6">
        <Button
          onClick={onSubmit}
          loading={loading}
          type="primary"
          block
          size="large"
        >
          Login
        </Button>
      </div>
    </>
  );
}

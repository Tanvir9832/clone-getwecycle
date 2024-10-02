import { resend_otp, verify_otp } from "@tanbel/homezz/http-client";
import { Button, Input } from "@tanbel/react-ui";
import React, { useEffect, useState } from "react";
import { useHttp } from "../../hook/useHttp";
import { Step } from "../../pages/auth/login";
import { toast } from "react-toastify";
import { IUserModel, IVerificationSessionModel } from "@tanbel/homezz/types";

const otpDelay = 60;

type Props = {
  tokenId: string;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setUserData: React.Dispatch<React.SetStateAction<IUserModel | undefined>>;
  setTokenData: React.Dispatch<
    React.SetStateAction<IVerificationSessionModel | undefined>
  >;
};

export function VerifyOTP({
  tokenId,
  setStep,
  setUserData,
  setTokenData,
}: Props) {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(otpDelay);

  const { error, loading, request } = useHttp(() => {
    return verify_otp({ token: otp, tokenId });
  });

  const {
    error: resendError,
    loading: resendLoading,
    request: resendRequest,
  } = useHttp(() => {
    return resend_otp({ tokenId });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) {
        clearInterval(interval);
      } else {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const resendOtp = () => {
    if (resendLoading) return;
    resendRequest().then((res) => {
      if (res) {
        setTokenData(res);
        toast.success("OTP has been sent to your email");
        setTimer(60);
      }
    });
  };

  const onSubmit = async () => {
    if (!otp) {
      return;
    }
    request().then((res) => {
      if (res) {
        setUserData(res.user);
        setStep(Step.CHANGE_PASSWORD);
      }
    });
  };

  return (
    <>
      <div className="relative flex flex-col gap-2 mb-3">
        <Input
          label="OTP"
          name="otp"
          error={error?.otp}
          size="large"
          placeholder="123456"
          onChange={(e) => setOtp(e.target.value)}
          className="text-center"
          maxLength={6}
        />
        {timer > 0 ? (
          <div className="text-center text-sm text-gray-500">
            Resend OTP in {timer}s
          </div>
        ) : (
          <div
            className="text-center text-sm underline text-gray-500 cursor-pointer"
            onClick={resendOtp}
          >
            Resend OTP
          </div>
        )}
      </div>
      <div className="text-center mt-6">
        <Button
          onClick={onSubmit}
          loading={loading}
          type="primary"
          block
          size="large"
        >
          Verify OTP
        </Button>
      </div>
    </>
  );
}

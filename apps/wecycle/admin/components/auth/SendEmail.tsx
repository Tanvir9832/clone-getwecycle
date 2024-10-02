import { IVerificationSessionModel, RecoverDTO } from "@tanbel/homezz/types";
import { Button, Input } from "@tanbel/react-ui";
import React, { useState } from "react";
import { useHttp } from "../../hook/useHttp";
import { recover_password } from "@tanbel/homezz/http-client";
import { Step } from "../../pages/auth/login";

export function SendEmail({
  setStep,
  setTokenData,
}: {
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  setTokenData: React.Dispatch<
    React.SetStateAction<IVerificationSessionModel | undefined>
  >;
}) {
  const [userData, setUserData] = useState<RecoverDTO>({
    email: "",
  });

  const { error, loading, request } = useHttp(() => {
    return recover_password(userData);
  });

  const onSubmit = () => {
    request().then((res) => {
      if (res) {
        setTokenData(res);
        setStep(Step.VERIFY_OTP);
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
          onChange={(e) => setUserData({ email: e.target.value })}
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
          Send Code
        </Button>
      </div>
    </>
  );
}

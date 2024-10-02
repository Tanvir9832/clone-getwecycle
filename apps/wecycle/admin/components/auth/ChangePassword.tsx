import { ResetPasswordDTO } from "@tanbel/homezz/types";
import { Button, Input } from "@tanbel/react-ui";
import { useState } from "react";
import { useHttp } from "../../hook/useHttp";
import { change_password } from "@tanbel/homezz/http-client";
import { Step } from "../../pages/auth/login";

export function ChangePassword({
  userId,
  setStep,
}: {
  userId: string;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) {
  const [userData, setUserData] = useState<ResetPasswordDTO>({
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { error, loading, request } = useHttp(() => {
    return change_password(userData, {
      userId,
    });
  });

  const onSubmit = () => {
    request().then((res) => {
      if (res) {
        setStep(Step.LOGIN);
      }
    });
  };

  return (
    <>
      <div className="relative mb-3">
        <Input
          password
          label="New Password"
          name="password"
          error={error?.password}
          size="large"
          placeholder="********"
          onChange={(e) => setUserData({ password: e.target.value })}
        />

        <Input
          password
          label="Confirm New Password"
          name="confirmPassword"
          size="large"
          placeholder="********"
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={
            userData.password && userData.password !== confirmPassword
              ? "Password doesn't match"
              : undefined
          }
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
          Change Password
        </Button>
      </div>
    </>
  );
}

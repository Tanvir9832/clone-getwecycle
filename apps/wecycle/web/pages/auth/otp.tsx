import { resend_otp, verify_otp } from "@tanbel/homezz/http-client";
import { Button, Input } from "@tanbel/react-ui";
import { setLocal } from "@tanbel/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHttp } from "../../hook/useHttp";
import { useAuthStore } from "../../store/authStore";

const otpDelay = 60;

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>([]);
  const [count, setCount] = useState(otpDelay);

  const { setUser, setAuthenticated } = useAuthStore();

  const router = useRouter();
  const { session, email, redirect } = router.query;

  // if (!session.current) {
  //   router.push("/auth/login");
  // }

  const { request: resend, loading: resendOtpLoading } = useHttp(() => {
    console.log("session.current", session);
    return resend_otp({
      tokenId: session as string,
    });
  });

  const { loading, request } = useHttp(() => {
    return verify_otp({
      tokenId: session as string,
      token: otp.join(""),
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  const handleChange = (index: number, value: string) => {
    const lastValue = value[value.length - 1];

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = lastValue;
      return newOtp;
    });

    if (index < 5 && value) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const onSubmit = () => {
    request()
      .then((res) => {
        setLocal("token", res?.jwtToken);
        setUser(res?.user);
        setAuthenticated(true);
        if (redirect) {
          router.push(redirect as string);
        }
      })
      .catch((err) => {
        toast(err?.message || "Invalid token", { type: "error" });
      });
  };

  const resendOtp = () => {
    resend().then((res) => {
      toast("OTP sent successfully", { type: "success" });
      setOtp([]);
      setCount(otpDelay);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full h-full max-w-md p-5 border rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-3">
          OTP Verification
        </h1>
        <p className="text-center text-xs mb-3">
          Please Enter the code just sent to{" "}
          {email ? (
            <span className="font-semibold">{email}</span>
          ) : (
            "your email"
          )}
        </p>
        <div className="relative mb-3">
          <div className="flex justify-between items-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                size="large"
                type="number"
                maxLength={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(index, e.target.value);
                }}
                value={otp[index] || ""}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center font-bold"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mb-3">
          <Button
            size="small"
            type="link"
            onClick={resendOtp}
            loading={resendOtpLoading}
            disabled={count !== 0}
          >
            Resend OTP
          </Button>

          {count !== 0 && <span>in {count}s</span>}
        </div>
        <div className="flex items-center justify-between">
          <Link className="text-green-500 hover:underline" href="/auth/login">
            Back to login
          </Link>
          <Button size="large" onClick={onSubmit} loading={loading}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

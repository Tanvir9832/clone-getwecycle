import { registration } from "@tanbel/homezz/http-client";
import { IVerificationSessionModel, RegisterDTO } from "@tanbel/homezz/types";
import { Button, Input } from "@tanbel/react-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useHttp } from "../../hook/useHttp";

export default function Register() {
  const [user, setUser] = useState<RegisterDTO>({
    email: "",
    password: "",
    username: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const redirectUrl = router.query.redirect as string;

  const { error, request, loading } = useHttp<
    IVerificationSessionModel,
    RegisterDTO
  >(() => {
    return registration(user);
  });

  const onSubmit = async () => {
    if (user.password !== confirmPassword) {
      toast("Password doesn't match", { type: "error" });
      return;
    }
    request().then((res) => {
      toast("OTP has been send to your email", { type: "success" });
      router.push({
        pathname: "/auth/otp",
        query: { session: res?._id, email: user.email, redirect: redirectUrl },
      });
    });
  };

  const handleChange = (name: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full h-full max-w-md p-5 border rounded-md shadow-md">
        <div className="relative mb-3">
          <Input
            label="Username"
            name="username"
            error={error?.username}
            size="large"
            placeholder="John Doe"
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>
        <div className="relative mb-3">
          <Input
            label="Email"
            name="email"
            error={error?.email}
            size="large"
            placeholder="example@email.com"
            onChange={(e) => handleChange("email", e.target.value)}
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
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
        <div className="relative mb-3">
          <Input
            password
            label="Confirm Password"
            name="confirmPassword"
            error={error?.confirmPassword}
            size="large"
            placeholder="********"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Register
          </Button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href={`/auth/login${
                redirectUrl ? "?redirect=" + redirectUrl : ""
              }`}
              className="text-green-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

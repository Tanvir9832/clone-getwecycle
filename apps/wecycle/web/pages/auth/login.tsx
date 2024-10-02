import { login } from "@tanbel/homezz/http-client";
import { Platforms } from "@tanbel/homezz/types";
import { Button, Input } from "@tanbel/react-ui";
import { setLocal } from "@tanbel/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useHttp } from "../../hook/useHttp";
import { useAuthStore } from "../../store/authStore";
import { withPublicPage } from "../../HOC";

function Login() {
  const [cred, setCred] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const redirectUrl = router.query.redirect as string;

  const { setUser, setAuthenticated } = useAuthStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCred({ ...cred, [name]: value });
  };

  const { loading, error, request } = useHttp<
    Awaited<ReturnType<typeof login>>,
    { email: string; password: string }
  >(() => {
    return login({ ...cred, platform: Platforms.CLIENT_WEB });
  });

  const onSubmit = () => {
    return request()
      .then((res) => {
        if (res) {
          setLocal("token", res.jwtToken);
          setUser(res.user);
          setAuthenticated(true);
          if (redirectUrl) {
            router.push(redirectUrl);
          }
        }
      })
      .catch((err) => {
        toast(err?.message || "Somthing went wrong", { type: "error" });
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full h-full max-w-md p-5 border rounded-md shadow-md">
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
        <div className="text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/register${
              redirectUrl ? "?redirect=" + redirectUrl : ""
            }`}
            className="text-green-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withPublicPage(Login);

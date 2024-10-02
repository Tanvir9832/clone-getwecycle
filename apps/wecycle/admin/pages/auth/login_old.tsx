// import React, { useState } from "react";
// import AuthLayout from "../../layout/authLayout";
// import { Button, Space } from "@tanbel/react-ui";
// import { useHttp } from "../../hook/useHttp";
// import { login } from "@tanbel/homezz/http-client";
// import {
//   AuthSuccessDTO,
//   IVerificationSessionModel,
//   LoginDTO,
//   Platforms,
// } from "@tanbel/homezz/types";
// import { Input } from "@tanbel/react-ui";
// import { useRouter } from "next/router";
// import { useAppState } from "../../store/appState";
// import Logo from "../../assets/logo.svg";
// import { setLocal } from "@tanbel/utils";
// import Link from "next/link";

// export default function LoginOld() {
//   const route = useRouter();
//   const { setToken, setUser } = useAppState();
//   const { error, loading, request } = useHttp<AuthSuccessDTO, LoginDTO>(() => {
//     return login({
//       email: cred.email,
//       password: cred.password,
//       platform: Platforms.ADMIN_WEB,
//     });
//   });

//   const [cred, setCred] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setCred({ ...cred, [name]: value });
//   };

//   const onLogin = () => {
//     request().then((res) => {
//       if (res) {
//         setLocal("token", res.jwtToken);
//         setUser(res.user);
//       }
//       window.location.href = "/";
//     });
//   };

//   return (
//     <AuthLayout>
//       <img src={Logo} className="h-40" />
//       <Space height={30} />
//       <div>
//         <div className="relative mb-3">
//           <Input
//             label="Email"
//             name="email"
//             error={error?.email}
//             size="large"
//             placeholder="example@gmail.com"
//             onChange={handleChange}
//           />
//         </div>
//         <div className="relative mb-3">
//           <Input
//             password
//             label="Password"
//             name="password"
//             error={error?.password}
//             size="large"
//             placeholder="********"
//             onChange={handleChange}
//           />
//         </div>

//         <div className="text-center mt-6">
//           <Button
//             onClick={onLogin}
//             loading={loading}
//             type="primary"
//             block
//             size="large"
//           >
//             Sign In
//           </Button>
//           <div className="flex items-center justify-center mt-4 text-sm">
//             Forgot password? &nbsp;
//             <Link
//               href="/auth/recover"
//               className="text-emerald-400 hover:text-emerald-600 font-semibold"
//             >
//               Recover
//             </Link>
//           </div>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }

// // Login.layout = Auth;

export default function LoginOld() {
  return null;
}

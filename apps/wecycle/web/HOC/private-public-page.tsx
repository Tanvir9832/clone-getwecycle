import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/router";

export const withPrivatePage = (Component: React.FC) => {
  return function WithPrivatePage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${router.pathname}`);
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component />;
  };
};

export const withPublicPage = (Component: React.FC) => {
  return function WithPublicPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated]);

    if (isAuthenticated) {
      return null;
    }

    return <Component />;
  };
};

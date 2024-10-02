import { useAuthStore } from "../store/authStore";
import PrivateLayout from "./private";
import PublicLayout from "./public";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const L = isAuthenticated ? PrivateLayout : PublicLayout;
  return <L>{children}</L>;
};

export default Layout;

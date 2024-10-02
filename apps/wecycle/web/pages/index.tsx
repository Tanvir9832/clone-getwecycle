import PrivateHome from "../components/pages/private/Home";
import PublicHome from "../components/pages/public/Home";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <PrivateHome /> : <PublicHome />;
}

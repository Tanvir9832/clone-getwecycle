import { removeLocal } from "@tanbel/utils";
import { useAuthStore } from "../store/authStore";

export function useAction() {
  const { setAuthenticated, setUser } = useAuthStore();

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    removeLocal("token");
  };

  return {
    logout,
  };
}

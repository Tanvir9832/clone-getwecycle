import { removeLocal } from '@tanbel/utils';
import { useAuthStore } from '../store/authStore';

export function useAction() {
  const { setAuthenticated } = useAuthStore();

  const logout = () => {
    setAuthenticated(false);
    removeLocal('token');
  };

  return {
    logout,
  };
}

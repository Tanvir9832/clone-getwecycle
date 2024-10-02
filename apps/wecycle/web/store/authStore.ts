import { IUserModel } from "@tanbel/homezz/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (state?: boolean) => void;
  user: IUserModel | null;
  setUser: (user: IUserModel | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        setAuthenticated: (state) => {
          set(() => ({ isAuthenticated: state }));
        },
        user: null,
        setUser: (user) => set(() => ({ user })),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  sidebar: boolean;
  setSidebar: (sidebar: boolean) => void;
  loading: boolean;
  toggleLoader: (state?: boolean) => void;
}

export const useAppState = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebar: true,
        setSidebar: (sidebar) => set(() => ({ sidebar })),
        loading: false,
        toggleLoader: (loader) => {
          set((state) => ({
            loading: loader !== undefined ? loader : !state.loading,
          }));
        },
      }),
      {
        name: "app-storage",
      }
    )
  )
);

// Zustand store cho UI state toàn cục (hiện tại quản lý trạng thái mở/đóng sidebar).
import { create } from "zustand";

// Shape state/action của UI store.
interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  /*
  Set trạng thái sidebar
  Input:
  - open — true để mở, false để đóng.
  */
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

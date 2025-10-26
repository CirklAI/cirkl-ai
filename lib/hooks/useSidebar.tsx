"use client";

import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showingResults: boolean;
  setShowingResults: (status: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  showingResults: false,
  setShowingResults: (status) => set({ showingResults: status }),
}));
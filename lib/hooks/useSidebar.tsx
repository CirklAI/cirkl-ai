"use client";

import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isDesktopSidebarOpen: boolean;
  toggleDesktopSidebar: () => void;
  showingResults: boolean;
  setShowingResults: (status: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isDesktopSidebarOpen: true,
  toggleDesktopSidebar: () => set((state) => ({ isDesktopSidebarOpen: !state.isDesktopSidebarOpen })),
  showingResults: false,
  setShowingResults: (status) => set({ showingResults: status }),
  sidebarWidth: 256,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  isResizing: false,
  setIsResizing: (isResizing) => set({ isResizing }),
}));
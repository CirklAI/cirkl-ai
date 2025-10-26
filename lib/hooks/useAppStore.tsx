"use client";

import { create } from "zustand";

interface AppState {
  showingResults: boolean;
  setShowingResults: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  showingResults: false,
  setShowingResults: (status) => set({ showingResults: status }),
}));

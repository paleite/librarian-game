"use client";

import { create } from "zustand";

interface ViewControlState {
  zoomHeld: boolean;
  setZoomHeld: (zoomHeld: boolean) => void;
}

export const useViewControlStore = create<ViewControlState>((set) => ({
  zoomHeld: false,
  setZoomHeld: (zoomHeld) => set({ zoomHeld }),
}));

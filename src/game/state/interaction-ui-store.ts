"use client";

import { create } from "zustand";

export interface InteractionInfo {
  title: string;
  subtitle?: string;
  action?: string;
}

interface InteractionUiState {
  aimed: InteractionInfo | null;
  setAimed: (aimed: InteractionInfo | null) => void;
}

export const useInteractionUiStore = create<InteractionUiState>((set) => ({
  aimed: null,
  setAimed: (aimed) => set({ aimed }),
}));

"use client";

import { create } from "zustand";

export interface InteractionInfo {
  title: string;
  subtitle?: string;
  action?: string;
}

interface InteractionUiState {
  aimed: InteractionInfo | null;
  recallConfirmationOpen: boolean;
  setAimed: (aimed: InteractionInfo | null) => void;
  requestRecallConfirmation: () => void;
  closeRecallConfirmation: () => void;
}

export const useInteractionUiStore = create<InteractionUiState>((set) => ({
  aimed: null,
  recallConfirmationOpen: false,
  setAimed: (aimed) => set({ aimed }),
  requestRecallConfirmation: () => set({ recallConfirmationOpen: true }),
  closeRecallConfirmation: () => set({ recallConfirmationOpen: false }),
}));

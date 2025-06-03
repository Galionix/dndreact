import { CharacterStats } from '@/types/characterStats';
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Message = {
  type: "user" | "master";
  text: string;
};

interface HistoryState {
  messages: Message[];
  worldSeed: string | null;
  pendingCheck: { skill: keyof CharacterStats['skills']} | null ;
  setSeed: (seed: string) => void;
  addMessage: (message: Message) => void;
  clearHistory: () => void;
  setPendingCheck: ({ skill }: { skill: string }) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      messages: [],
      worldSeed: null,
      pendingCheck: null,
      setSeed: (seed) => set({ worldSeed: seed }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearHistory: () => set({ messages: [], worldSeed: null }),
      setPendingCheck: (skill) => set({ pendingCheck: skill } as any),
    }),
    {
      name: "history-storage",
    }
  )
);

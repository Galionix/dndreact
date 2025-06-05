import { CharacterStats } from "@/types/characterStats";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Message = {
  type: "user" | "master";
  text: string;
};
export type Check = {
  skill: keyof CharacterStats["skills"];
  value: number;
};
export type Action = {
  type: "default" | "use_item" | "use_ability" | "suggest";
  value: string;
};

interface HistoryState {
  messages: Message[];
  worldSeed: string | null;
  pendingChecks: Check[];
  setSeed: (seed: string) => void;
  addMessage: (message: Message) => void;
  clearHistory: () => void;
  setPendingChecks: (s: Check[]) => void;
  actions: Action[];
    setActions: (a: Action[]) => void;
    clearActions: () => void
}
const defaultActions: Action[] = [
    {
        type: 'default',
        value: 'Осмотреться',
    },
    {
        type: 'default',
        value: 'Проверить инвентарь',
    }
]
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      messages: [],
      actions: [],
      setActions: (actions) => set({ actions: defaultActions.concat(actions) }),
      worldSeed: null,
      pendingChecks: [],
      setSeed: (seed) => set({ worldSeed: seed }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearHistory: () => set({ messages: [], worldSeed: null }),
          setPendingChecks: (skill) => set({ pendingChecks: skill } as any),
          clearActions: () => set({actions: defaultActions})
    }),
    {
      name: "history-storage",
    }
  )
);

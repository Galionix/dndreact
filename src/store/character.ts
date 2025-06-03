import { CharacterStats } from '@/types/characterStats'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CharacterState = {
  character: CharacterStats | null
  setCharacter: (data: CharacterStats) => void
  resetCharacter: () => void
}

export const useCharacterStore = create(
    persist<CharacterState>(
      (set) => ({
        character: null,
        setCharacter: (data) => set({ character: data }),
        resetCharacter: () => set({ character: null })
      }),
      {
        name: 'character-storage' // ключ в localStorage
      }
    )
  )
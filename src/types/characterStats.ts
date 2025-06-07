export type CharacterStats = {
    name: string
    description: string
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number

    skills: {
      acrobatics: number
      animalHandling: number
      arcana: number
      athletics: number
      deception: number
      history: number
      insight: number
      intimidation: number
      investigation: number
      medicine: number
      nature: number
      perception: number
      performance: number
      persuasion: number
      religion: number
      sleightOfHand: number
      stealth: number
      survival: number
    }

    inventory: string[]
    abilities: string[]
  }

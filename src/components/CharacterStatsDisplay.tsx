import { useCharacterStore } from '@/store/character'
import { useHistoryStore } from '@/store/history'
import { CharacterStats } from '@/types/characterStats'
import React from 'react'
import MagicImageEffect from './MagicEffect'
// import { useCharacterStore } from '@/stores/useCharacterStore'

type Props = {
  character: CharacterStats
}

export const skillLabels: Record<string, string> = {
  acrobatics: 'Акробатика',
  animalHandling: 'Уход за животными',
  arcana: 'Магия',
  athletics: 'Атлетика',
  deception: 'Обман',
  history: 'История',
  insight: 'Проницательность',
  intimidation: 'Запугивание',
  investigation: 'Расследование',
  medicine: 'Медицина',
  nature: 'Природа',
  perception: 'Восприятие',
  performance: 'Выступление',
  persuasion: 'Убеждение',
  religion: 'Религия',
  sleightOfHand: 'Ловкость рук',
  stealth: 'Скрытность',
  survival: 'Выживание'
}

export const CharacterStatsDisplay: React.FC<Props> = () => {
  const character = useCharacterStore(state => state.character)
  const historyStorage = useHistoryStore()
  if(!character) return <p>Порсонаж не создан</p>
  const {
    name,
    description,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    skills,
    inventory,
    abilities,
  } = character

  // console.log('charAvatar: ', charAvatar);
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div
      className='flex justify-center items-center flex-col gap-4'
      >
      <img
          src={historyStorage.charAvatar}
          alt="Magic"
          className=" inset-0 w-[100px] h-[100px] object-cover rounded-full shadow-xl z-10"
        />
      <h1 className="text-3xl font-bold">{name}</h1>
      </div>
      <p className="text-lg text-text">{description}</p>
      {/* {historyStorage.charAvatar &&           <div className="p-4">
      <MagicImageEffect />
    </div>   } */}
      {/* {historyStorage.charAvatar && <img src={historyStorage.charAvatar} alt="AI generated" />} */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Stat label="Сила" value={strength} />
        <Stat label="Ловкость" value={dexterity} />
        <Stat label="Телосложение" value={constitution} />
        <Stat label="Интеллект" value={intelligence} />
        <Stat label="Мудрость" value={wisdom} />
        <Stat label="Харизма" value={charisma} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Навыки</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {Object.entries(skills).map(([skill, value]) => (
            <Stat key={skill} label={skillLabels[skill] || skill} value={value} small />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-4 mb-1">Инвентарь</h2>
        <ul className="list-disc list-inside">
          {inventory.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-4 mb-1">Способности</h2>
        <ul className="list-disc list-inside">
          {abilities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Stat = ({ label, value, small = false }: { label: string; value: number; small?: boolean }) => {
  let valueColor = 'text-gray-400'
  if (value > 15) valueColor = 'text-red-500'
  else if (value > 12) valueColor = 'text-orange-400'
  else if (value > 9) valueColor = 'text-yellow-400'

  return (
    <div className={`flex justify-between ${small ? 'text-sm text-gray-400' : 'text-base font-medium'}`}>
      <span>{label}</span>
      <span className={`${valueColor} font-bold`}>{value}</span>
    </div>
  )
}

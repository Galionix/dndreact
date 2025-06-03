'use client'

import { CharacterStatsDisplay } from '@/components/CharacterStatsDisplay'
import LogoPortal from '@/components/LogoPortal'
import { characterCreatePrompt } from '@/prompts/characterCreate'
import { useCharacterStore } from '@/store/character'
import { useHistoryStore } from '@/store/history'
import { buttonClassName } from '@/styles/button'
import { useState } from 'react'
import { useRouter } from 'next/router'

function extractJsonFromCodeBlock(content: string): string {
  const codeStart = content.indexOf('```json')
  const codeEnd = content.lastIndexOf('```')

  let raw = content
  if (codeStart !== -1 && codeEnd !== -1 && codeEnd > codeStart) {
    raw = content.slice(codeStart + 7, codeEnd) // 7 символов — длина ```json
  }
  // setCharacter
  const unescaped = raw
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .trim()

  return unescaped
}

export default function CharacterCreator() {
  const router = useRouter()

  const [description, setDescription] = useState('')
  const [character, setCharacter] = useState<any>(null)
  const store = useCharacterStore()

  const [loading, setLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  async function generateCharacter() {
    setLoading(true)

    const messages = [
      characterCreatePrompt,
      {
        role: 'user',
        content: description
      }
    ]

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    })

    const { reply } = await res.json()
    try {

      const json = JSON.parse(extractJsonFromCodeBlock(reply.content))
      setCharacter(json)
      store.setCharacter(json)
      setLoading(false)

    } catch {
      setLoading(false)
      // console.log('extractJsonFromCodeBlock(reply.content): ', extractJsonFromCodeBlock(reply.content));
      store.resetCharacter()
      alert('Ошибка парсинга ответа. Попробуй снова.')
    }

  }
  async function initNarrativeScene() {
    const character = useCharacterStore.getState().character
    const seed = useHistoryStore.getState().worldSeed

    if (!character || seed == null) throw new Error('Персонаж или seed не определены')

    try {
      const res = await fetch('/api/init-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed, character })
      })

      const { scene } = await res.json()
      if (!scene) throw new Error('Пустой ответ от API')

      useHistoryStore.getState().addMessage({ type: 'master', text: scene })
      setCreateLoading(false)
      router.push('/game')
    } catch (err) {
      setCreateLoading(false)


      console.error('Ошибка инициализации сцены:', err)
      throw err
    }

  }
  async function initGameFlow() {
    setCreateLoading(true)
    const character = useCharacterStore.getState().character
    if (!character) throw new Error('Character not initialized')

    const seed = Math.floor(Math.random() * 10000) + 1

    try {
      const res = await fetch('/api/grokSeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: seed })
      })

      const { situation } = await res.json()
      console.log('situation: ', situation);

      const setSeed = useHistoryStore.getState().setSeed
      // const addMessage = useHistoryStore.getState().addMessage
      const clearHistory = useHistoryStore.getState().clearHistory
      clearHistory()
      setSeed(situation)
      // addMessage({ type: 'master', text: situation })

      initNarrativeScene()
    } catch (err) {
      setCreateLoading(false)

      console.error('Ошибка при инициализации мира:', err)
      throw err
    }
  }


  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <LogoPortal open={loading || createLoading} />
      <h1 className="text-xl font-bold">Создание персонажа</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Опиши своего персонажа..."
      />
      <button
        disabled={description.trim().length < 10 || description.trim().length > 300 || loading}
        onClick={generateCharacter}
        // disabled={loading}
        className={buttonClassName}
      >
        {loading ? 'Генерация...' : 'Сгенерировать'}
      </button>

      {character && (<>
        <CharacterStatsDisplay character={character} />
        <button
        onClick={initGameFlow}
        className={buttonClassName}
        >
        {createLoading ? 'Создание...' : 'Создать'}
      </button>
        </>
      )}
    </div>
  )
}

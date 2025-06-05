import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { seed, character } = req.body

  if (!seed || !character) {
    return res.status(400).json({ error: 'Missing seed or character' })
  }

  const prompt = `
Ты — мастер подземелий в текстовой D&D-приключенческой игре. Игрок будет играть один. Используя предоставленное семя "${seed}" и краткое описание персонажа, опиши начало истории.
Никаких персонажей из семени нельзя использовать. ты можешь использовать только ситуации, адаптировать окружение, а персонажей нужно придумать заново, используя персонажа которого описал пользователь.
Вот пример структуры, которую ты должен выдать:

1. Кратко опиши, где находится персонаж, что его окружает, какое время суток, какие запахи, звуки и ощущения.
2. Укажи, как он себя чувствует (эмоционально и физически).
3. Предложи **две опции** (в стиле: "Попробовать...", "Осторожно...") — без номеров и кавычек. опции должны выглядеть так: [[ suggest:Попробовать...]] [[ suggest:Осторожно...]]

Ответ должен быть лаконичным, атмосферным, в стиле тёмного фэнтези. Максимум 150 слов. Не упоминай слово "персонаж", пиши в третьем лице по имени.

Имя и описание:
${character.name} — ${character.description}
`.trim()

  const messages: ChatCompletionMessageParam[] = [
      {
          role: 'system',
          content: 'Ты — мастер повествования. Генерируй атмосферные сцены и вариативные действия в стиле D&D.'
        },
        {
            role: 'user',
            content: prompt
        }
    ]

    console.log('messages: ', messages);
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 300
    })

    const content = completion.choices[0].message?.content?.trim()
    return res.status(200).json({ scene: content })
  } catch (err) {
    console.error('OpenAI init-scene error:', err)
    return res.status(500).json({ error: 'Ошибка генерации сцены' })
  }
}

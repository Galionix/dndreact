import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { number } = req.body
  if (typeof number !== 'number') return res.status(400).json({ error: 'Missing or invalid number' })

  const prompt = `
  Выбор ситуации: Сопоставь число с частью цикла (книги: 'Игра престолов', 'Битва королей', 'Буря мечей', 'Пир стервятников', 'Танец с драконами'). Раздели 10000 на 5 книг (примерно по 2000 на книгу). Например, 1–2000 — 'Игра престолов', 2001–4000 — 'Битва королей', и т.д. На основе числа определи приблизительное место в книге (начало: 0–25%, середина: 25–75%, конец: 75–100%) и выбери типичную ситуацию (2–3 предложения), отражающую персонажей, конфликт или событие из этой части.

  Ответ: Верни только описание ситуации (50–100 слов) в стиле книги, без объяснений, без указания книги или контекста. Если число повторяется, возвращай ту же ситуацию для воспроизводимости.

  Формат: Только текст ситуации, без лишних деталей.

  `.trim()

  try {
    const completion = await client.chat.completions.create({
      model: 'grok-3-latest', // или 'gpt-4', если нужен лучший стиль
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Число: ${number}` }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    const content = completion.choices[0].message?.content?.trim()
    return res.status(200).json({ situation: content })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Ошибка генерации' })
  }
}

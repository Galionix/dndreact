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
    Выбор ситуации: Сопоставь число с частью цикла (книги: 'Игра престолов', 'Битва королей', 'Буря мечей', 'Пир стервятников', 'Танец с драконами'). Раздели 10000 на 5 книг (примерно по 2000 на книгу). Например, 1–2000 — 'Игра престолов', 2001–4000 — 'Битва королей', и т.д.

Определи местоположение в книге (0–25% — начало, 25–75% — середина, 75–100% — конец) и выбери характерную сцену (конфликт, персонажи, действия).

На основе этой сцены определи один подходящий тип взаимодействия, используй список:

social: Обман, убеждение, запугивание (хараизма)

exploration: Поиск, история, восприятие (интеллект, мудрость)

physical: Прыжки, ловкость, кража (ловкость)

combat: Нападение, борьба, защита (сила, телосложение)

usage: Применение магии, предметов, лечения (мудрость, интеллект)

drama: Этический или тяжёлый выбор (без проверки)

Если взаимодействие требует проверки, добавь в конце следующую инструкцию в квадратных скобках:

csharp
Копіювати
Редагувати
[check: тип, характеристика, навык, сложность]
Например: [check: exploration, wisdom, perception, 13]

Формат вывода:

Краткое описание сцены (50–100 слов), вдохновлённой выбранной частью книги

В конце — инструкция check (если требуется), в отдельной строке

Без упоминаний книги, авторов, контекста и пояснений.`.trim()

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

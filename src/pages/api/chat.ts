import { OpenAI } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { messages } = req.body


  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request format' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.9
    })

    const reply = completion.choices[0].message
    res.status(200).json({ reply })
  } catch (error) {
    console.error('OpenAI error:', error)
    res.status(500).json({ error: 'OpenAI API call failed' })
  }
}

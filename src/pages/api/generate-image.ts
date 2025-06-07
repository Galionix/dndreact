import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.x.ai/v1',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { prompt } = req.body
  if (typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid prompt' })
  }

  try {
    const response = await client.images.generate({
      model: 'grok-2-image',
      prompt,
      response_format: "b64_json"
      // n: 1,
      // size: '512x512',
      // response_format: 'b64_json',
    })
    console.log(response.data?.[0].b64_json);
    const image = response.data?.[0]?.b64_json
    if (!image) throw new Error('No image data returned')

    return res.status(200).json({ image: `data:image/png;base64,${image}` })
  } catch (err) {
    console.error('Image generation error:', err)
    return res.status(500).json({ error: 'Ошибка генерации изображения' })
  }
}

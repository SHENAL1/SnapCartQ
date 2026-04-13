import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface ImagePayload {
  data: string
  mediaType: string
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { images } = req.body as { images: ImagePayload[] }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' })
    }

    const imageBlocks = images.map((img) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: img.data,
      },
    }))

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: `Analyze these product images and extract information about each product visible.

For each product, return:
- name: Product name including brand (e.g. "Cadbury Dairy Milk")
- price: Numeric price only, no currency symbol (null if not visible)
- weight: Weight or quantity like "200g", "1L", "12 pack" (null if not visible)

Return ONLY a valid JSON array, no other text. Example:
[{"name": "Cadbury Dairy Milk", "price": 4.50, "weight": "200g"}]

If no products are identifiable, return [].`,
            },
          ],
        },
      ],
    })

    const text = response.content.find((b) => b.type === 'text')?.text ?? '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const products = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return res.json({ products })
  } catch (error) {
    console.error('Extract products error:', error)
    return res.status(500).json({ error: 'Failed to process images' })
  }
}

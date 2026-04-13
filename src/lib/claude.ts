import type { ExtractedProduct } from '../types'

interface ImagePayload {
  data: string
  mediaType: string
}

export async function extractProductsFromImages(files: File[]): Promise<ExtractedProduct[]> {
  const images: ImagePayload[] = await Promise.all(
    files.map(async (file) => ({
      data: await fileToBase64(file),
      mediaType: file.type || 'image/jpeg',
    }))
  )

  const response = await fetch('/api/extract-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || 'Failed to extract products')
  }

  const data = await response.json()
  return data.products as ExtractedProduct[]
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

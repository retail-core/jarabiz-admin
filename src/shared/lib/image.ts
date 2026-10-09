const MAX_DIMENSION = 1200
const QUALITY = 0.82

/**
 * Resizes (longest side <= 1200px) and re-encodes to WebP in the browser.
 * Falls back to the original file if the browser can't encode WebP.
 */
export async function compressToWebp(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) throw new Error('Select an image file.')

  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', QUALITY),
    )
    if (!blob || blob.type !== 'image/webp') return file
    if (file.type === 'image/webp' && blob.size >= file.size) return file

    const base = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${base}.webp`, { type: 'image/webp' })
  } finally {
    bitmap.close()
  }
}
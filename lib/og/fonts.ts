// Edge-safe font loader for OG image generation
// Loads Delight font weights from the public/fonts directory

export async function loadOgFonts(baseUrl?: string) {
  const weights = [
    { file: 'delight-black.otf', weight: 900 as const },
    { file: 'delight-bold.otf', weight: 700 as const },
    { file: 'delight-medium.otf', weight: 500 as const },
  ] as const

  async function fetchViaModule(file: string) {
    const url = new URL(`../../public/fonts/${file}`, import.meta.url)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Module URL fetch failed for ${file}`)
    return res.arrayBuffer()
  }

  async function fetchViaHttp(file: string) {
    const origin = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/fonts/${file}`, origin)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP fetch failed for ${file}`)
    return res.arrayBuffer()
  }

  const fonts = await Promise.all(
    weights.map(async ({ file, weight }) => {
      let data: ArrayBuffer
      try {
        data = await fetchViaModule(file)
      } catch {
        try {
          data = await fetchViaHttp(file)
        } catch {
          // Final fallback for Node.js runtime: read from filesystem
          try {
            const fs = await import('fs/promises')
            const path = `${process.cwd()}/public/fonts/${file}`
            const buf = await fs.readFile(path)
            data = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
          } catch (e) {
            throw new Error(`Failed to load font ${file}`)
          }
        }
      }
      return { name: 'Delight', data, weight, style: 'normal' as const }
    })
  )

  return fonts
}

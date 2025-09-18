export async function loadFontFromFs(file: string) {
  const fs = await import('node:fs/promises')
  const path = `${process.cwd()}/public/fonts/${file}`
  const buf = await fs.readFile(path)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

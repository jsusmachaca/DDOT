import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

export const cryptoNamed = (originalName: string) => {
  const newName = randomUUID().replace(/-/g, '') + extname(originalName).toLowerCase()
  return newName
}
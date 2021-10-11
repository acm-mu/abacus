import { Item } from 'abacus'
import { createHash } from 'crypto'

export function sha256(str: string): string {
  return createHash('sha256').update(str).digest('hex')
}

export function transpose<T extends Record<string, unknown>>(items: T[], key: string): Record<string, T> {
  return Object.assign({}, ...items.map((obj) => ({ [`${obj[key]}`]: obj })))
}

export const makeJSON = (itemList: Item[], columns: string[] = []): string => {
  itemList.map((e) => {
    Object.keys(e).forEach((key) => {
      if (!columns.includes(key)) {
        delete e[key]
      }
    })
  })
  return JSON.stringify(itemList)
}

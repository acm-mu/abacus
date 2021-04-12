import { createHash } from 'crypto';

export const sha256 = (str: string) => createHash('sha256').update(str).digest('hex')

export const transpose = (items: Record<string, unknown>[] | undefined, key: string): Record<string, unknown> => items ? Object.assign({}, ...items.map(obj => ({ [`${obj[key]}`]: obj }))) : {}

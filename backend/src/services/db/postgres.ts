import { Database } from '.'
import { ScanOptions, Item, Key } from './database'
import { Pool } from 'pg'

export default class PostgreSQL extends Database {
  pool: Pool

  constructor() {
    super()
    this.pool = new Pool({
      host: 'localhost',
      user: 'abacus',
      database: 'abacus',
      password: 'abacus',
      port: 5432
    })
  }

  scan(TableName: string, query?: ScanOptions): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM public.${TableName}`
      if (query?.args) {
        const entries = Object.entries(query.args)
        if (entries.length > 0) {
          sql += ' WHERE ' + entries.map((e) => `${e[0]}=${this.repr(e[1])}`).join(' AND ')
        }
      }
      this.pool.query(sql, (err, res) => {
        if (err) {
          reject(err)
          return
        }

        resolve(
          res.rows.map((row) =>
            Object.assign(
              {},
              ...Object.entries(row)
                .filter((e) => e[1])
                .map((e) => ({ [e[0]]: e[1] }))
            )
          )
        )
      })
    })
  }

  get(TableName: string, Key: Key): Promise<Item> {
    return new Promise((resolve, reject) => {
      const key = Object.entries(Key)[0]
      this.pool.query(`SELECT * FROM public.${TableName} WHERE ${key[0]}=${this.repr(key[1])}`, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  put(TableName: string, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(Item).join(',')
      const values = Object.values(Item)
        .map((e) => this.repr(e))
        .join(',')

      const sql = `INSERT INTO public.${TableName} (${columns}) VALUES (${values})`
      this.pool.query(sql, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  repr(o: any) {
    if (typeof o == 'string') {
      return `'${o}'`
    }
    if (typeof o == 'object') {
      return `'${JSON.stringify(o)}'`
    }
    return o
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    return new Promise((resolve, reject) => {
      const key = Object.entries(Key)[0]
      let sql = `UPDATE public.${TableName} SET ${Object.entries(Item)
        .map((e) => `${e[0]}=${this.repr(e[1])}`)
        .join(', ')} WHERE ${key[0]}=${this.repr(key[1])}`

      this.pool.query(sql, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = Object.entries(Key)
      const sql = `DELETE FROM public.${TableName} WHERE ${key[0]}=${this.repr(key[1])}`
      this.pool.query(sql, (err, _res) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}

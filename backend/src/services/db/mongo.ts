import { Item } from 'abacus';
import * as dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import { Database } from '.';
import { Key, ScanOptions } from './database';

dotenv.config();

export default class MongoDB extends Database {
  private db!: Db; // Added definite assignment assertion for TypeScript

  constructor() {
    super();

    const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env;

    // Added ENV check to determine if env variables are being set correctly via .yml file
    if (!MONGO_HOST || !MONGO_USER || !MONGO_PASS || !MONGO_DBNAME) {
      throw new Error('Missing required MongoDB environment variables');
    }

    //const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}?authSource=admin`;
    const url = `mongodb://MUad:ep16y11BPqP@mongo:27017/abacus?authSource=admin`;
    MongoClient.connect(url)
      .then((client) => {
        if (!client) throw new Error('Could not connect to MongoDB database');
        this.db = client.db(MONGO_DBNAME); // Use the database name from env
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  scan(TableName: string, query?: ScanOptions, page?: number): Promise<Item[]> {
    const projection = query?.columns?.reduce(
      (acc, key) => ({ ...acc, [key]: 1 }),
      { _id: 0 }
    ) || { _id: 0 };

    const pageSize = 25;
    const skip = page ? (page - 1) * pageSize : 0;

    return this.db
      .collection(TableName)
      .find(query?.args || {}, { projection })
      .skip(skip)
      .limit(page ? pageSize : 0)
      .toArray();
  }

  count(TableName: string, query?: ScanOptions): Promise<number> {
    return this.db.collection(TableName).countDocuments(query?.args || {});
  }

  get(TableName: string, Key: Key): Promise<Item> {
    return this.db
      .collection(TableName)
      .findOne(Key, { projection: { _id: 0 } })
      .then((item) => {
        if (!item) {
          throw new Error('Item not found');
        }
        return item;
      });
  }

  put(TableName: string, Item: Item): Promise<Item> {
    return this.db.collection(TableName).insertOne(Item).then((result) => {
      if (result.acknowledged) {
        return Item;
      } else {
        throw new Error('Failed to insert item');
      }
    });
  }

  update(TableName: string, Key: Key, Item: Item): Promise<Item> {
    const unsetFields = Object.entries(Item)
      .filter(([, value]) => value === undefined || value === null)
      .reduce((acc, [key]) => ({ ...acc, [key]: 1 }), {});

    return this.db
      .collection(TableName)
      .updateOne(
        Key,
        { $set: Item, $unset: unsetFields },
      )
      .then((result) => {
        if (result.modifiedCount > 0) {
          return Item;
        } else {
          throw new Error('Failed to update item');
        }
      });
  }

  delete(TableName: string, Key: Key): Promise<void> {
    return this.db
      .collection(TableName)
      .deleteOne(Key)
      .then((result) => {
        if (!result.deletedCount) {
          throw new Error('Failed to delete item');
        }
      });
  }
}

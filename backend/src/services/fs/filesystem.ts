export default abstract class FileSystem {
  constructor() {
    if (this.constructor == FileSystem) {
      throw new Error("Object of Abstract Class cannot be created")
    }
  }

  abstract scan(params: Params): Item[];

  abstract get(TableName: string, Key: string): Item;

  abstract put(TableName: string, Item: Item): void;

  abstract update(params: Params, TableName: string, Key: string): Item;

  abstract delete(TableName: string, Key: string): void;

  abstract batchWrite(RequestItems: any): void;
}
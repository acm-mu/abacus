import AWS, { AWSError, S3 } from "aws-sdk";
import { AttributeMap, BatchWriteItemOutput, DeleteItemOutput, DocumentClient, GetItemOutput, ItemList, PutItemOutput, ScanInput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { ArgsType, CompetitionSettings } from "types";

class ContestService {
  db: DocumentClient;
  s3: S3;

  constructor() {
    this.init_aws();
  }

  init_aws() {
    AWS.config.region = 'us-east-2';

    this.db = new DocumentClient();
    this.s3 = new S3();
  }

  async get_settings(): Promise<CompetitionSettings> {
    return new Promise((resolve, reject) => {
      this.scanItems('setting')
        .then((itemList?: ItemList) => {
          if (itemList)
            resolve(Object.assign({}, ...itemList.map(((x: any) => ({ [x.key]: x.value })))))
          else
            reject()
        })
        .catch(err => reject(err))
    })
  }

  save_settings(settings: CompetitionSettings): Promise<BatchWriteItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.batchWrite({
        RequestItems: {
          'setting': Object.entries(settings).map((e) => ({ PutRequest: { Item: { "key": e[0], "value": e[1] } } }))
        }
      }, (err: AWSError, data: BatchWriteItemOutput) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  transpose(itemList: ItemList, key: string): { [key: string]: any } {
    return Object.assign({}, ...itemList.map((obj: any) => ({ [obj[key]]: obj })))
  }

  scanItems(tableName: string, args?: ArgsType): Promise<ItemList | undefined> {
    return new Promise((resolve, reject) => {
      let params: ScanInput = {
        TableName: tableName
      }
      if (args) {
        const entries = Object.entries(args)
        if (entries.length > 0) {
          params.FilterExpression = entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(" AND ")
          params.ExpressionAttributeNames = Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] })))
          params.ExpressionAttributeValues = Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
        }
      }
      this.db.scan(params, (err: AWSError, data: ScanOutput) => {
        if (err) reject(err)
        else resolve(data.Items)
      })
    })
  }

  getItem(tableName: string, key: ArgsType): Promise<AttributeMap | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get({
        TableName: tableName,
        Key: key
      }, (err: AWSError, data: GetItemOutput) => {
        if (err) reject(err)
        else resolve(data.Item)
      })
    })
  }

  putItem(tableName: string, item: ArgsType): Promise<PutItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.put({
        TableName: tableName,
        Item: item
      }, (err: AWSError, data: PutItemOutput) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  updateItem(tableName: string, key: ArgsType, args: ArgsType): Promise<UpdateItemOutput> {
    return new Promise((resolve, reject) => {
      const entries = Object.entries(args).filter(entry => !Object.keys(key).includes(entry[0]))
      this.db.update({
        TableName: tableName,
        Key: key,
        UpdateExpression: "SET " + (entries.map((e) => (`#${e[0]} = :${e[0]}`)).join(", ")),
        ExpressionAttributeNames: Object.assign({}, ...entries.map((x) => ({ [`#${x[0]}`]: x[0] }))),
        ExpressionAttributeValues: Object.assign({}, ...entries.map((x) => ({ [`:${x[0]}`]: x[1] })))
      }, (err: AWSError, data: UpdateItemOutput) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  deleteItem(tableName: string, key: ArgsType): Promise<DeleteItemOutput> {
    return new Promise((resolve, reject) => {
      this.db.delete({
        TableName: tableName,
        Key: key
      }, (err: AWSError, data: DeleteItemOutput) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}

const contest = new ContestService();
export default contest;

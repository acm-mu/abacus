// import AWSMock from 'jest-aws-sdk-mock';
import * as AWSMock from 'aws-sdk-mock'
import * as AWS from 'aws-sdk';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';

describe('this module', () => {
  afterEach(() => {
    AWSMock.restore()
  })

  it('should mock getItem from DynamoDB', async () => {
    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('DynamoDB', 'getItem', (_params: GetItemInput, callback: Function) => {
      console.log('DynamoDB', 'getItem', 'mock called');
      callback(null, { pk: 'foo', sk: 'bar' });
    })

    const input: GetItemInput = { TableName: 'TableName', Key: {} };
    const dynamodb = new AWS.DynamoDB({ region: 'us-east-2', apiVersion: '2012-08-10' });
    expect(await dynamodb.getItem(input).promise()).toEqual({ pk: 'foo', sk: 'bar' });

    AWSMock.restore('DynamoDB');
  });

  it('should mock reading from DocumentClient', async () => {
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'get', 'mock called');
      callback(null, { pk: "foo", sk: "bar" });
    })

    let input: GetItemInput = { TableName: 'TableName', Key: {} };
    const client = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    expect(await client.get(input).promise()).toEqual({ pk: 'foo', sk: 'bar' });

    AWSMock.restore('DynamoDB.DocumentClient');
  })
})
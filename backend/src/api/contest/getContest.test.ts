import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { GetItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';
import express from 'express'
import request from 'supertest'
import contest from '.'

describe('/contest', () => {

  it("GET /contest - success", async () => {
    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'scan', 'mock called')
      callback(null, []);
    })

    const app = express()
    app.use(contest)

    const { body } = await request(app).get('/contest')

    console.log(body)

    AWSMock.restore('DynamoDB.DocumentClient');
  })
})
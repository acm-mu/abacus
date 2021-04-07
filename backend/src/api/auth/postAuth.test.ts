import * as AWS from 'aws-sdk';
import { ScanInput } from 'aws-sdk/clients/dynamodb'
import request from 'supertest';
import { app } from '../../server';

describe('this module', () => {

  beforeEach(() => {
    const awsMock = jest.spyOn(AWS.DynamoDB, 'DocumentClient');

    awsMock.mockImplementation((): any => ({
      scan: async (_params: ScanInput, callback: Function) => {
        callback(null, {
          Items: [
            { username: 'user', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' }
          ]
        })
      }
    }))
  })

  it('POST /auth', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ username: 'user', password: 'password' })

    expect(res.status).toBe(200)
  })

})
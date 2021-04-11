import * as AWS from 'aws-sdk';
import { ScanInput } from 'aws-sdk/clients/dynamodb'
import { app } from '../../server';
import request from 'supertest';

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

  it('GET - 403/Forbidden no credentials', async () => {
    const res = await request(app).get('/auth')

    expect(res.status).toBe(403)
  })

  it('GET - 403/Forbidden bad credentials', async () => {
    const res = await request(app)
      .get('/auth')
      .set('Authorization', '32323232323')

    expect(res.status).toBe(403)
  })

})
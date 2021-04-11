import * as AWS from 'aws-sdk';
import { ScanInput } from 'aws-sdk/clients/dynamodb';
import request from 'supertest'
import { app } from '../../server';

describe('/contest', () => {

  it("GET /contest - success", async () => {

    const awsMock = jest.spyOn(AWS.DynamoDB, 'DocumentClient');

    awsMock.mockImplementation((): any => ({
      scan: async (_params: ScanInput, callback: Function) => {
        callback(null, {
          Items: [
            { key: 'competition_name', value: 'Competition Name' },
            { key: 'points_per_no', value: 14 },
            { key: 'points_per_yes', value: 13 },
            { key: 'points_per_minute', value: 23 },
            { key: 'points_per_compilation_error', value: 72 },
            { key: 'start_date', value: 16175490000 },
            { key: 'end_date', value: 1617941100 }]
        })
      }
    }));

    const { body } = await request(app).get('/contest').expect(200)

    expect(body).toMatchObject({
      competition_name: 'Competition Name',
      points_per_no: 14,
      points_per_yes: 13,
      points_per_minute: 23,
      points_per_compilation_error: 72,
      start_date: 16175490000,
      end_date: 1617941100
    })
  })
})
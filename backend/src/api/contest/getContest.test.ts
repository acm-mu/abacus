import { contest } from '../../abacus';
import { JSONDB } from '../../abacus/db';
import request from 'supertest'
import { app } from '../../server';

describe('/contest', () => {

  it("GET /contest - success", async () => {

    contest.db = new JSONDB({
      'setting': {
        'competition_name': {
          key: 'competition_name',
          value: 'Competition Name'
        },
        'points_per_no': {
          key: 'points_per_no',
          value: 14
        },
        'points_per_yes': {
          key: 'points_per_yes',
          value: 13
        },
        'points_per_minute': {
          key: 'points_per_minute',
          value: 23
        },
        'points_per_compilation_error': {
          key: 'points_per_compilation_error',
          value: 72
        },
        'start_date': {
          key: 'start_date',
          value: 16175490000
        },
        'end_date': {
          key: 'end_date',
          value: 1617941100
        }
      }
    })

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
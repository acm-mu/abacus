import { app } from '../../server';
import request from 'supertest';
import { contest } from '../../abacus';
import { JSONDB } from '../../abacus/db';
import { sha256 } from '../../utils';

describe('this module', () => {

  beforeEach(() => {
    contest.db = new JSONDB({
      'user': {
        'aw8fawe9f8awe9fawe9f7awe9f7': {
          uid: 'aw8fawe9f8awe9fawe9f7awe9f7',
          username: 'user',
          password: sha256('afawefawef')
        }
      }
    })
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
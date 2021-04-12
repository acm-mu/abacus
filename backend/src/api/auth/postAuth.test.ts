import { sha256 } from '../../utils';
import request from 'supertest';
import { app } from '../../server';
import { contest } from '../../abacus';
import { JSONDB } from '../../abacus/db';

describe('POST /auth endpoint', () => {

  it('No credentials', async () => {

    contest.db = new JSONDB({
      'user': {}
    })

    const res = await request(app).post('/auth').send({ username: '', password: '' })

    expect(res.status).toBe(400)
  })

  it('Correct credentials', async () => {

    const user = { username: 'user', password: 'password' }

    contest.db = new JSONDB({
      'user': {
        'awefawefawefawefawefawefawefawef': { ...user, password: sha256(user.password) }
      }
    })

    const res = await request(app).post('/auth').send(user)

    expect(res.status).toBe(200)
  })

})
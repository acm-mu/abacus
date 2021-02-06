import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid'
import contest from "./contest";
import { Router, Request, Response } from "express";

const authlib = Router();

authlib.post('/authlib', async (req: Request, res: Response) => {
  let { username, password, session_token } = req.body

  let users = [];
  try {
    if (username && password) {
      const hash = createHash('sha256').update(password).digest('hex')
      users = Object.values(await contest.get_users({ username, password: hash }))
    } else if (username && session_token) {
      users = Object.values(await contest.get_users({ username, session_token }))
    }

    if (users.length == 1) {
      const user = users[0]
      if (!session_token) {
        session_token = uuidv4().replace(/-/g, '')
        await contest.updateItem('user', { user_id: user.user_id }, { session_token })
        user.session_token = session_token
      }
      delete user.password

      res.send(user)
      return
    }
  } catch (err) {
    res.status(500).send(err)
    return
  }

  res.status(204).send({ error: "Could not authenticate!" })
})

export default authlib
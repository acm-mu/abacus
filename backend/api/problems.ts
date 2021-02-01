import contest from '../contest';
import { Router } from 'express'

const problems = Router();

problems.get('/', async(req, res) => 
  res.send(await contest.get_problems(req.query))
)

export default problems
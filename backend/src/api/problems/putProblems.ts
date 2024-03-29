import { Problem } from 'abacus'
import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'

import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  },
  description: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'description is not supplied'
  },
  division: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is not supplied'
  },
  id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'id is not supplied'
  },
  name: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'name is not supplied'
  },
  memory_limit: {
    in: 'body',
    optional: true,
    errorMessage: 'memory_limit is invalid'
  },
  cpu_time_limit: {
    in: 'body',
    optional: true,
    errorMessage: 'cpu_time_limit is invalid'
  },
  tests: {
    in: 'body',
    optional: true
  },
  skeletons: {
    in: 'body',
    optional: true
  },
  solutions: {
    in: 'body',
    optional: true
  },
  max_points: {
    in: 'body',
    optional: true
  },
  capped_points: {
    in: 'body',
    optional: true
  },
  project_id: {
    in: 'body',
    optional: true
  },
  design_document: {
    in: 'body',
    isBoolean: true,
    optional: true
  },
  practice: {
    in: 'body',
    isBoolean: true,
    optional: true
  }
}

/**
 * @swagger
 * /problems:
 *   put:
 *     summary: Updates an existing problem.
 *     tags: [Problems]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problem'
 *     security:
 *       - bearerAuth: [""]
 *     responses:
 *       200:
 *         description: Success. Returns requested changes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewProblem'
 *       401:
 *         description: Could not authenticate user.
 *       404:
 *         description: Bad Request. Provided problem does not match schema.
 *       500:
 *         description: A server error occurred while trying to complete request.
 */
export const putProblems = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const item = matchedData(req)

  if (item.division == 'gold' && item.project_id) {
    const scratchResponse = await axios.get(`https://api.scratch.mit.edu/projects/${item.project_id}`)
    if (scratchResponse.status !== 200) {
      res.status(400).send('Server cannot access project with that id!')
      return
    }
  }

  if (item.id) {
    const problems = Object.values(await contest.get_problems({ id: item.id, division: item.division })) as Problem[]
    if (problems.length > 0 && problems[0].pid != item.pid) {
      res.status(400).json({ message: 'Problem id is taken!' })
      return
    }
  }

  try {
    await contest.update_problem(req.body.pid, item)
    res.send(item)
  } catch (err) {
    res.sendStatus(500)
  }
}

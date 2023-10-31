import { Test } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'
import { transpose } from '../../utils'

export const schema: Record<string, ParamSchema> = {
  sid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sid is invalid'
  },
  division: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'division is invalid'
  },
  language: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'language is invalid'
  },
  pid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'pid is invalid'
  },
  status: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'status is invalid'
  },
  sub_no: {
    in: ['query', 'body'],
    isNumeric: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'sub_no is invalid'
  },
  tid: {
    in: ['query', 'body'],
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: 'tid is invalid'
  },
  released: {
    in: ['query', 'body'],
    isBoolean: true,
    notEmpty: true,
    optional: true
  },
  flagged: {
    in: ['query', 'body'],
    isString: true,
    optional: true
  },
  claimed: {
    in: ['query', 'body'],
    isString: true,
    optional: true
  },
  viewed: {
    in: ['query', 'body'],
    isBoolean: true,
    optional: true
  }
}

/**
 * @swagger
 * /submissions
 *   get:
 *     summary: Search for submissions with provided queries.
 *     description: Returns list of submissions that match provided query.
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: [""]
 *     parameters:
 *       - name: sid
 *         in: query
 *         schema:
 *           type: string
 *       - name: division
 *         in: query
 *         schema:
 *           type: string
 *       - name: language
 *         in: query
 *         schema:
 *           type: string
 *       - name: pid
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: sub_no
 *         in: query
 *         schema:
 *           type: integer
 *       - name: tid
 *         in: query
 *         schema:
 *           type: string
 *       - name: released
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: flagged
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: claimed
 *         in: query
 *         schema:
 *           type: string
 *       - name: viewed
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of submissions matching provided queries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Could not complete request because request does not match required schema.
 *       401:
 *         description: Could not authenticate user.
 *       500:
 *         description: A server error occurred while trying to complete request.
 */
export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  try {
    const query = matchedData(req)

    if (req?.user?.role == 'judge') {
      query.division = req.user.division
    } else if (req?.user?.role == 'team') {
      query.tid = req.user.uid
    }
    
    const pageSize = req.query.limit? parseInt(req.query.limit as string) : 25

    const options = {
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      limit: pageSize,
      sortBy: req.query.sortBy as string,
      sortDirection: req.query.sortDirection as string
    }

    const submissionItems = (await contest.get_resolved_submissions(query, options))

    let submissions = submissionItems.items

    // Obfuscate submission details to teams if not yet released.
    if (submissionItems.totalItems) {
      submissions = submissions
        .map((submission) => {
          if (req.user?.role == 'team' && !submission.released) {
            submission.status = 'pending'
            submission.score = 0
            submission.tests = submission.tests?.map((test: Test) => ({ ...test, result: '' }))
          }
          return submission
        })
    }

    res.send({
      items: transpose(submissions, 'sid'),
      totalItems: submissionItems.totalItems
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { io } from '../../server'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
import contest from '../../abacus/contest'
import { Submission } from 'abacus'

export const schema: Record<string, ParamSchema> = {
  pid: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'pid is not supplied'
  },
  language: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  source: {
    in: 'body',
    notEmpty: true,
    isString: true,
    optional: true
  },
  division: {
    in: 'body',
    isString: true
  },
  project_id: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  },
  design_document: {
    in: 'body',
    isString: true,
    notEmpty: true,
    optional: true
  }
}

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Create new blue/gold submission.
 *     description: >-
 *       Creates new blue/gold submissions. Blue submissions required language and source. Gold submissions require project_id and design_document if problem requires it.
 *     tags: [Submissions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pid:
 *                 type: string
 *               language:
 *                 type: string
 *               source:
 *                 type: string
 *               project_id:
 *                 type: string
 *               design_document:
 *                 type: string
 *     security:
 *       - bearerAuth: [""]
 *     responses:
 *       200:
 *         description: Successfully created new submission.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Bad Request. Request body does not match required schema.
 *       401:
 *         description: Could not authenticate user.
 *       403:
 *         description: Either account is disabled or outside of competition time period.
 *       500:
 *         description: A server error occured while trying to complete request.
 *
 *
 *
 */

export const postSubmissions = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  if (!req.user) {
    res.status(401).send({ message: 'Your credentials could not be recognized!' })
    return
  }
  try {
    const item = matchedData(req)

    const user = await contest.get_user(req.user?.uid)
    if (!user) {
      res.status(401).send({ message: 'Your credentials could not be recognized!' })
      return
    }

    if (user.disabled) {
      res.status(403).send({ message: 'Your account is disabled!' })
      return
    }

    const problem = await contest.get_problem(item.pid)
    if (!problem) {
      res.status(400).send({ message: 'Problem does not exist!' })
      return
    }
    if (user?.division != problem.division) {
      res.status(403).send({ message: 'You can not submit to problems in this division!' })
      return
    }

    const {
      start_date,
      end_date,
      practice_start_date,
      practice_end_date,
      points_per_yes,
      points_per_minute,
      points_per_no
    } = await contest.get_settings()
    const now = Date.now()
    if (problem.practice) {
      if (now < practice_start_date * 1000) {
        res.status(403).send({ message: 'The practice period has not yet begun!' })
        return
      } else if (now > practice_end_date * 1000) {
        res.status(403).send({ message: 'Cannot submit after the practice period has finished!' })
        return
      }
    } else {
      if (now < start_date * 1000) {
        res.status(403).send({ message: 'The competition has not yet begun!' })
        return
      } else if (now > end_date * 1000) {
        res.status(403).send({ message: 'Cannot submit after the competition has finished!' })
        return
      }
    }

    const submissions = (await contest.get_submissions({ tid: req.user?.uid, pid: item.pid })) as Submission[]

    if (submissions) {
      for (const submission of submissions) {
        if (submission.status === 'accepted' && problem.division != 'gold') {
          res.status(403).send({ message: 'You have already solved this problem!' })
          return
        }
        if (submission.status === 'pending') {
          res.status(403).send({ message: 'Cannot submit while your last submission is pending!' })
          return
        }

        if (!submission.released) {
          res.status(403).send({ message: 'Cannot submit until your last submission has been released!' })
          return
        }
      }
    }

    let submission: Record<string, unknown> = {
      sid: uuidv4().replace(/-/g, ''),
      pid: item.pid,
      tid: req.user?.uid,
      division: item.division,
      released: false,
      sub_no: submissions?.length,
      status: 'pending',
      score: 0,
      date: Date.now() / 1000
    }
    if (!item.language) {
      res.status(400).json({ message: 'language not provided' })
      return
    }
    // Only run for new items

    // Find submission from event metadata

    // Get problem and competition details
    if (item.division === 'blue') {
      if (req.files?.source == undefined) {
        res.status(400).json({ message: 'source not provided' })
        return
      }
      const problem = await contest.get_problem(item.pid)

      // Update status to 'pending'
      // await updateItem('', { submission.sid }, { status: 'pending' });
      await contest.create_submission({ sid: submission.sid, status: 'pending' })
      // Extract details and set defaults
      const { name: filename, size: filesize, md5, data } = req.files.source as UploadedFile
      submission = {
        ...submission,
        language: item.language,
        filename,
        filesize,
        md5,
        tests: problem.tests,
        source: data.toString('utf-8')
      }
      let status = 'accepted'
      for (let test of problem.tests) {
        // Copy tests from problem
        submission.tests = problem.tests

        // Run tests
        const file = { name: submission.filename as string, content: submission['source'] as string }
        // Await response from piston execution
        try {
          const res = await axios.post(
            'https://piston.tabot.sh/api/v2/execute',
            {
              language: item.language,
              files: [file],
              version: item.language === 'python' ? '3.9.4' : '15.0.2',
              stdin: test.in
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          test['stdout'] = res.data.run.code == 0 ? res.data.run.stdout : res.data.run.stderr
          if ((res.data.run.output.trim() as string) == (test.out.trim() as string) && res.data.run.code === 0) {
            console.log('Result: ACCEPTED')
            test['result'] = 'accepted'
          } else {
            console.log('Result: REJECTED')
            status = 'rejected'
            test['result'] = 'rejected'
          }
        } catch (e) {
          console.log(e)
        }
      }
      submission.status = status
      // Calculate Score
      if (status == 'accepted') {
        let minutes = 0
        if (problem.practice) {
          minutes = ((submission.date as any) - practice_start_date) / 60
        } else {
          minutes = ((submission.date as any) - start_date) / 60
        }
        submission.score = Math.floor(
          minutes * points_per_minute + points_per_no * (submission.sub_no as any) + points_per_yes
        )
      } else {
        submission.score = 0
      }

      // Save submission to database
      await contest.update_submission(submission.sid as string, { ...submission, sid: submission.sid })
    } else if (req.user?.division == 'gold') {
      const scratchResponse = await axios.get(`https://api.scratch.mit.edu/projects/${item.project_id}`)
      if (scratchResponse.status !== 200) {
        res.status(400).send({ message: 'Server cannot access project with that id!' })
        return
      }

      submission = {
        ...submission,
        status: 'accepted',
        language: 'scratch',
        design_document: item.design_document,
        project_id: item.project_id
      }
      await contest.create_submission(submission)
    }
    io.emit('new_submission', { sid: submission.sid })

    if (process.env.NODE_ENV == 'development') contest.run_submission(submission.sid as string)

    res.send(submission)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

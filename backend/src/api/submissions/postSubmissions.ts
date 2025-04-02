import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { io } from '../../server'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
import contest from '../../abacus/contest'
import { Submission } from 'abacus'

// Define the validation schema for the request body
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

// Function to handle the POST request for submissions
export const postSubmissions = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors in the request
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    // If validation fails, return an error response
    res.status(400).json({ message: errors[0].msg })
    return
  }

  // Check to see if the user is authenticated
  if (!req.user) {
    res.status(401).send({ message: 'Your credentials could not be recognized!' })
    return
  }
  try {
    // Get matched data from the request
    const item = matchedData(req)

    // Get user data using the user's ID
    const user = await contest.get_user(req.user?.uid)
    if (!user) {
      res.status(401).send({ message: 'Your credentials could not be recognized!' })
      return
    }

    // Check if the user account is disabled
    if (user.disabled) {
      res.status(403).send({ message: 'Your account is disabled!' })
      return
    }

    // Get the problem data associated with the submission
    const problem = await contest.get_problem(item.pid)
    if (!problem) {
      res.status(400).send({ message: 'Problem does not exist!' })
      return
    }

    // Checks if user is allowed to submit to the selected problem's division
    if (user?.division != problem.division) {
      res.status(403).send({ message: 'You can not submit to problems in this division!' })
      return
    }

    // Get contest settings for the competition or practice period
    const {
      start_date,
      end_date,
      practice_start_date,
      practice_end_date
    } = await contest.get_settings()
    const now = Date.now()

    // Check if the problem is in the practice period or competition period
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

    // Get the user's previous submissions for the same problem
    const submissions = (await contest.get_submissions({ tid: req.user?.uid, pid: item.pid })) as Submission[]

    // Check if the user has already solved the problem or if there are pending submissions
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

    // Create a new submission object
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

    // Checks to see if the 'language' field is provided for blue submissions
    if (!item.language) {
      res.status(400).json({ message: 'language not provided' })
      return
    }

    // Handle blue division submissions
    if (item.division === 'blue') {
      if (req.files?.source == undefined) {
        res.status(400).json({ message: 'source not provided' })
        return
      }

      // Get problem details
      const problem = await contest.get_problem(item.pid)

      // Create the submission
      await contest.create_submission({ sid: submission.sid, status: 'pending' })
      
      // Extract details and set defaults
      const { name: filename, size: filesize, md5, data } = req.files.source as UploadedFile

      // Update the submission with additional details
      submission = {
        ...submission,
        language: item.language,
        filename,
        filesize,
        md5,
        tests: problem.tests,
        source: data.toString('utf-8')
      }

      // Set the submission status to 'pending'
      submission.status = 'pending'

      // Save submission to database
      await contest.update_submission(submission.sid as string, { ...submission, sid: submission.sid })
    }
    // Handle gold division submissions (Scratch projects)
    else if (req.user?.division == 'gold') {
      // Fetch Scratch projects data using the project ID
      const scratchResponse = await axios.get(`https://api.scratch.mit.edu/projects/${item.project_id}`)
      if (scratchResponse.status !== 200) {
        res.status(400).send({ message: 'Server cannot access project with that id!' })
        return
      }

      // Create a gold submission and mark it as accepted
      submission = {
        ...submission,
        status: 'accepted',
        language: 'scratch',
        design_document: item.design_document,
        project_id: item.project_id
      }
      // Save the gold submission
      await contest.create_submission(submission)
    }
    io.emit('new_submission', { sid: submission.sid })

    // Send the submission details as the response
    res.send(submission)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

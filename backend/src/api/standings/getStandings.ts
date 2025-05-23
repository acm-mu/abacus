import { Problem, Submission } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import { transpose } from '../../utils'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  division: {
    in: ['body', 'query'],
    isString: true,
    errorMessage: 'Division is not supplied!'
  }
}

// interface BlueStandingsUser {
//   display_name: string;
//   uid: string;
//   username: string;
//   solved: number;
//   time: number;
//   problems: Record<string, {
//     num_submissions: number;
//     problem_score: number;
//     solved: boolean;
//     submissions: Submission[];
//   }>
// };

/**
 * @swagger
 * /standings:
 *   get:
 *     summary: Returns standings for given division.
 *     description: Based on the provided division, returns current standings in ordered list.
 *     tags: [Standings]
 *     parameters:
 *       - name: division
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: .
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 problems:
 *                   $ref: '#/components/schemas/Problem'
 *                 standings:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         score:
 *                           type: integer
 *                         solved:
 *                           type: integer
 *                         time:
 *                           type: integer
 *       204:
 *         description: No Content. Before competition.
 *       400:
 *         description: Request does not match required schema.
 */

export interface SubmissionObject extends Record<string, unknown> {
  sid: string
  date: number
  project_id?: string
  pid: string
  released: boolean
  score: number
  status: string
  sub_no: number
  tid: string
  claimed?: string
  viewed?: boolean
  flagged?: string
}

type Standings<T> = {
  problems: Problem[]
  standings: T[]
}

interface BlueTeam {
  display_name: string
  uid: string
  username: string
  solved: number
  time: number
  problems: Record<
    string,
    {
      num_submissions: number
      problem_score: number
      solved: boolean
      submissions: SubmissionObject[]
    }
  >
}

// Function that calculates blue standings and stores the standings in the database
const calculateBlueStandings = async (isPractice: boolean): Promise<Standings<BlueTeam>> => {
  let teams = await contest.get_users({ role: 'team', division: 'blue' })
  teams = teams.filter((user) => !user.disabled)

  const submissions = await contest.get_submissions({ division: 'blue' })

  let problemsList = await contest.get_problems({ division: 'blue' }, ['pid', 'division', 'id', 'name', 'practice'])
  problemsList = problemsList.filter(({ practice }) => {
    if (isPractice) return practice
    return practice == undefined || practice == false
  })

  const problems = transpose(problemsList, 'pid')

  const subs: Record<string, Record<string, SubmissionObject[]>> = {}

  Object.values(submissions).forEach((submission: SubmissionObject) => {
    const { tid, pid } = submission
    if (!Object.keys(problems).includes(pid)) return
    if (!(tid in subs)) subs[tid] = {}
    if (!(pid in subs[tid])) subs[tid][pid] = []

    delete submission.source
    delete submission.filename
    delete submission.filesize
    delete submission.md5
    delete submission.division
    delete submission.language
    delete submission.tests
    delete submission.runtime

    if (!submission.released) {
      submission.status = 'pending'
    }

    subs[tid][pid].push(submission)
  })

  const standings = teams
    .map((team) => {
      const team_problems: Record<
        string,
        { num_submissions: number; problem_score: number; solved: boolean; submissions: SubmissionObject[] }
      > = {}
      let time = 0
      let solved = 0

      Object.values(problems)
        .sort((p1, p2) => p1.id.localeCompare(p2.id))
        .forEach((problem) => {
          team_problems[problem.id] = {
            solved: false,
            problem_score: 0,
            num_submissions: 0,
            submissions: []
          }
          if (team.uid in subs) {
            if (problem.pid in subs[team.uid]) {
              team_problems[problem.id].num_submissions = subs[team.uid][problem.pid].length
              team_problems[problem.id].submissions = subs[team.uid][problem.pid]
              subs[team.uid][problem.pid].every((sub) => {
                if (sub.status === 'accepted') {
                  team_problems[problem.id].problem_score = sub.score
                  team_problems[problem.id].solved = true
                  solved++
                  time += sub.score
                  return false
                }
                return true
              })
            }
          }
        })

      return {
        uid: team.uid,
        username: team.username,
        display_name: team.display_name,
        time,
        solved,
        problems: team_problems
      }
    })
    .sort((s1, s2) => {
      if (s1.solved == s2.solved) return s1.time - s2.time
      return s2.solved - s1.solved
    })

    const division = 'blue'
    const time_updated = Date.now()

    const standing = {
      division,
      problems,
      standings,
      time_updated
    }

    await contest.update_standing('blue', standing)

  return {
    problems: Object.values(problems),
    standings
  }
}

// Function that checks whether it is time to recalculate the standings
const isTimeToUpdateStandings = async (time_updated: number): Promise<boolean> => {
  const current_time = Date.now()

  if (current_time < (time_updated + (5 * 60 * 1000))) {
    return false
  }
  else
    return true
}

// Function that returns the blue standings
const getBlueStandings = async (isPractice: boolean): Promise<Standings<BlueTeam>> => {
  const standing = await contest.get_standing('blue')

  if (await isTimeToUpdateStandings(standing.time_updated) === false) {
    return {
      problems: Object.values(standing.problems),
      standings: standing.standings
    }
  }
  else {
    const standing = calculateBlueStandings(isPractice)
    return {
      problems: Object.values((await standing).problems),
      standings: (await standing).standings
    }
  }
}

interface GoldTeam {
  display_name: string
  uid: string
  username: string
  score: number
  problems: Record<string, { score: number; status: string }>
}

// Function that calculates gold standings and stores the standings in the database
const calculateGoldStandings = async (isPractice: boolean): Promise<Standings<GoldTeam>> => {
  let teams = Object.values(await contest.get_users({ role: 'team', division: 'gold' }))
  teams = teams.filter((user) => !user.disabled)

  const submissions = await contest.get_submissions({ division: 'gold' })
  //not requiring pagination for standings at the moment
  let problemsList = await contest.get_problems({ division: 'gold' }, [
    'pid',
    'division',
    'id',
    'name',
    'practice',
    'max_points',
    'capped_points'
  ])
  console.log('problemsLift before', problemsList)
  problemsList = problemsList.filter(({ practice }) => {
    if (isPractice) return practice
    return practice == undefined || practice == false
  })

  console.log('problemsLift after', problemsList)

  const problems = transpose(problemsList, 'pid')

  const subs: Record<string, Record<string, Submission[]>> = {}

  Object.values(submissions).forEach((submission) => {
    const { tid, pid } = submission
    if (!Object.keys(problems).includes(pid)) return
    if (!(tid in subs)) subs[tid] = {}
    if (!(pid in subs[tid])) subs[tid][pid] = []

    if (!submission.released) {
      submission.status = 'pending'
    }

    subs[tid][pid].push(submission)
  })

  const standings = teams
    .map((team) => {
      const team_problems: Record<string, { score: number; status: string }> = {}
      let score = 0
      let capped_score = 0

      Object.values(problems)
        .sort((p1, p2) => p1.id.localeCompare(p2.id))
        .forEach((problem) => {
          if (team.uid in subs) {
            if (problem.pid in subs[team.uid]) {
              let problem_score = 0
              subs[team.uid][problem.pid].forEach((sub) => {
                if (sub.score > problem_score) problem_score = sub.score
              })
              team_problems[problem.pid] = {
                score: problem_score,
                status: problem_score > 0 ? 'accepted' : 'rejected'
              }
              if (problem.capped_points) {
                capped_score += problem_score
              } else {
                score += problem_score
              }
            }
          }
        })
      score += Math.min(20, capped_score)

      return {
        uid: team.uid,
        username: team.username,
        display_name: team.display_name,
        score,
        problems: team_problems
      }
    })
    .sort((s1, s2) => {
      return s2.score - s1.score
    })

    const division = 'gold'
    const time_updated = Date.now()

    const standing = {
      division,
      problems,
      standings,
      time_updated
    }

    await contest.update_standing('gold', standing)

  return {
    problems: Object.values(problems),
    standings
  }
}

// Function that returns the gold standings
const getGoldStandings = async (isPractice: boolean): Promise<Standings<GoldTeam>> => {
  const standing = await contest.get_standing('gold')

  if (await isTimeToUpdateStandings(standing.time_updated) === false) {
    return {
      problems: Object.values(standing.problems),
      standings: standing.standings
    }
  }
  else {
    const standing = calculateGoldStandings(isPractice)

    return {
      problems: Object.values((await standing).problems),
      standings: (await standing).standings
    }
  }
}

// Function that returns either blue or gold standings
export const getStandings = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).send({ message: errors[0].msg })
    return
  }

  const settings = await contest.get_settings()
  const now = Date.now() / 1000
  if (now < settings.practice_start_date || (now > settings.practice_end_date && now < settings.start_date)) {
    res.sendStatus(204)
    return
  }

  const isPractice = now < settings.practice_end_date

  const { division } = matchedData(req)

  if (division == 'blue') {
    res.send(await getBlueStandings(isPractice))
    return
  } else if (division == 'gold') {
    res.send(await getGoldStandings(isPractice))
    return
  }

  res.status(400).send({ message: `${division} is not allowed!` })
}

import { Problem, Submission } from 'abacus'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'
import contest from '../../abacus/contest'

export const schema: Record<string, ParamSchema> = {
  division: {
    in: ['body', 'query'],
    isString: true,
    errorMessage: 'Division is not supplied!'
  }
}

interface BlueStandingsUser {
  display_name: string;
  uid: string;
  username: string;
  solved: number;
  time: number;
  problems: Record<string, {
    num_submissions: number;
    problem_score: number;
    solved: boolean;
    submissions: Submission[];
  }>
};

const getBlueStandings = async (): Promise<BlueStandingsUser[]> => {
  const standings = (await contest.scanItems('user', { args: { role: 'team', division: 'blue' } }) || {}) as Record<string, BlueStandingsUser>
  const submissions = await contest.scanItems('submission', { args: { division: 'blue' } }) || {}
  const problems = await contest.scanItems('problem', { args: { division: 'blue' } }) || {} as unknown as Problem[]

  const subs: Record<string, Record<string, Submission[]>> = {}

  Object.values(submissions).forEach((submission: any) => {
    const { tid, pid } = submission;
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

  Object.values(standings).forEach((team: any) => {

    delete team.password
    delete team.role
    delete team.division
    delete team.username

    team.problems = {}
    team.time = 0
    team.solved = 0

    Object.values(problems).sort((p1, p2) => p1.id.localeCompare(p2.id)).forEach((problem: Problem) => {
      team.problems[problem.id] = {
        solved: false,
        problem_score: 0,
        num_submissions: 0,
        submissions: []
      }
      if (team.uid in subs) {
        if (problem.pid in subs[team.uid]) {
          team.problems[problem.id].num_submissions = subs[team.uid][problem.pid].length
          team.problems[problem.id].submissions = subs[team.uid][problem.pid]
          subs[team.uid][problem.pid].every((sub: any) => {
            if (sub.status === "accepted") {
              team.problems[problem.id].problem_score = sub.score
              team.problems[problem.id].solved = true
              team.solved++
              team.time += sub.score
              return false
            }
            return true
          })
        }
      }
    })
  })

  return Object.values(standings).sort((s1: any, s2: any) =>
    s1.solved === s2.solved ? s1.time - s2.time : s2.solved - s1.solved)
}

interface GoldStandingsUser {
  display_name: string;
  uid: string;
  username: string;
  score: number;
  problems: Record<string, Submission>;
}

const getGoldStandings = async (): Promise<GoldStandingsUser[]> => {
  const standings = (await contest.scanItems('user', { args: { role: 'team', division: 'gold' } }) || {}) as Record<string, GoldStandingsUser>
  const submissions = await contest.scanItems('submission', { args: { division: 'gold' } }) || {}
  const problems = await contest.scanItems('problem', { args: { division: 'gold' } }) || {} as unknown as Problem[]

  const subs: { [key: string]: { [key: string]: Submission } } = {}

  Object.values(submissions).forEach((submission: any) => {
    const { tid, pid } = submission;
    if (!(tid in subs)) subs[tid] = {}

    if (!submission.released) {
      submission.status = 'pending'
    }

    subs[tid][pid] = submission
  })

  Object.values(standings).forEach((team: any) => {
    delete team.password
    delete team.role
    delete team.division
    delete team.username

    team.problems = {}
    team.score = 0

    Object.values(problems).sort((p1, p2) => p1.id.localeCompare(p2.id)).forEach((problem: Problem) => {
      team.problems[problem.id] = {}
      if (team.uid in subs) {
        if (problem.pid in subs[team.uid]) {
          team.problems[problem.id] = subs[team.uid][problem.pid]
          team.score += subs[team.uid][problem.pid].score
        }
      }
    })
  })

  return Object.values(standings).sort((s1: any, s2: any) =>
    s2.score - s1.score)
}

export const getStandings = async (req: Request, res: Response) => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).send({ message: errors[0].msg })
    return
  }

  const { division } = matchedData(req)

  if (division == 'blue') {
    res.send(await getBlueStandings())
    return
  } else if (division == 'gold') {
    res.send(await getGoldStandings())
    return
  }

  res.status(400).send({ message: `${division} is not allowed!` })
}
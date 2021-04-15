import { Submission } from 'abacus'
import { Request, Response } from 'express'
import contest, { transpose } from '../../abacus/contest'

export const getStandings = async (_req: Request, res: Response) => {

  const settings = await contest.get_settings()
  const now = Date.now() / 1000
  if (now < settings.practice_start_date || (now > settings.practice_end_date && now < settings.start_date)) {
    res.sendStatus(204)
    return
  }
  const isPractice = now < settings.practice_end_date

  let standings = Object.values(await contest.scanItems('user', { args: { role: 'team', division: 'blue' } }) || {})
  const submissions = await contest.scanItems('submission', { args: { division: 'blue' } }) || {}

  let problemsList = await contest.scanItems('problem', { args: { division: 'blue' }, columns: ['pid', 'division', 'id', 'name', 'practice'] }) || []
  problemsList = problemsList.filter(({ practice }) => {
    if (isPractice)
      return practice
    return practice == undefined || practice == false
  })

  console.log(problemsList)

  const problems = transpose(problemsList, 'pid')

  const subs: { [key: string]: { [key: string]: Submission[] } } = {}

  Object.values(submissions).forEach((submission: any) => {
    const { tid, pid } = submission;
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

  standings = standings.filter((user: any) => !user.disabled)

  standings.forEach((team: any) => {

    delete team.password
    delete team.role
    delete team.division
    delete team.username

    team.problems = {}
    team.time = 0
    team.solved = 0

    Object.values(problems)
      .sort((p1, p2) => p1.id.localeCompare(p2.id))
      .forEach(problem => {
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

  type StandingsItems = { solved: number, time: number }

  const data = (standings as StandingsItems[]).sort((s1, s2) => {
    if (s1.solved == s2.solved) return s1.time - s2.time
    return s2.solved - s1.solved
  })

  res.send({
    problems,
    standings: data
  })
}
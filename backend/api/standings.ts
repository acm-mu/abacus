import { Response, Router } from "express";
import { Problem, Submission } from "../types";

import { contest } from "../contest";

const standings = Router();

standings.get("/standings", async (_, res: Response) => {
  const standings = Object.values(await contest.scanItems('user', { role: 'team', division: 'blue' }) || {})
  const submissions = Object.values(await contest.scanItems('submission', { division: 'blue' }) || {}) as Submission[]
  const problems = Object.values(await contest.scanItems('problem', { division: 'blue' }) || {}) as Problem[]

  const subs: { [key: string]: { [key: string]: Submission[] } } = {}

  submissions.forEach((submission: Submission) => {
    const { team_id, problem_id } = submission;
    if (!(team_id in subs)) subs[team_id] = {}
    if (!(problem_id in subs[team_id])) subs[team_id][problem_id] = []

    subs[team_id][problem_id].push(submission)
  })

  standings.forEach((team: any) => {
    delete team['session_token']
    delete team['password']
    team.problems = {}
    team.time = 0
    team.solved = 0
    problems.sort((p1, p2) => p1.id.localeCompare(p2.id)).forEach((problem: Problem) => {
      team.problems[problem.id] = {
        solved: false,
        problem_score: 0,
        num_submissions: 0,
        submissions: []
      }
      if (team.user_id in subs) {
        if (problem.pid in subs[team.user_id]) {
          team.problems[problem.id].num_submissions = subs[team.user_id][problem.pid].length
          team.problems[problem.id].submissions = subs[team.user_id][problem.pid]
          subs[team.user_id][problem.pid].every((sub: any) => {
            if (sub.score > 0) {
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
  res.send(standings)
});

export default standings;

import { Router, Response } from "express";
import { ProblemType, SubmissionType } from "types";
import { contest } from "../contest";

const standings = Router();

standings.get("/standings", async (_, res: Response) => {
  const standings = Object.values(await contest.scanItems('user', { role: 'team', division: 'blue' }) || {})
  const submissions = Object.values(await contest.scanItems('submission', { division: 'blue' }) || {}) as SubmissionType[]
  const problems = Object.values(await contest.scanItems('problem', { division: 'blue' }) || {}) as ProblemType[]

  const subs: { [key: string]: { [key: string]: SubmissionType[] } } = {}

  submissions.forEach((submission: SubmissionType) => {
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
    problems.forEach((problem: ProblemType) => {
      team.problems[problem.problem_id] = {
        solved: false,
        problem_score: 0,
        num_submissions: 0,
        submissions: []
      }
      if (team.user_id in subs) {
        if (problem.problem_id in subs[team.user_id]) {
          team.problems[problem.problem_id].num_submissions = subs[team.user_id][problem.problem_id].length
          team.problems[problem.problem_id].submissions = subs[team.user_id][problem.problem_id]
          subs[team.user_id][problem.problem_id].every((sub: any) => {
            if (sub.score > 0) {
              team.problems[problem.problem_id].problem_score = sub.score
              team.problems[problem.problem_id].solved = true
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

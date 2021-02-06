import { Router, Response } from "express";
import { ProblemType, SubmissionType } from "types";
import contest from "../contest";

const standings = Router();

standings.get("/", async (_, res: Response) => {
  const standings = Object.values(await contest.get_users({ role: 'team', division: 'blue' }))
  const submissions: SubmissionType[] = Object.values(await contest.get_submissions({ division: 'blue' }))
  const problems = Object.values(await contest.get_problems({ division: 'blue' }))

  const subs: { [key: string]: { [key: string]: SubmissionType[] } } = {}

  submissions.forEach((submission: SubmissionType) => {
    const { team_id, problem_id } = submission;
    if (!(team_id in subs)) subs[team_id] = {}
    if (!(problem_id in subs[team_id])) subs[team_id][problem_id] = []

    subs[team_id][problem_id].push(submission)
  })

  standings.forEach((team: any) => {
    delete team['session_id']
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

type TestType = {
  in: string;
  out: string;
  result: string;
}

type SubmissionType = {
  date: number;
  filename: string;
  filesize: number;
  language: string;
  prob_name: string;
  problem_id: string;
  runtime: number;
  score: number;
  md5: string;
  status: string;
  sub_no: number;
  submission_id: string;
  team_id: string;
  team_name: string;
  tests: TestType[];
}

type ProblemScoreType = {
  num_submissions: number;
  problem_score: number;
  solved: boolean;
  submissions: SubmissionType[];
}

type ProblemType = {
  problem_id: string;
  id: string;
  problem_name: string;
  description: string;
  cpu_time_limit: number;
  memory_limit: number;
  tests: TestType[];
}

type UserType = {
  user_id: string;
  role: string;
  username: string;
  display_name: string;
  division: string;
  scratch_username?: string;
  session_token: string;
}

type StandingsUser = {
  user_id: string;
  role: string;
  username: string;
  display_name: string;
  division: string;
  scratch_username?: string;
  solved: number;
  time: number;
  problems: [ProblemScoreType];
}

export type { StandingsUser, TestType, SubmissionType, ProblemType, UserType, ProblemScoreType }
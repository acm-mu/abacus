type TestType = {
  in: string;
  out: string;
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
  sha1sum: string;
  status: string;
  sub_no: number;
  submission_id: string;
  team_id: string;
  tests: TestType[];
}

type ProblemScoreType = {
  num_submissions: number;
  problem_score: number;
  solved: boolean;
  submissions: SubmissionType[];
}

type ProblemType = {
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
  user_name: string;
  display_name: string;
  division: string;
  scratch_username?: string
}

export type { TestType, SubmissionType, ProblemType, UserType, ProblemScoreType }
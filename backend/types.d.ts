export type Problem = {
  pid: string;
  id: string;
  name: string;
  cpu_time_limit: number;
  memory_limit: number;
}

export interface User {
  uid: string;
  role: string;
  user_name: string;
  password: string;
  display_name: string;
  division?: string;
  school?: string;
  scratch_username?: string;
}

export type Submission = {
  sid: string;
  date: number;
  file_name: string;
  file_size: number;
  language: string;
  md5: string;
  problem_id: string;
  run_time: number;
  score: number;
  status: string;
  sub_no: number;
  team_id: string;
  tests: Test[];
}

export type Test = {
  in: string;
  out: string;
  status: string;
  stdout?: string;
}

export type Skeleton = {
  pid: string;
  language: string;
  source: string;
}

export type CompetitionSettings = {
  competition_name: string;
  points_per_yes: number;
  points_per_no: number;
  points_per_compilation_error: number;
  points_per_minute: number;
  start_date: number;
  end_date: number
}

export type Args = { [key: string]: any }
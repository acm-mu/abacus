declare module "abacus" {
  export interface Settings {
    competition_name: string;
    points_per_yes: number;
    points_per_no: number;
    points_per_compilation_error: number;
    points_per_minute: number;
    start_date: number;
    end_date: number
  }

  export interface Test {
    in: string;
    out: string;
    result: string;
  }

  export interface Skeleton {
    language: string;
    source: string;
  }

  export interface Submission {
    date: number;
    filename: string;
    filesize: number;
    language: string;
    md5: string;
    problem_id: string;
    runtime: number;
    score: number;
    status: string;
    sub_no: number;
    submission_id: string;
    team_id: string;
    tests: Test[];
  }

  export interface ProblemScore {
    num_submissions: number;
    problem_score: number;
    solved: boolean;
    submissions: Submission[];
  }

  export interface Problem {
    problem_id: string;
    id: string;
    problem_name: string;
    description: string;
    cpu_time_limit: number;
    memory_limit: number;
    tests: Test[];
    skeletons: Skeleton[];
  }

  export interface User {
    uid: string;
    role: string;
    username: string;
    password: string;
    display_name: string;
    division: string;
    school?: string;
    scratch_username?: string;
    session_token: string;
  }

  export interface StandingsUser {
    user_id: string;
    role: string;
    username: string;
    display_name: string;
    division: string;
    school?: string;
    scratch_username?: string;
    solved: number;
    time: number;
    problems: [ProblemScore];
  }

  export interface Args { [key: string]: any }
}
declare module "abacus" {
  export interface Settings extends Record<string, string | number> {
    competition_name: string;
    practice_name: string;
    points_per_yes: number;
    points_per_no: number;
    points_per_compilation_error: number;
    points_per_minute: number;
    start_date: number;
    end_date: number;
    practice_start_date: number;
    practice_end_date: number;
  }
  export interface Submission extends Record<string, unknown> {
    sid: string;
    date: number;
    filename: string;
    filesize: number;
    source: string;
    project_id?: string;
    language: string;
    md5: string;
    pid: string;
    runtime: number;
    released: boolean;
    score: number;
    status: string;
    sub_no: number;
    tid: string;
    tests: Test[];
    claimed?: string;
    viewed?: boolean;
    flagged?: string;
  }
  export interface Problem extends Record<string, unknown> {
    pid: string;
    practice?: boolean;
    id: string;
    division: string;
    name: string;
    description: string;
    cpu_time_limit: number;
    memory_limit: number;
    skeletons?: Skeleton[];
    tests: Test[];
  }
  export interface User extends Record<string, unknown> {
    uid: string;
    role: string;
    username: string;
    password: string;
    display_name: string;
    division?: string;
    school?: string;
    disabled?: boolean;
  }
  export interface Test extends Record<string, unknown> {
    in: string;
    out: string;
    result: string;
  }
  export interface Skeleton extends Record<string, unknown> {
    language: string;
    source: string;
    file_name: string;
  }
  export interface ProblemScore extends Record<string, unknown> {
    num_submissions: number;
    problem_score: number;
    solved: boolean;
    submissions: Submission[];
  }
  export interface StandingsUser extends Record<string, unknown> {
    display_name: string;
    uid: string;
    username: string;
    solved: number;
    time: number;
    problems: { [key: string]: ProblemScore };
  }

  export interface Context extends Record<string, unknown> {
    type: 'pid' | 'cid' | 'sid';
    id: string;
  }

  export interface Clarification extends Record<string, unknown> {
    cid: string;
    body: string;
    uid: string;
    date: number;
    open?: boolean;
    parent?: string;
    division?: string;
    type?: string;
    title?: string;
    context?: Context;
    children?: Clarification[]
  }

  export interface Notification extends Record<string, unknown> {
    header?: string;
    to?: string;
    content: string;
    id?: string;
    context?: Context;
    type?: 'success' | 'warning' | 'error';
  }
}
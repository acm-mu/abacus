declare module 'abacus' {
  export interface Settings extends Record<string, string | number> {
    competition_name: string
    practice_name: string
    points_per_yes: number
    points_per_no: number
    points_per_compilation_error: number
    points_per_minute: number
    start_date: number
    end_date: number
    practice_start_date: number
    practice_end_date: number
  }

  interface RawSubmission extends Record<string, unknown> {
    sid: string
    date: number
    filename: string
    filesize: number
    source: string
    project_id?: string
    // TODO: LANGUAGE
    language: string
    md5: string
    pid: string
    runtime: number
    released: boolean
    score: number
    status: string
    sub_no: number
    tid: string
    tests: Test[]
    claimed?: string | User
    viewed?: boolean
    flagged?: string | User
  }

  export interface Submission extends RawSubmission {
    claimed?: string
    flagged?: string
  }

  export interface ResolvedSubmission extends RawSubmission {
    team: User
    problem: Problem
    claimed?: User
    flagged?: User
  }

  export interface Problem extends Record<string, unknown> {
    pid: string
    practice?: boolean
    id: string
    division: string
    name: string
    description: string
    cpu_time_limit: number
    memory_limit: number
    skeletons?: Skeleton[]
    tests: Test[]
  }
  export interface User extends Record<string, unknown> {
    uid: string
    role: string
    username: string
    password: string
    display_name: string
    division?: string
    school?: string
    disabled?: boolean
  }
  export interface Test extends Record<string, unknown> {
    in: string
    out: string
    result: string
  }
  export interface Skeleton extends Record<string, unknown> {
    // TODO: LANGUAGE
    language: string
    source: string
    file_name: string
  }
  export interface ProblemScore extends Record<string, unknown> {
    num_submissions: number
    problem_score: number
    solved: boolean
    submissions: Submission[]
  }
  export interface StandingsUser extends Record<string, unknown> {
    display_name: string
    uid: string
    username: string
    solved: number
    time: number
    problems: { [key: string]: ProblemScore }
  }

  export interface Context extends Record<string, unknown> {
    type: 'pid' | 'cid' | 'sid'
    id: string
  }

  export interface Clarification extends Record<string, unknown> {
    cid: string
    body: string
    uid: string
    date: number
    open?: boolean
    parent?: string
    division?: string
    type?: string
    title?: string
    context?: Context
    children?: Clarification[]
  }

  export interface Notification extends Record<string, unknown> {
    header?: string
    to?: string
    content: string
    id?: string
    context?: Context
    type?: 'success' | 'warning' | 'error'
  }

  export type Item = Record<string, unknown>
  export type Args = Record<string, unknown>
}

declare module 'abacus' {
  export interface SubmissionType extends Record<string, unknown> {
    sid: string
    date: number
    filename: string
    filesize: number
    source: string
    project_id?: string
    language: string
    md5: string
    pid: string
    runtime: number
    released: boolean
    score: number
    status: string
    sub_no: number
    tid: string
    tests: TestType[]
    claimed?: string | UserType
    viewed?: boolean
    flagged?: string | UserType
  }
}
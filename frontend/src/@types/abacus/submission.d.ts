declare module 'abacus' {
  export interface ISubmission<T extends IProblem = IProblem> {
    sid: string
    sub_no: number
    date: number
    division: string
    language: string
    released: boolean  
    claimed?: IUser
    tid: string
    team?: IUser
    pid: string
    problem: T
    status: string
    score: number
    feedback?: string
    flagged?: IUser
    viewed?: boolean
  }

  export interface IBlueSubmission extends ISubmission<IBlueProblem> {
    runtime: number
    md5: string
    filename: string
    filesize: number
    source: string
    tests: ITest[]
  }

  export interface IGoldSubmission extends ISubmission<IGoldProblem> {
    project_id: number
    design_document: string
  }

  export interface ISubmissionReq {
    sid: string
    sub_no: number
    date: number
    division: string
    language: string
    released: boolean
    claimed?: string
    tid: string
    team?: string
    pid: string
    problem: T
    status: string
    score: number
    feedback?: string
    flagged?: string
    viewed?: boolean
  }
}
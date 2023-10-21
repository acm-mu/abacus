declare module 'abacus' {
  export interface ISubmission {
    sid: string
    sub_no: number
    date: number
    division: string
    language: string
    released: boolean
    claimed?: IUser
    tid:string
    team?: ITeam
    pid: string
    problem: IProblem
    status: string
    score: number
    feedback?: string
    flagged?: IUser
    viewed?: boolean
  }
  
  export interface IBlueSubmission extends ISubmission {
    runtime: number
    md5: string
    filename: string
    filesize: number
    source: string
    tests: ITest[]
  }
  
  export interface IGoldSubmission extends ISubmission {
    project_id: number
    design_document: string
  }
}
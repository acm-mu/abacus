declare module 'abacus' {
  export interface IProblem {
    pid: string
    practice?: boolean
    id: string
    division: string
    name: string
    description: string
  }

  export interface IBlueProblem extends IProblem {
    cpu_time_limit: number
    memory_limit: number
    tests?: ITest[]
    skeletons?: ISkeleton[]
    solutions?: ISolution[]
  }

  export interface IGoldProblem extends IProblem {
    project_id: string
    design_document: boolean
    max_points: number
    capped_points: boolean
  }

  export interface ISkeleton {
    language: string
    source: string
    file_name: string
  }
  
  export interface ISolution {
    language: string
    source: string
    file_name: string
  }

  export interface ITest {
    in: string
    out: string
    include?: boolean
  }

  export interface ITestResult extends ITest {
    stdout: string
    result: string
  }
}
declare module 'abacus' {
  export interface ProblemType extends Record<string, unknown> {
    pid: string
    id?: any
    division: string
    name: string
    description?: string
    cpu_time_limit?: number
    memory_limit?: number
    skeletons?: SkeletonType[]
    tests?: TestType[]
  }
}
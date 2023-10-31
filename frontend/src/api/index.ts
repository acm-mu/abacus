import { AxiosResponse } from 'axios'

export function transform<T>(response: AxiosResponse): Promise<ApiResponse<T>> {
  return transformAndApply<T>(resp => resp)(response)
}


type TransformFunction<T> = (response: AxiosResponse) => Promise<ApiResponse<T>>;
type ApplyFunction<T> = (data: any) => Promise<T>;

export function transformAndApply<T>(secondFunc?: ApplyFunction<T>): TransformFunction<T> {
  return async (response: AxiosResponse): Promise<ApiResponse<T>> => {
    return {
      data: secondFunc ? await secondFunc(response.data) : secondFunc,
      ok: response.status === 200,
      errors: response.data.errors
    }
  }
}

export class ApiResponse<T> {
  data?: T
  ok?: boolean
  errors: any
}

export { default as HttpClient } from './base'
export { AuthService, ContestService, ScratchService, StandingsService } from './services'
export { ClarificationRepository, ProblemRepository, SubmissionRepository, UserRepository } from './repository'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import environment from 'environment'

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

export abstract class HttpClient {
  protected instance: AxiosInstance | undefined

  protected createInstance(): AxiosInstance {
    this.instance = axios.create({
      baseURL: `${environment.API_URL}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
    this.initializeResponseInterceptor()
    return this.instance
  }

  private initializeResponseInterceptor = () => {
    this.instance?.interceptors.response.use(this.handleResponse, this.handleError)
    const token = localStorage.getItem("jwtToken")
    this.instance?.interceptors.request.use((config) => {
      config.headers.setAuthorization(`Bearer ${token}`)
      return config
    })
  }

  private handleResponse = ({ data }: AxiosResponse) => data

  private handleError = (error: any) => Promise.reject(error)
}

export { AuthService, ContestService, ScratchService, StandingsService } from './services'
export { ClarificationRepository, ProblemRepository, SubmissionRepository, UserRepository } from './repository'
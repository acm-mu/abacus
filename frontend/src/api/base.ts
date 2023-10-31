import axios, { AxiosInstance } from "axios"
import environment from "environment"


export default abstract class HttpClient {
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
    this.instance?.interceptors.response.use(undefined, this.handleError)
    const token = localStorage.getItem("jwtToken")
    this.instance?.interceptors.request.use((config) => {
      config.headers.setAuthorization(`Bearer ${token}`)
      return config
    })
  }

  private handleError = (error: any) => Promise.reject(error)
}
import type { IStandingsUser } from "abacus"
import { ApiResponse, HttpClient, transform } from 'api'

export default class StandingsService extends HttpClient {

  async getStandings(division: string): Promise<ApiResponse<IStandingsUser[]>> {
    const instance = this.createInstance()
    const result = await instance.get(`standings?division=${division}`).then(transform)
    return result as ApiResponse<IStandingsUser[]>
  }
}
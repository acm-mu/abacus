import {ApiResponse, HttpClient, transform} from 'api'
import {StandingsUser} from "abacus";

export default class StandingsService extends HttpClient {

  async getStandings(division: string): Promise<ApiResponse<StandingsUser[]>> {
    const instance = this.createInstance()
    const result = await instance.get(`standings?division=${division}`).then(transform)
    return result as ApiResponse<StandingsUser[]>
  }
}
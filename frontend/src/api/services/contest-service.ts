import type { Settings } from 'abacus'
import { ApiResponse, HttpClient, transformAndApply } from 'api'

export default class ContestService extends HttpClient {

  async getSettings(): Promise<ApiResponse<Settings>> {
    const instance = this.createInstance()

    const applyFunc = async (data: any): Promise<Settings> => ({
      ...data,
      start_date: toDate(data.start_date),
      end_date: toDate(data.end_date),
      practice_start_date: toDate(data.practice_start_date),
      practice_end_date: toDate(data.practice_end_date)
    })

    return await instance.get('contest').then(transformAndApply(applyFunc))
  }
}

const toDate = (dateString: string) => new Date(parseInt(dateString) * 1000)
import type { ISettings } from 'abacus'
import { ApiResponse, HttpClient, transform, transformAndApply } from 'api'

export default class ContestService extends HttpClient {

  async getSettings(): Promise<ApiResponse<ISettings>> {
    const instance = this.createInstance()
    const toDate = (dateString: string) => new Date(parseInt(dateString) * 1000)

    const applyFunc = async (data: any): Promise<ISettings> => ({
      ...data,
      start_date: toDate(data.start_date),
      end_date: toDate(data.end_date),
      practice_start_date: toDate(data.practice_start_date),
      practice_end_date: toDate(data.practice_end_date)
    })

    return await instance.get('contest').then(transformAndApply(applyFunc))
  }

  async updateSettings(settings: ISettings): Promise<ApiResponse<any>> {
    const instance = this.createInstance()

    return await instance.put('content', settings).then(transform)
  }
}
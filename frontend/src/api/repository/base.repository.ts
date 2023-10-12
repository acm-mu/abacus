import {ApiResponse, HttpClient, transform} from 'api'
import {NullablePartial} from "abacus"

export interface ApiOptions {
  filterBy?: { [key: string]: any },
  sortBy?: string
}

export interface IBaseRepository<T> {
  get(id: string): Promise<ApiResponse<T>>;

  getMany(options?: ApiOptions): Promise<ApiResponse<T[]>>;

  create(item: T): Promise<ApiResponse<T>>;

  update(id: string, item: T): Promise<ApiResponse<T>>;

  delete(id: string): Promise<ApiResponse<T>>;
}

export abstract class BaseRepository<T> extends HttpClient implements IBaseRepository<T> {
  protected collection: string | undefined

  public async get(id: string): Promise<ApiResponse<T>> {
    if(this.collection == undefined){
      throw new Error()
    }
    const instance = this.createInstance()
    const result = await instance.get(`${this.collection}/${id}`).then(transform)
    return result as ApiResponse<T>
  }

  public async getMany(options?: ApiOptions): Promise<ApiResponse<T[]>> {
    if (this.collection == undefined) {
      throw new Error()
    }
    const instance = this.createInstance()
    const result = await instance.get(this.collection).then(transform)
    return result as ApiResponse<T[]>
  }

  public async create(item: NullablePartial<T>): Promise<ApiResponse<T>> {
    const instance = this.createInstance()
    const result = await instance.post(`${this.collection}/`, item).then(transform)
    return result as ApiResponse<T>
  }

  public async update(id: string, item: Partial<T>): Promise<ApiResponse<T>> {
    const instance = this.createInstance()
    const result = await instance.put(`${this.collection}/${id}}`, item).then(transform)
    return result as ApiResponse<T>
  }

  public async delete(id: string | string[]): Promise<ApiResponse<T>> {
    const instance = this.createInstance()
    const result = await instance.delete(`${this.collection}/${id}`).then(transform)
    return result as ApiResponse<T>
  }
}
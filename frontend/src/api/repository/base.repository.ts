import type { NullablePartial } from "abacus"
import { ApiResponse, HttpClient, transform } from 'api'

export interface ApiOptions<T> {
  filterBy?: { [key: string]: any },
  skip?: number
  limit?: number
  sortBy?: keyof T,
  sortDirection?: 'ascending' | 'descending'
}

export interface PagedResult<T> {
  items: { [key: string]: T }
  totalItems: number
  totalPages: number
}

export interface IBaseRepository<TRequest, TResponse> {
  get(id: string): Promise<ApiResponse<TResponse>>;

  getMany(options?: ApiOptions<TResponse>): Promise<ApiResponse<PagedResult<TResponse>>>;

  create(item: TRequest): Promise<ApiResponse<TResponse>>;

  update(id: string, item: TRequest): Promise<ApiResponse<TResponse>>;

  delete(id: string): Promise<ApiResponse<TResponse>>;
}

export abstract class BaseRepository<TRequest, TResponse> extends HttpClient implements IBaseRepository<TRequest, TResponse> {
  protected collection: string | undefined

  public async get(id: string): Promise<ApiResponse<TResponse>> {
    if (this.collection == undefined) {
      throw new Error()
    }
    const instance = this.createInstance()
    const result = await instance.get(`${this.collection}/${id}`).then(transform)
    return result as ApiResponse<TResponse>
  }

  public async getMany(options?: ApiOptions<TResponse>): Promise<ApiResponse<PagedResult<TResponse>>> {
    if (this.collection == undefined) {
      throw new Error()
    }
    const instance = this.createInstance()
    const result = await instance.get(this.collection, {
      params: {
        skip: options?.skip,
        limit: options?.limit,
        sortBy: options?.sortBy,
        sortDirection: options?.sortDirection
      }
    }).then(transform)
    return result as ApiResponse<PagedResult<TResponse>>
  }

  public async create(item: NullablePartial<TRequest>): Promise<ApiResponse<TResponse>> {
    const instance = this.createInstance()
    const result = await instance.post(`${this.collection}/`, item).then(transform)
    return result as ApiResponse<TResponse>
  }

  public async update(id: string, item: Partial<TRequest>): Promise<ApiResponse<TResponse>> {
    const instance = this.createInstance()
    const result = await instance.put(`${this.collection}/${id}}`, item).then(transform)
    return result as ApiResponse<TResponse>
  }

  public async delete(id: string | string[]): Promise<ApiResponse<TResponse>> {
    const instance = this.createInstance()
    const result = await instance.delete(`${this.collection}/${id}`).then(transform)
    return result as ApiResponse<TResponse>
  }
}
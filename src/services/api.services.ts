import apiClient from './index'
import axios from 'axios'
import { AxiosError } from 'axios'

interface Identifiable {
  id: number
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface LoginData {
  email: string
  password: string
}

interface ErrorResponse {
  message: string
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  nextPage?: number
}

class ApiService {
  private apiClient
  private paginationState: Record<string, { currentPage: number; nextPage: number | null }> = {}

  constructor() {
    this.apiClient = apiClient
  }

  private handleError(error: unknown): void {
    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>
      if (
        axiosError.response?.status !== 500 &&
        axiosError.response?.status !== 401 &&
        axiosError.response?.data?.message
      ) {
      }
    }
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined
  }

  private isErrorWithMessage(error: unknown): error is ErrorResponse {
    return (error as ErrorResponse).message !== undefined
  }

  async getAll<T>(resource: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const response = await this.apiClient.get(`/${resource}`, { params })
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getAllPaginated<T>(resource: string, params?: Record<string, any>): Promise<T[]> {
    const filters = { ...(params || {}) }
    delete filters.page
    delete filters.take

    const cacheKey = `${resource}:${JSON.stringify(filters)}`

    if (!this.paginationState[cacheKey]) {
      this.paginationState[cacheKey] = { currentPage: 1, nextPage: null }
    }

    const currentState = this.paginationState[cacheKey]
    const currentPage = params?.page || currentState.currentPage
    console.log(cacheKey)

    try {
      const response = await this.apiClient.get(`/${resource}`, {
        params: { ...params, page: currentPage },
      })
      const paginatedResponse = response.data as PaginatedResponse<T>

      // Atualizar o estado da paginação
      this.paginationState[cacheKey] = {
        currentPage: paginatedResponse.page,
        nextPage: paginatedResponse.nextPage || null,
      }
      console.log('page cache', this.paginationState[cacheKey])

      return paginatedResponse.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getNextPage<T>(resource: string, params?: Record<string, any>): Promise<T[]> {
    const filters = { ...(params || {}) }
    delete filters.page
    delete filters.take

    const cacheKey = `${resource}:${JSON.stringify(filters)}`
    const currentState = this.paginationState[cacheKey]

    console.log('cacheKey', cacheKey)
    console.log('currentState', currentState)

    if (!currentState || currentState.nextPage === null) {
      return []
    }

    return await this.getAllPaginated<T>(resource, { ...params, page: currentState.nextPage })
  }

  async getOne<T>(resource: string, id: string): Promise<T> {
    try {
      const response = await this.apiClient.get(`/${resource}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async getBlob(resource: string, params?: Record<string, any>): Promise<Blob> {
    try {
      const response = await this.apiClient.get<Blob>(`/${resource}`, {
        params,
        responseType: 'blob', // Indica que esperamos um blob como resposta
      })
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
  async execute<K extends Record<string, any>, T>(resource: string, params?: K): Promise<T> {
    const path = resource.includes('http') ? resource : `/${resource}`

    try {
      const response = await this.apiClient.post<T>(path, params)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async create<T>(resource: string, item: Omit<T, 'id'>): Promise<T> {
    try {
      const response = await this.apiClient.post(`/${resource}`, item)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async update<T extends Identifiable>(resource: string, item: Partial<T>): Promise<T> {
    try {
      const response = await this.apiClient.put(`/${resource}/${item.id}`, item)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async patch<T extends Identifiable>(resource: string, item: Omit<T, 'id'>): Promise<T> {
    try {
      const response = await this.apiClient.patch(`/${resource}`, item)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async remove(resource: string, id: any): Promise<void> {
    try {
      await this.apiClient.delete(`/${resource}/${id}`)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async removeItem(resource: string, item: any): Promise<void> {
    try {
      await this.apiClient.delete(`/${resource}`, { data: item })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async login(data: LoginData): Promise<void> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/v1/user/login', data)
      const { accessToken, refreshToken } = response.data
      localStorage.setItem('authToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async refreshToken(): Promise<void> {
    const refreshTokenSaved = localStorage.getItem('refreshToken')

    if (!refreshTokenSaved) {
      throw new Error('No refresh token found')
    }

    try {
      const response = await axios.post<LoginResponse>(
        'https://ms-crm-az.kemosoft.com.br/v1/user/refresh',
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshTokenSaved}`,
          },
        },
      )
      const { accessToken, refreshToken } = response.data
      localStorage.setItem('authToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } catch (error) {
      // Não emite erro para o cliente
      // this.handleError(error);
      // throw error;
    }
  }

  newEventSource(resource: string): EventSource {
    return new EventSource(`${apiClient.defaults.baseURL}/${resource}`)
  }
}

export default ApiService

/*
Como utilizar o controle de paginação da classe ApiService:
--------------------------------------------------------------

# Carregamento inicial:

const apiService = new ApiService();
let results = await apiService.getAllPaginated('seu-recurso', { limit: 10 });


# Carregamento da próxima página:

const nextPageResults = await apiService.getNextPage('seu-recurso', { limit: 10 });


# Implementação de carregamento infinito:

async function loadMore() {
  const nextPageResults = await apiService.getNextPage('seu-recurso', { limit: 10 });
  if (nextPageResults) {
    results.data = [...nextPageResults.data];
    // Atualizar outras informações de paginação se necessário
  } else {
    console.log('Não há mais páginas para carregar');
  }
}

*/

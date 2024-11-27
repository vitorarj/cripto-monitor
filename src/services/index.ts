import axios from 'axios'
import { type Router } from 'vue-router'

const baseURL = 'https://api.coingecko.com/api/v3'

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

export const setupInterceptors = (router: Router | { path: string }[]) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Excluir rota de login do bloqueio
      if (originalRequest.url === '/v1/user/login') {
        return Promise.reject(error)
      }

      if (originalRequest.url === '/v1/elevate') {
        return Promise.reject(error)
      }

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token
              return apiClient(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')

        if (refreshToken) {
          try {
            const response = await axios.post(`${baseURL}/v1/user/refresh`, {
              refreshToken: refreshToken,
            })

            const newAccessToken = response.data.authToken
            const newRefreshToken = response.data.refreshToken
            localStorage.setItem('authToken', newAccessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
            processQueue(null, newAccessToken)

            return apiClient(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)

            localStorage.removeItem('authToken')
            localStorage.removeItem('refreshToken')

            if ('push' in router) {
              router.push({ path: '/login' })
            }

            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        } else {
          if ('push' in router) {
            router.push({ path: '/login' })
          }
        }
      }

      return Promise.reject(error)
    },
  )
}

export default apiClient

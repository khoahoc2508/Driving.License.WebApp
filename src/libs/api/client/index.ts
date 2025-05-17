import createClient, { type Middleware } from 'openapi-fetch'

import Cookies from 'js-cookie'

import type { paths } from './schema'
import CONFIG from '@/configs/config'
import { logout, refreshTokenApi } from '../loginAPI'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const authMiddleware: Middleware = {
  async onRequest({ request }: any) {
    const accessToken = Cookies.get(CONFIG.ConfigToken.storageTokenKeyName)

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return request
  },

  async onResponse({ response, request }) {
    if (response.status === 401) {
      // Thử refresh token
      const refreshToken = Cookies.get(CONFIG.ConfigToken.storageRefreshTokenKeyName)

      if (refreshToken) {
        try {
          const data = await refreshTokenApi(refreshToken)

          Cookies.set(CONFIG.ConfigToken.storageTokenKeyName, data.access_token)
          Cookies.set(CONFIG.ConfigToken.storageRefreshTokenKeyName, data.refresh_token)
          // Gửi lại request cũ với accessToken mới
          request.headers.set('Authorization', `Bearer ${data.access_token}`)

          return fetch(request)
        } catch (e) {
          logout()
        }
      } else {
        logout()
      }
    }

    return response
  }
}

const client = createClient<paths>({ baseUrl: API_BASE_URL })

client.use(authMiddleware)

export default client

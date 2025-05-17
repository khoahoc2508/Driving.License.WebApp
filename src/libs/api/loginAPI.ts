import CONFIG from '@/configs/config'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET
const CLIENT_SCOPE = process.env.NEXT_PUBLIC_CLIENT_SCOPE

// Hàm gọi API login
export async function loginApi(email: string, password: string) {
  const params = new URLSearchParams()

  params.append('grant_type', 'password')
  params.append('username', email)
  params.append('password', password)
  params.append('client_id', CLIENT_ID as string)
  params.append('client_secret', CLIENT_SECRET as string)
  params.append('scope', CLIENT_SCOPE as string)

  const res = await fetch(`${API_BASE_URL}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!res.ok) {
    throw new Error('Sai tài khoản hoặc mật khẩu')
  }

  return res.json()
}

// Hàm gọi API refresh token
export async function refreshTokenApi(refreshToken: string) {
  const params = new URLSearchParams()

  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  params.append('client_id', CLIENT_ID as string)
  params.append('client_secret', CLIENT_SECRET as string)

  const res = await fetch(`${API_BASE_URL}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!res.ok) {
    throw new Error('Refresh token thất bại')
  }

  return res.json()
}

// Hàm gọi API lấy user hiện tại
export async function getUserApi(token: string) {
  const res = await fetch(`${API_BASE_URL}/connect/user`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    throw new Error('Không lấy được thông tin user')
  }

  return res.json()
}

// Hàm logout
export function logout() {
  Cookies.remove(CONFIG.ConfigToken.storageTokenKeyName)
  Cookies.remove(CONFIG.ConfigToken.storageRefreshTokenKeyName)
}

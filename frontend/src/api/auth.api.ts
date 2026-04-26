import { apiClient } from './axios'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface RegisterPayload {
  email: string
  name: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((r) => r.data),
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '@/lib/types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string; user?: UserProfile }>
    ) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      if (action.payload.user) {
        state.user = action.payload.user
      }
      state.isAuthenticated = true
      state.isLoading = false
    },
    
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, setUser, logout, setLoading } = authSlice.actions
export default authSlice.reducer
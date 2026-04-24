import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/lib/types/auth'
import type { UserResponse } from '@/lib/types/user'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
  }),
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data, // Now includes confirmPassword
      }),
    }),
    
    getMe: builder.query<UserResponse, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi

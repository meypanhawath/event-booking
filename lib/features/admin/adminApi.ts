import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PageUserResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UserResponse,
} from "@/lib/types/admin";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),
  tagTypes: ["Users", "PendingOrganizers", "Categories"],
  endpoints: (builder) => ({
    // All users
    getAllUsers: builder.query<PageUserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 }) => ({
        url: "/users",
        params: { pageNumber: page, pageSize: size },
      }),
      providesTags: ["Users"],
    }),

    // Pending organizers
    getPendingOrganizers: builder.query<PageUserResponse, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: "/users/pending-organizers",
        params: { pageNumber: page, pageSize: size },
      }),
      providesTags: ["PendingOrganizers"],
    }),

    // Update organizer status
    updateOrganizerStatus: builder.mutation<UserResponse, { uuid: string; status: string; remark?: string }>({
      query: ({ uuid, status, remark }) => ({
        url: `/users/${uuid}/organizer-status`,
        method: "PATCH",
        params: { status, ...(remark && { remark }) },
      }),
      invalidatesTags: ["PendingOrganizers", "Users"],
    }),

    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/users/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "PendingOrganizers"],
    }),

    // Categories
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetPendingOrganizersQuery,
  useUpdateOrganizerStatusMutation,
  useDeleteUserMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApi;

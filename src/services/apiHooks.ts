import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AxiosResponse, AxiosError } from 'axios';
import axiosInstancetandt from './axiosInstance';

// Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Generic GET hook
export function useApiQuery<TData = any>(
  queryKey: (string | number)[],
  url: string,
  options?: Omit<UseQueryOptions<AxiosResponse<TData>, AxiosError, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstancetandt.get<TData>(url);
      return response;
    },
    select: (data: AxiosResponse<TData>) => data.data,
    ...options,
  });
}

// Generic POST mutation hook
export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>,
  options?: UseMutationOptions<AxiosResponse<TData>, AxiosError, TVariables>
) {
  return useMutation({
    mutationFn,
    onError: (error: AxiosError) => {
      console.error('Mutation error:', error);
    },
    ...options,
  });
}

// POST request hook
export function useApiPost<TData = any, TVariables = any>(
  url: string,
  options?: UseMutationOptions<AxiosResponse<TData>, AxiosError, TVariables>
) {
  return useApiMutation(
    async (variables: TVariables) => {
      return await axiosInstancetandt.post<TData>(url, variables);
    },
    options
  );
}

// PUT request hook
export function useApiPut<TData = any, TVariables = any>(
  url: string,
  options?: UseMutationOptions<AxiosResponse<TData>, AxiosError, TVariables>
) {
  return useApiMutation(
    async (variables: TVariables) => {
      return await axiosInstancetandt.put<TData>(url, variables);
    },
    options
  );
}

// PATCH request hook
export function useApiPatch<TData = any, TVariables = any>(
  url: string,
  options?: UseMutationOptions<AxiosResponse<TData>, AxiosError, TVariables>
) {
  return useApiMutation(
    async (variables: TVariables) => {
      return await axiosInstancetandt.patch<TData>(url, variables);
    },
    options
  );
}

// DELETE request hook
export function useApiDelete<TData = any>(
  url: string,
  options?: UseMutationOptions<AxiosResponse<TData>, AxiosError, void>
) {
  return useApiMutation(
    async () => {
      return await axiosInstancetandt.delete<TData>(url);
    },
    options
  );
}

// Example: Fetch paginated data
export function usePaginatedQuery<TData = any>(
  baseKey: string,
  url: string,
  page: number = 1,
  limit: number = 10,
  options?: Omit<UseQueryOptions<AxiosResponse<TData>, AxiosError, TData>, 'queryKey' | 'queryFn'>
) {
  return useApiQuery(
    [baseKey, 'paginated', page, limit],
    `${url}?page=${page}&limit=${limit}`,
    options
  );
}

// Hook to invalidate queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateByKey: (queryKey: (string | number)[]) => 
      queryClient.invalidateQueries({ queryKey }),
    refetchByKey: (queryKey: (string | number)[]) => 
      queryClient.refetchQueries({ queryKey }),
  };
}

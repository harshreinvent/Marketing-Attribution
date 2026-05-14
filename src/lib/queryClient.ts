import { QueryClient } from '@tanstack/react-query'

// Single QueryClient instance for the whole app
// staleTime: data stays fresh for 5 minutes before refetching
// gcTime: keep unused cache for 10 minutes
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

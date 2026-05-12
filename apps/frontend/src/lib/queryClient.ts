import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error: unknown) => {
        if ((error as { status?: number })?.status === 401) {
          supabase.auth.refreshSession();
          return failureCount < 1;
        }
        return failureCount < 3;
      },
    },
  },
});

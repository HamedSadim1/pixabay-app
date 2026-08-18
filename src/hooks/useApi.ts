import { useState, useCallback } from "react";
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, A extends unknown[]> extends UseApiState<T> {
  execute: (...args: A) => Promise<void>;
  reset: () => void;
}

export function useApi<T, A extends unknown[] = unknown[]>(
  apiCall: (...args: A) => Promise<T>,
  initialData: T | null = null,
): UseApiReturn<T, A> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: A) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await apiCall(...args);
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      }
    },
    [apiCall],
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

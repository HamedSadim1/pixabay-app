import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

interface ApiError {
  message: string;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
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
    [apiCall]
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

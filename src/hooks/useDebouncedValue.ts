import { useEffect, useState } from "react";

/**
 * Returns a value that lags behind its input by `delayMs`. Useful for keeping
 * fast-changing inputs (like filter fields) out of a query key until the user
 * pauses, so React Query doesn't refetch on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

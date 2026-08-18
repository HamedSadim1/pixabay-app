import { useCallback, useEffect, useRef, useState } from "react";
import { sharePage } from "../utils/share";

// Shared feedback state for share actions: flips `shared` to true for a short
// time after a successful share/copy so callers can show a "Copied" state.
export function useShareFeedback(delayMs = 1500) {
  const [shared, setShared] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Clear any pending reset when the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const share = useCallback(
    async (title?: string, url?: string) => {
      if (await sharePage(title, url)) {
        setShared(true);
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => setShared(false), delayMs);
      }
    },
    [delayMs],
  );

  return { shared, share };
}

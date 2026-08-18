import { useCallback, useState } from "react";

// Generic boolean toggle for like/bookmark/friend style buttons.
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle] as const;
}

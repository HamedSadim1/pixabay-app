// Share helper: prefers the native Web Share API (mobile), falling back to
// copying the current URL to the clipboard. Returns true when sharing/copying
// succeeded so callers can show brief feedback.
export async function sharePage(
  title?: string,
  url = window.location.href,
): Promise<boolean> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, url });
      return true;
    } catch (err) {
      // User cancelled the share sheet — don't fall back to copying.
      if (err instanceof DOMException && err.name === "AbortError") {
        return false;
      }
      // Otherwise fall through to the clipboard fallback.
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

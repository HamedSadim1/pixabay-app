// Shared error formatting helpers.

import axios from "axios";

interface ApiError {
  message: string;
}

/**
 * Turns any thrown value into a user-facing error message. Maps axios timeout
 * and server errors to friendly text so callers don't render raw stack traces.
 */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiError>(err)) {
    if (err.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return (
      err.response?.data?.message ||
      err.message ||
      "An error occurred while fetching images"
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}

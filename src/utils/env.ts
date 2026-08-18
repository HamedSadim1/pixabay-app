/**
 * Utility for validating required environment variables.
 */

export function getRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not defined`);
  }
  return value;
}

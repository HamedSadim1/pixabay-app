/**
 * Utility functions for environment variable validation
 */

export function getRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not defined`);
  }
  return value;
}

export function getOptionalEnvVar(
  key: string,
  defaultValue: string = "",
): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): void {
  const requiredVars = ["VITE_PIXABAY_API_KEY", "VITE_PIXABAY_BASE_URL"];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

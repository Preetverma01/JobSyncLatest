import dotenv from "dotenv";

dotenv.config();

const FALLBACKS = {
  JWT_SECRET: "jobsync-secret",
};

/**
 * Reads a required environment variable and exits with a clear message
 * if it is missing. In development a known fallback is allowed so local
 * runs keep working without a full .env; in production the app refuses
 * to boot rather than silently using a guessable secret.
 */
function required(key) {
  const value = process.env[key];

  if (value && value.trim()) {
    return value.trim();
  }

  if (process.env.NODE_ENV === "production") {
    console.error(
      `FATAL: Missing required environment variable ${key}. ` +
      "Set it in your deployment environment and restart."
    );
    process.exit(1);
  }

  const fallback = FALLBACKS[key];
  if (fallback !== undefined) {
    console.warn(
      `WARNING: ${key} is not set. Using an insecure development fallback. ` +
      "Do not use this in production."
    );
    return fallback;
  }

  console.error(`FATAL: Missing required environment variable ${key}.`);
  process.exit(1);
}

export const JWT_SECRET = required("JWT_SECRET");

export default { JWT_SECRET };

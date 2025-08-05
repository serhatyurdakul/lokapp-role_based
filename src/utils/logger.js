/* eslint-disable no-console */
// Environment-aware logger
// – Development: prints debug, warn, error to console.
// – Production: suppresses console output; hook 'error' to external tracking if needed.

const isDev = import.meta.env.DEV;

const logger = {
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
    // TODO: Production error tracking (e.g., Sentry) can be added here
  },
};

export default logger;

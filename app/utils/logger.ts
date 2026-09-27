/**
 * Central logger for the app.
 *
 * - debug/info/warn are no-ops in production builds (`__DEV__` gated) so user
 *   IDs, tokens, and API URLs never reach production logs.
 * - error always fires and is mirrored to Sentry as a breadcrumb in
 *   production builds, so crash reports carry the trail of preceding errors.
 *
 * Use this instead of console.* everywhere under app/. A Babel plugin
 * additionally strips any stray console.* (except console.error) from
 * production bundles as a backstop.
 */

import * as Sentry from "@sentry/react-native";

type LogArgs = unknown[];

const noop = (..._args: LogArgs): void => {};

export const logger = {
  debug: __DEV__ ? console.debug.bind(console) : noop,
  log: __DEV__ ? console.log.bind(console) : noop,
  info: __DEV__ ? console.info.bind(console) : noop,
  warn: __DEV__ ? console.warn.bind(console) : noop,
  error: (...args: LogArgs): void => {
    console.error(...args);
    if (!__DEV__) {
      Sentry.addBreadcrumb({
        category: "error",
        message: args
          .map((a) => (a instanceof Error ? a.message : String(a)))
          .join(" ")
          .slice(0, 500),
        level: "error",
      });
    }
  },
};

export default logger;

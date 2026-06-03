import { config, LogLevel } from '../config.js';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
};

/**
 * Whether a log line at `level` should be emitted for the configured minimum `LOG_LEVEL`.
 */
export function isLogLevelEnabled(
  level: LogLevel,
  minimumLevel: LogLevel = config.LOG_LEVEL as LogLevel
): boolean {
  const levelPriority = LEVEL_PRIORITY[level];
  const minimumPriority = LEVEL_PRIORITY[minimumLevel] ?? LEVEL_PRIORITY[LogLevel.INFO];

  return levelPriority >= minimumPriority;
}

const SENSITIVE_HEADER_NAMES = new Set([
  'x-api-key',
  'authorization',
  'x-metabase-session',
  'cookie',
  'set-cookie',
]);

/** Returns a shallow copy of headers with credential values replaced for safe logging. */
export function maskHttpHeadersForLog(headers: Record<string, string>): Record<string, string> {
  const maskedHeaders: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    maskedHeaders[name] = SENSITIVE_HEADER_NAMES.has(name.toLowerCase()) ? '***' : value;
  }
  return maskedHeaders;
}

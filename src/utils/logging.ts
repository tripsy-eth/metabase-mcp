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
export function isLogLevelEnabled(level: LogLevel): boolean {
  const threshold =
    LEVEL_PRIORITY[config.LOG_LEVEL as LogLevel] ?? LEVEL_PRIORITY[LogLevel.INFO];
  return LEVEL_PRIORITY[level] >= threshold;
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
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    out[name] = SENSITIVE_HEADER_NAMES.has(name.toLowerCase()) ? '***' : value;
  }
  return out;
}

import { describe, expect, it } from 'vitest';
import { LogLevel } from '../../src/config.js';
import { isLogLevelEnabled, maskHttpHeadersForLog } from '../../src/utils/logging.js';

describe('logging utilities', () => {
  it('masks API key and session headers case-insensitively by header name', () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-KEY': 'secret-key',
      'X-Metabase-Session': 'session-token',
      Authorization: 'Bearer token',
      'Proxy-Authorization': 'Bearer iap-token',
      Cookie: 'sid=secret',
    };

    const maskedHeaders = maskHttpHeadersForLog(headers);

    expect(maskedHeaders).toEqual({
      'Content-Type': 'application/json',
      'X-API-KEY': '***',
      'X-Metabase-Session': '***',
      Authorization: '***',
      'Proxy-Authorization': '***',
      Cookie: '***',
    });
    expect(headers['X-API-KEY']).toBe('secret-key');
  });

  it('honors minimum log level thresholds', () => {
    expect(isLogLevelEnabled(LogLevel.DEBUG, LogLevel.DEBUG)).toBe(true);
    expect(isLogLevelEnabled(LogLevel.INFO, LogLevel.DEBUG)).toBe(true);
    expect(isLogLevelEnabled(LogLevel.DEBUG, LogLevel.ERROR)).toBe(false);
    expect(isLogLevelEnabled(LogLevel.ERROR, LogLevel.ERROR)).toBe(true);
    expect(isLogLevelEnabled(LogLevel.FATAL, LogLevel.ERROR)).toBe(true);
    expect(isLogLevelEnabled(LogLevel.ERROR, LogLevel.FATAL)).toBe(false);
  });
});

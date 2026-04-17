import { describe, expect, it } from 'vitest';
import { maskHttpHeadersForLog } from '../../src/utils/logging.js';

describe('maskHttpHeadersForLog', () => {
  it('masks API key and session headers case-insensitively by header name', () => {
    const masked = maskHttpHeadersForLog({
      'Content-Type': 'application/json',
      'X-API-KEY': 'secret-key',
      'X-Metabase-Session': 'session-token',
      Authorization: 'Bearer token',
    });

    expect(masked['Content-Type']).toBe('application/json');
    expect(masked['X-API-KEY']).toBe('***');
    expect(masked['X-Metabase-Session']).toBe('***');
    expect(masked.Authorization).toBe('***');
  });
});

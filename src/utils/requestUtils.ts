/**
 * Request handling utilities for the Metabase MCP server.
 */

import { AuthMethod } from '../config.js';

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

interface MetabaseHeaderOptions {
  baseHeaders?: Record<string, string>;
  authMethod: AuthMethod;
  apiKey?: string | null;
  sessionToken?: string | null;
  proxyAuthorization?: string | null;
}

export function buildMetabaseHeaders(options: MetabaseHeaderOptions): Record<string, string> {
  const headers = { ...(options.baseHeaders ?? {}) };

  if (options.proxyAuthorization) {
    headers['Proxy-Authorization'] = options.proxyAuthorization;
  }

  if (options.authMethod === AuthMethod.API_KEY && options.apiKey) {
    headers['X-API-KEY'] = options.apiKey;
  } else if (options.authMethod === AuthMethod.SESSION && options.sessionToken) {
    headers['X-Metabase-Session'] = options.sessionToken;
  }

  return headers;
}

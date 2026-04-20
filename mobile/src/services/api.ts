import { COGNITO_ENDPOINT, CONFIG } from '../config/appConfig';

function logDebug(label: string, details?: Record<string, unknown>) {
  if (details) {
    console.log(`[StrengthPilot] ${label}`, details);
    return;
  }
  console.log(`[StrengthPilot] ${label}`);
}

export async function apiRequest<T>(
  path: string,
  idToken: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object,
): Promise<T> {
  const url = `${CONFIG.apiBaseUrl}${path}`;
  logDebug('API request', {
    method,
    path,
    url,
    hasBody: Boolean(body),
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    logDebug('API network failure', {
      method,
      path,
      url,
      message,
    });
    throw new Error(`Network request failed for ${method} ${path}`);
  }

  const payload = await response.json().catch(() => ({}));
  logDebug('API response', {
    method,
    path,
    url,
    ok: response.ok,
    status: response.status,
  });

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload as T;
}

export async function cognitoRequest(target: string, payload: object) {
  logDebug('Cognito request', {
    target,
  });

  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': target,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  logDebug('Cognito response', {
    target,
    ok: response.ok,
    status: response.status,
    challengeName: data.ChallengeName,
    message: data.message || data.Message || null,
  });

  if (!response.ok) {
    throw new Error(data.message || data.Message || 'Authentication failed.');
  }

  return data;
}

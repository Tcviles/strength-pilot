import { COGNITO_ENDPOINT, CONFIG } from '../config/appConfig';

function logDebug(label: string, details?: Record<string, unknown>) {
  if (details) {
    console.log(`[StrengthPilot] ${label}`, details);
    return;
  }
  console.log(`[StrengthPilot] ${label}`);
}

function sanitizeBody(body?: object) {
  if (!body) {
    return null;
  }

  const cloned = JSON.parse(JSON.stringify(body)) as Record<string, unknown>;

  if ('PASSWORD' in cloned) {
    cloned.PASSWORD = '[REDACTED]';
  }
  if ('NEW_PASSWORD' in cloned) {
    cloned.NEW_PASSWORD = '[REDACTED]';
  }
  if ('Password' in cloned) {
    cloned.Password = '[REDACTED]';
  }
  if ('ConfirmationCode' in cloned) {
    cloned.ConfirmationCode = '[REDACTED_CODE]';
  }

  return cloned;
}

function summarizeError(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack || null,
    };
  }

  return {
    name: 'UnknownError',
    message: String(err),
    stack: null,
  };
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
    body: sanitizeBody(body),
    hasToken: Boolean(idToken),
    tokenPreview: idToken ? `${idToken.slice(0, 12)}...` : null,
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
    const errorSummary = summarizeError(err);
    logDebug('API network failure', {
      method,
      path,
      url,
      body: sanitizeBody(body),
      hasToken: Boolean(idToken),
      tokenPreview: idToken ? `${idToken.slice(0, 12)}...` : null,
      error: errorSummary,
    });
    throw new Error(`Network request failed for ${method} ${path}: ${errorSummary.message}`);
  }

  const payload = await response.json().catch(() => ({}));
  logDebug('API response', {
    method,
    path,
    url,
    ok: response.ok,
    status: response.status,
    payload,
  });

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload as T;
}

export async function cognitoRequest(target: string, payload: object) {
  logDebug('Cognito request', {
    target,
    payload: sanitizeBody(payload),
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

import { COGNITO_ENDPOINT, CONFIG } from '../config/appConfig';

export async function apiRequest<T>(
  path: string,
  idToken: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object,
): Promise<T> {
  const response = await fetch(`${CONFIG.apiBaseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload as T;
}

export async function cognitoRequest(target: string, payload: object) {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': target,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.Message || 'Authentication failed.');
  }

  return data;
}

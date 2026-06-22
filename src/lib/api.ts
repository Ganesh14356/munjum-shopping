const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API request failed: ${response.status}`);
  }

  return response.json();
}

export function getAppSettings() {
  return apiFetch('/settings');
}

export function updateAppSettings(settings: Record<string, unknown>) {
  return apiFetch('/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings)
  });
}

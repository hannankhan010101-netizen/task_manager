const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Parses a fetch Response, throwing a normalized Error with a readable
 * message when the response is not ok. Returns parsed JSON otherwise
 * (or undefined for empty bodies).
 */
async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body && typeof body.message === 'string') {
        message = body.message;
      } else if (body && typeof body.error === 'string') {
        message = body.error;
      }
    } catch {
      // Response body was not JSON; fall back to the status message.
    }
    throw new Error(message);
  }

  const contentLength = response.headers.get('content-length');
  if (response.status === 204 || contentLength === '0') {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }
  return handleResponse(response);
}

export function getTasks() {
  return request('/tasks');
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

export function getWeather(city) {
  return request(`/weather?city=${encodeURIComponent(city)}`);
}

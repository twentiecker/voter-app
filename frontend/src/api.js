const configuredUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredUrl ? configuredUrl.replace(/\/$/, '') : '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json();
}

export function getPolls() {
  return request('/polls');
}

export function createPoll(payload) {
  return request('/polls', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function castVote(pollId, candidateId) {
  return request(`/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ candidate_id: candidateId }),
  });
}

export function login(payload) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

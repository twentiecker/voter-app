const configuredUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredUrl ? configuredUrl.replace(/\/$/, "") : "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
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
  return request("/polls");
}

export function createPoll(payload, user) {
  return request("/polls", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: user
      ? {
          Authorization: `Bearer ${user.id}`,
          "Content-Type": "application/json",
        }
      : {},
  });
}

export function castVote(pollId, candidateId, user) {
  return request(`/polls/${pollId}/vote`, {
    method: "POST",
    body: JSON.stringify({ candidate_id: candidateId }),
    headers: user
      ? {
          Authorization: `Bearer ${user.id}`,
          "Content-Type": "application/json",
        }
      : {},
  });
}

export function login(payload) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

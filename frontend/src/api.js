import axios from "axios";

const configuredUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredUrl ? configuredUrl.replace(/\/$/, "") : "/api";

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const cachedUser = JSON.parse(localStorage.getItem("voter_user") || "null");
  if (cachedUser?.id) {
    config.headers.Authorization = `Bearer ${cachedUser.id}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

export function getPolls() {
  return client.get("/polls").then((res) => res.data);
}

export function createPoll(payload, user) {
  return client
    .post("/polls", payload, {
      headers: {
        Authorization: `Bearer ${user?.id}`,
      },
    })
    .then((res) => res.data);
}

export function castVote(pollId, candidateId, user) {
  return client
    .post(`/polls/${pollId}/vote`, { candidate_id: candidateId }, {
      headers: {
        Authorization: `Bearer ${user?.id}`,
      },
    })
    .then((res) => res.data);
}

export function login(payload) {
  return client.post("/login", payload).then((res) => res.data);
}

export function register(payload) {
  return client.post("/register", payload).then((res) => res.data);
}

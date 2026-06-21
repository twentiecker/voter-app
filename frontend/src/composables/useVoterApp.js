import { computed, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import { castVote, createPoll, getPolls, login, register } from "../api.js";

const state = reactive({
  loading: true,
  voting: false,
  creating: false,
  polls: [],
  poll: null,
  selectedPollId: "",
  selectedCandidateId: "",
  lastVotedCandidateId: "",
  error: "",
  createError: "",
  user: null,
  loggingIn: false,
  registering: false,
  loginForm: { username: "", password: "" },
  registerForm: { username: "", password: "", name: "" },
  showLoginDialog: false,
  authMode: "login",
  createForm: {
    title: "",
    description: "",
    candidates: [
      { name: "", party: "", slogan: "" },
      { name: "", party: "", slogan: "" },
    ],
  },
});

export { state };

export function useVoterApp() {
  const toast = useToast();

  const totalVotes = computed(() => totalForPoll(state.poll));
  const totalPolls = computed(() => state.polls.length);
  const canCreatePoll = computed(() => {
    const title = state.createForm.title.trim();
    const description = state.createForm.description.trim();
    const completeCandidates = state.createForm.candidates.filter(
      (candidate) => {
        return (
          candidate.name.trim() &&
          candidate.party.trim() &&
          candidate.slogan.trim()
        );
      },
    );
    return title && description && completeCandidates.length >= 2;
  });
  const leadingCandidateId = computed(
    () => leadingCandidateForPoll(state.poll)?.id ?? "",
  );

  function totalForPoll(nextPoll) {
    return (
      nextPoll?.candidates.reduce(
        (sum, candidate) => sum + candidate.votes,
        0,
      ) ?? 0
    );
  }

  function leadingCandidateForPoll(nextPoll) {
    if (!nextPoll?.candidates.length) {
      return null;
    }
    return [...nextPoll.candidates].sort((a, b) => b.votes - a.votes)[0];
  }

  function votePercent(votes) {
    if (totalVotes.value === 0) {
      return 0;
    }
    return Math.round((votes / totalVotes.value) * 100);
  }

  async function loadPolls() {
    state.loading = true;
    state.error = "";
    try {
      const loadedPolls = await getPolls();
      state.polls = loadedPolls;
      const preferredPollId = state.selectedPollId || loadedPolls[0]?.id;
      const nextPoll =
        loadedPolls.find((item) => item.id === preferredPollId) ??
        loadedPolls[0] ??
        null;
      state.poll = nextPoll;
      state.selectedPollId = nextPoll?.id ?? "";
      state.selectedCandidateId = nextPoll?.candidates[0]?.id ?? "";
    } catch (err) {
      state.error =
        "Unable to load votes. Make sure the API server is running.";
    } finally {
      state.loading = false;
    }
  }

  async function submitVote() {
    if (!state.poll || !state.selectedCandidateId) {
      return;
    }
    if (!state.user) {
      toast.add({
        severity: "warn",
        summary: "Sign in required",
        detail: "You must sign in before casting a vote.",
        life: 2600,
      });
      state.showLoginDialog = true;
      return;
    }
    state.voting = true;
    state.error = "";
    try {
      const updatedPoll = await castVote(
        state.poll.id,
        state.selectedCandidateId,
        state.user,
      );
      state.poll = updatedPoll;
      state.polls = state.polls.map((item) =>
        item.id === updatedPoll.id ? updatedPoll : item,
      );
      state.lastVotedCandidateId = state.selectedCandidateId;
      toast.add({
        severity: "success",
        summary: "Vote counted",
        detail: "The poll results have been updated.",
        life: 2400,
      });
    } catch (err) {
      if (err.message?.includes("Already voted")) {
        state.error = "You have already voted in this poll.";
      } else {
        state.error = "Your vote could not be submitted. Please try again.";
      }
    } finally {
      state.voting = false;
    }
  }

  async function submitCreatePoll() {
    if (!state.user) {
      toast.add({
        severity: "warn",
        summary: "Sign in required",
        detail: "You must sign in before creating a poll.",
        life: 2600,
      });
      state.showLoginDialog = true;
      return;
    }
    if (!canCreatePoll.value) {
      state.createError =
        "Add a title, description, and at least two complete choices.";
      return;
    }
    state.creating = true;
    state.createError = "";
    const payload = {
      title: state.createForm.title.trim(),
      description: state.createForm.description.trim(),
      candidates: state.createForm.candidates
        .filter(
          (candidate) =>
            candidate.name.trim() &&
            candidate.party.trim() &&
            candidate.slogan.trim(),
        )
        .map((candidate) => ({
          name: candidate.name.trim(),
          party: candidate.party.trim(),
          slogan: candidate.slogan.trim(),
        })),
    };
    try {
      const createdPoll = await createPoll(payload, state.user);
      state.polls = [createdPoll, ...state.polls];
      state.poll = createdPoll;
      state.selectedPollId = createdPoll.id;
      state.selectedCandidateId = createdPoll.candidates[0]?.id ?? "";
      resetCreateForm();
      toast.add({
        severity: "success",
        summary: "Vote created",
        detail: "Your new vote is now available in Events.",
        life: 2600,
      });
    } catch (err) {
      if (err.message?.includes("Not authenticated") || err.message?.includes("User not found")) {
        toast.add({
          severity: "warn",
          summary: "Session expired",
          detail: "Please sign in again.",
          life: 2600,
        });
        state.user = null;
      } else {
        state.createError =
          "The vote could not be created. Check the backend server and try again.";
      }
    } finally {
      state.creating = false;
    }
  }

  function resetCreateForm() {
    state.createForm = {
      title: "",
      description: "",
      candidates: [
        { name: "", party: "", slogan: "" },
        { name: "", party: "", slogan: "" },
      ],
    };
    state.createError = "";
  }

  function addCandidate() {
    state.createForm.candidates.push({ name: "", party: "", slogan: "" });
  }

  function removeCandidate(index) {
    if (state.createForm.candidates.length <= 2) {
      return;
    }
    state.createForm.candidates.splice(index, 1);
  }

  function selectPoll(nextPollId) {
    const nextPoll = state.polls.find((item) => item.id === nextPollId);
    if (!nextPoll) {
      return;
    }
    state.poll = nextPoll;
    state.selectedPollId = nextPoll.id;
    state.selectedCandidateId = nextPoll.candidates[0]?.id ?? "";
    state.lastVotedCandidateId = "";
    state.error = "";
  }

  async function handleLogin() {
    if (!state.loginForm.username.trim() || !state.loginForm.password.trim()) {
      toast.add({
        severity: "warn",
        summary: "Missing fields",
        detail: "Enter both username and password.",
        life: 2600,
      });
      return;
    }
    state.loggingIn = true;
    try {
      const userData = await login({
        username: state.loginForm.username.trim(),
        password: state.loginForm.password.trim(),
      });
      state.user = userData;
      state.loginForm = { username: "", password: "" };
      state.showLoginDialog = false;
      state.authMode = "login";
      toast.add({
        severity: "success",
        summary: "Welcome back",
        detail: `Signed in as ${userData.name}.`,
        life: 2600,
      });
    } catch (err) {
      toast.add({
        severity: "error",
        summary: "Login failed",
        detail: "Invalid username or password.",
        life: 2600,
      });
    } finally {
      state.loggingIn = false;
    }
  }

  async function handleRegister() {
    if (
      !state.registerForm.username.trim() ||
      !state.registerForm.password.trim() ||
      !state.registerForm.name.trim()
    ) {
      toast.add({
        severity: "warn",
        summary: "Missing fields",
        detail: "Enter name, username, and password.",
        life: 2600,
      });
      return;
    }
    state.registering = true;
    try {
      const userData = await register({
        username: state.registerForm.username.trim(),
        password: state.registerForm.password.trim(),
        name: state.registerForm.name.trim(),
      });
      state.user = userData;
      state.registerForm = { username: "", password: "", name: "" };
      state.showLoginDialog = false;
      state.authMode = "login";
      toast.add({
        severity: "success",
        summary: "Account created",
        detail: `Welcome, ${userData.name}.`,
        life: 2600,
      });
    } catch (err) {
      toast.add({
        severity: "error",
        summary: "Registration failed",
        detail: "Could not create account. Try a different username.",
        life: 2600,
      });
    } finally {
      state.registering = false;
    }
  }

  function handleLogout() {
    state.user = null;
    state.selectedPollId = "";
    state.poll = null;
    toast.add({
      severity: "info",
      summary: "Signed out",
      detail: "You have been logged out.",
      life: 2200,
    });
  }

  return {
    state,
    canCreatePoll,
    actions: {
      loadPolls,
      submitVote,
      submitCreatePoll,
      resetCreateForm,
      addCandidate,
      removeCandidate,
      selectPoll,
      handleLogin,
      handleRegister,
      handleLogout,
      votePercent,
      totalForPoll,
    },
  };
}
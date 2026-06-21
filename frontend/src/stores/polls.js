import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getPolls, createPoll, castVote } from "../api.js";

export const usePollStore = defineStore("polls", () => {
  const loading = ref(true);
  const voting = ref(false);
  const creating = ref(false);
  const polls = ref([]);
  const poll = ref(null);
  const selectedPollId = ref("");
  const selectedCandidateId = ref("");
  const lastVotedCandidateId = ref("");
  const error = ref("");
  const createError = ref("");
  const createForm = ref({
    title: "",
    description: "",
    candidates: [
      { name: "", party: "", slogan: "" },
      { name: "", party: "", slogan: "" },
    ],
  });

  const totalVotes = computed(() => totalForPoll(poll.value));
  const totalPolls = computed(() => polls.value.length);
  const canCreatePoll = computed(() => validatePollForm());
  const leadingCandidateId = computed(
    () => leadingCandidateForPoll(poll.value)?.id ?? "",
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

  function validatePollForm() {
    const title = createForm.value.title.trim();
    const description = createForm.value.description.trim();
    const completeCandidates = createForm.value.candidates.filter(
      (candidate) => {
        return (
          candidate.name.trim() &&
          candidate.party.trim() &&
          candidate.slogan.trim()
        );
      },
    );
    return title && description && completeCandidates.length >= 2;
  }

  async function loadPolls() {
    loading.value = true;
    error.value = "";
    try {
      const loadedPolls = await getPolls();
      polls.value = loadedPolls;
      const preferredPollId =
        selectedPollId.value || loadedPolls[0]?.id;
      const nextPoll =
        loadedPolls.find((item) => item.id === preferredPollId) ??
        loadedPolls[0] ??
        null;
      poll.value = nextPoll;
      selectedPollId.value = nextPoll?.id ?? "";
      selectedCandidateId.value = nextPoll?.candidates[0]?.id ?? "";
    } catch (err) {
      error.value =
        "Unable to load votes. Make sure the API server is running.";
    } finally {
      loading.value = false;
    }
  }

  async function submitVote(user) {
    if (!poll.value || !selectedCandidateId.value) {
      return {};
    }
    if (!user) {
      return { requiresAuth: true };
    }
    voting.value = true;
    error.value = "";
    try {
      const updatedPoll = await castVote(
        poll.value.id,
        selectedCandidateId.value,
        user,
      );
      poll.value = updatedPoll;
      polls.value = polls.value.map((item) =>
        item.id === updatedPoll.id ? updatedPoll : item,
      );
      lastVotedCandidateId.value = selectedCandidateId.value;
      return { success: true };
    } catch (err) {
      if (err.message?.includes("Already voted")) {
        error.value = "You have already voted in this poll.";
      } else {
        error.value = "Your vote could not be submitted. Please try again.";
      }
      return { success: false, error: error.value };
    } finally {
      voting.value = false;
    }
  }

  async function submitCreatePoll(user) {
    if (!user) {
      return { requiresAuth: true };
    }
    if (!canCreatePoll.value) {
      createError.value =
        "Add a title, description, and at least two complete choices.";
      return { invalidForm: true };
    }
    creating.value = true;
    createError.value = "";
    const payload = buildPollPayload();
    try {
      const createdPoll = await createPoll(payload, user);
      polls.value = [createdPoll, ...polls.value];
      poll.value = createdPoll;
      selectedPollId.value = createdPoll.id;
      selectedCandidateId.value = createdPoll.candidates[0]?.id ?? "";
      resetCreateForm();
      return { success: true, poll: createdPoll };
    } catch (err) {
      if (
        err.message?.includes("Not authenticated") ||
        err.message?.includes("User not found")
      ) {
        return { sessionExpired: true };
      } else {
        createError.value =
          "The vote could not be created. Check the backend server and try again.";
        return { success: false, error: createError.value };
      }
    } finally {
      creating.value = false;
    }
  }

  function buildPollPayload() {
    return {
      title: createForm.value.title.trim(),
      description: createForm.value.description.trim(),
      candidates: createForm.value.candidates
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
  }

  function resetCreateForm() {
    createForm.value = {
      title: "",
      description: "",
      candidates: [
        { name: "", party: "", slogan: "" },
        { name: "", party: "", slogan: "" },
      ],
    };
    createError.value = "";
  }

  function addCandidate() {
    createForm.value.candidates.push({ name: "", party: "", slogan: "" });
  }

  function removeCandidate(index) {
    if (createForm.value.candidates.length <= 2) {
      return;
    }
    createForm.value.candidates.splice(index, 1);
  }

  function selectPoll(nextPollId) {
    const nextPoll = polls.value.find((item) => item.id === nextPollId);
    if (!nextPoll) {
      return;
    }
    poll.value = nextPoll;
    selectedPollId.value = nextPoll.id;
    selectedCandidateId.value = nextPoll.candidates[0]?.id ?? "";
    lastVotedCandidateId.value = "";
    error.value = "";
  }

  return {
    loading,
    voting,
    creating,
    polls,
    poll,
    selectedPollId,
    selectedCandidateId,
    lastVotedCandidateId,
    error,
    createError,
    createForm,
    totalVotes,
    totalPolls,
    canCreatePoll,
    leadingCandidateId,
    loadPolls,
    submitVote,
    submitCreatePoll,
    resetCreateForm,
    addCandidate,
    removeCandidate,
    selectPoll,
    votePercent,
    totalForPoll,
  };
});

import { useAuthStore } from "../stores/auth.js";
import { usePollStore } from "../stores/polls.js";

export function useVoterApp() {
  const auth = useAuthStore();
  const polls = usePollStore();

  return {
    state: {
      user: auth.user,
      loggingIn: auth.loggingIn,
      registering: auth.registering,
      showLoginDialog: auth.showLoginDialog,
      authMode: auth.authMode,
      loading: polls.loading,
      voting: polls.voting,
      creating: polls.creating,
      polls: polls.polls,
      poll: polls.poll,
      selectedPollId: polls.selectedPollId,
      selectedCandidateId: polls.selectedCandidateId,
      lastVotedCandidateId: polls.lastVotedCandidateId,
      error: polls.error,
      createError: polls.createError,
      createForm: polls.createForm,
    },
    canCreatePoll: polls.canCreatePoll,
    totalVotes: polls.totalVotes,
    actions: {
      handleLogin: auth.handleLogin,
      handleRegister: auth.handleRegister,
      handleLogout: auth.handleLogout,
      openLogin: auth.openLogin,
      switchAuthMode: auth.switchAuthMode,
      loadPolls: polls.loadPolls,
      submitVote: polls.submitVote,
      submitCreatePoll: polls.submitCreatePoll,
      resetCreateForm: polls.resetCreateForm,
      addCandidate: polls.addCandidate,
      removeCandidate: polls.removeCandidate,
      selectPoll: polls.selectPoll,
      votePercent: polls.votePercent,
      totalForPoll: polls.totalForPoll,
    },
  };
}

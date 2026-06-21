<script setup>
import { onMounted } from "vue";
import Button from "primevue/button";
import CandidateResult from "../components/CandidateResult.vue";
import { usePollStore } from "../stores/polls.js";
import { useAuthStore } from "../stores/auth.js";
import { useToast } from "primevue/usetoast";

const pollStore = usePollStore();
const authStore = useAuthStore();
const toast = useToast();

onMounted(() => {
  pollStore.loadPolls();
});

const handleSubmitVote = async () => {
  const result = await pollStore.submitVote(authStore.user);
  if (result?.requiresAuth) {
    authStore.showLoginDialog = true;
  } else if (result?.success) {
    toast.add({
      severity: "success",
      summary: "Vote counted",
      detail: "The poll results have been updated.",
      life: 2400,
    });
  }
};
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Vote page</p>
        <h1 class="mt-1 text-4xl font-bold text-slate-950">Cast your vote</h1>
        <p class="mt-3 max-w-2xl leading-7 text-slate-600">Choose one option and submit your vote. Results update after submission.</p>
      </div>
    </div>

    <div v-if="!pollStore.poll" class="py-8">
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-semibold">No vote selected</h2>
        <p class="mt-2 text-slate-600">Open a vote card to start voting.</p>
      </div>
    </div>

    <div v-else class="grid gap-5 py-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section class="flex flex-col gap-5">
        <div>
          <h2 class="text-2xl font-semibold text-slate-950">{{ pollStore.poll.title }}</h2>
          <p class="mt-2 max-w-2xl text-base leading-7 text-slate-600">{{ pollStore.poll.description }}</p>
        </div>

        <div class="grid gap-3">
          <label
            v-for="candidate in pollStore.poll.candidates"
            :key="candidate.id"
            class="flex cursor-pointer gap-4 rounded-lg border bg-white p-4 shadow-sm transition hover:border-emerald-400"
            :class="pollStore.selectedCandidateId === candidate.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'"
          >
            <input
              type="radio"
              name="candidate"
              :value="candidate.id"
              v-model="pollStore.selectedCandidateId"
              class="mt-1 h-4 w-4 text-emerald-600 border-slate-300"
            />
            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-slate-950">{{ candidate.name }}</span>
                <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{{ candidate.party }}</span>
              </span>
              <span class="mt-2 block text-sm leading-6 text-slate-600">{{ candidate.slogan }}</span>
            </span>
          </label>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            class="w-full sm:w-auto"
            icon="pi pi-check"
            label="Cast vote"
            :loading="pollStore.voting"
            :disabled="!pollStore.selectedCandidateId || !authStore.user"
            @click="handleSubmitVote"
          />
          <p v-if="!authStore.user" class="text-sm text-slate-600">Sign in to cast your vote.</p>
          <p v-else-if="pollStore.error" class="text-sm text-red-600">{{ pollStore.error }}</p>
          <p v-else-if="pollStore.lastVotedCandidateId" class="text-sm text-emerald-700">
            Thanks. Your latest vote is reflected below.
          </p>
        </div>
      </section>

      <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-950">Results</h2>
            <p class="mt-1 text-sm text-slate-500">{{ pollStore.totalVotes }} total votes</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
        </div>

        <div class="mt-6 grid gap-5">
          <CandidateResult
            v-for="candidate in pollStore.poll.candidates"
            :key="candidate.id"
            :candidate="candidate"
            :vote-percent="pollStore.votePercent"
            :is-leading="candidate.id === pollStore.leadingCandidateId"
          />
        </div>
      </aside>
    </div>
  </div>
</template>

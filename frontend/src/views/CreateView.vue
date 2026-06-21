<script setup>
import Button from "primevue/button";
import CandidateForm from "../components/CandidateForm.vue";
import { usePollStore } from "../stores/polls.js";
import { useAuthStore } from "../stores/auth.js";
import { useToast } from "primevue/usetoast";

const pollStore = usePollStore();
const authStore = useAuthStore();
const toast = useToast();

const handleSubmit = async () => {
  const result = await pollStore.submitCreatePoll(authStore.user);
  if (result?.requiresAuth) {
    authStore.openLogin();
  } else if (result?.success) {
    toast.add({
      severity: "success",
      summary: "Vote created",
      detail: "Your new vote is now available in Events.",
      life: 2600,
    });
  } else if (result?.sessionExpired) {
    toast.add({
      severity: "warn",
      summary: "Session expired",
      detail: "Please sign in again.",
      life: 2600,
    });
  }
};
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
    <div class="border-b border-slate-200 pb-6">
      <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Create</p>
      <h1 class="mt-1 text-4xl font-bold text-slate-950">Start a new vote</h1>
      <p class="mt-3 max-w-2xl leading-7 text-slate-600">
        Save a new vote to the FastAPI backend. Once created, it appears as a card in Explore.
      </p>
    </div>

    <form class="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="handleSubmit">
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Vote title</span>
          <input v-model="pollStore.createForm.title" class="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="120" placeholder="Best project for Q3" />
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Description</span>
          <input v-model="pollStore.createForm.description" class="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="240" placeholder="Ask voters what they should decide" />
        </label>
      </div>

      <div class="mt-6 grid gap-3">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold text-slate-950">Choices</h2>
          <Button icon="pi pi-plus" label="Add choice" type="button" severity="secondary" outlined size="small" @click="pollStore.addCandidate" />
        </div>

        <CandidateForm
          v-for="(candidate, index) in pollStore.createForm.candidates"
          :key="index"
          :candidate="candidate"
          :index="index"
          :disabled="pollStore.createForm.candidates.length <= 2"
          @remove="pollStore.removeCandidate(index)"
        />
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button class="w-full sm:w-auto" icon="pi pi-save" label="Save vote" type="submit" :loading="pollStore.creating" :disabled="!pollStore.canCreatePoll" />
        <Button class="w-full sm:w-auto" icon="pi pi-refresh" label="Reset" type="button" severity="secondary" outlined @click="pollStore.resetCreateForm" />
        <p v-if="pollStore.createError" class="text-sm font-medium text-red-600">{{ pollStore.createError }}</p>
      </div>
    </form>
  </div>
</template>

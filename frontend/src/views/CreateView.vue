<script setup>
import Button from 'primevue/button';
import { useVoterApp } from '../composables/useVoterApp.js';

const {
  state,
  canCreatePoll,
  actions: { submitCreatePoll, resetCreateForm, addCandidate, removeCandidate },
} = useVoterApp();
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

    <form class="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="submitCreatePoll">
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Vote title</span>
          <input v-model="state.createForm.title" class="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="120" placeholder="Best project for Q3" />
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700">Description</span>
          <input v-model="state.createForm.description" class="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="240" placeholder="Ask voters what they should decide" />
        </label>
      </div>

      <div class="mt-6 grid gap-3">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold text-slate-950">Choices</h2>
          <Button icon="pi pi-plus" label="Add choice" type="button" severity="secondary" outlined size="small" @click="addCandidate" />
        </div>

        <div v-for="(candidate, index) in state.createForm.candidates" :key="index" class="grid gap-3 rounded-lg border border-slate-200 bg-[#f8fafc] p-4 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Choice name</span>
            <input v-model="candidate.name" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="80" placeholder="Mobile ballot" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Group</span>
            <input v-model="candidate.party" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="80" placeholder="Product team" />
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700">Short pitch</span>
            <input v-model="candidate.slogan" class="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" maxlength="160" placeholder="Make voting easier on phones" />
          </label>

          <div class="flex items-end">
            <Button icon="pi pi-trash" type="button" severity="danger" text rounded :disabled="state.createForm.candidates.length <= 2" @click="removeCandidate(index)" />
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button class="w-full sm:w-auto" icon="pi pi-save" label="Save vote" type="submit" :loading="state.creating" :disabled="!canCreatePoll" />
        <Button class="w-full sm:w-auto" icon="pi pi-refresh" label="Reset" type="button" severity="secondary" outlined @click="resetCreateForm" />
        <p v-if="state.createError" class="text-sm font-medium text-red-600">{{ state.createError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { useVoterApp } from '../composables/useVoterApp.js';
import { onMounted } from 'vue';

const {
  state,
  actions: { loadPolls, selectPoll, submitCreatePoll, resetCreateForm, addCandidate, removeCandidate, totalForPoll, votePercent },
} = useVoterApp();

onMounted(loadPolls);
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
    <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Explore</p>
        <h1 class="mt-1 text-4xl font-bold text-slate-950">All created votes</h1>
        <p class="mt-3 max-w-2xl leading-7 text-slate-600">
          Browse demo and user-created votes. Open a card to cast a vote and see the live result page.
        </p>
      </div>
      <div class="flex gap-2">
        <Button icon="pi pi-refresh" label="Refresh" severity="secondary" outlined :loading="state.loading" @click="loadPolls" />
        <Button icon="pi pi-plus" label="Create" @click="$router.push('/create')" />
      </div>
    </div>

    <div v-if="state.loading" class="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">
      <Skeleton v-for="index in 3" :key="index" height="17rem" border-radius="8px" />
    </div>

    <div v-else-if="state.error" class="py-8">
      <div class="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{{ state.error }}</div>
    </div>

    <div v-else class="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in state.polls"
        :key="item.id"
        class="flex min-h-[17rem] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Open vote</p>
            <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ item.title }}</h2>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{{ item.candidates.length }} choices</span>
        </div>
        <p class="mt-3 line-clamp-3 leading-7 text-slate-600">{{ item.description }}</p>

        <div class="mt-5 grid gap-2">
          <div v-for="candidate in item.candidates.slice(0, 3)" :key="candidate.id" class="flex items-center justify-between gap-3 rounded-md bg-[#f8fafc] px-3 py-2">
            <span class="truncate text-sm font-medium text-slate-700">{{ candidate.name }}</span>
            <span class="text-sm text-slate-500">{{ candidate.votes }}</span>
          </div>
        </div>

        <div class="mt-auto flex items-center justify-between gap-3 pt-5">
          <span class="flex items-center gap-2 text-sm font-medium text-slate-500">
            <i class="pi pi-users"></i>
            {{ totalForPoll(item) }} votes
          </span>
          <Button label="Vote now" icon="pi pi-arrow-right" icon-pos="right" @click="selectPoll(item.id); $router.push('/vote/' + item.id)" />
        </div>
      </article>
    </div>
  </div>
</template>

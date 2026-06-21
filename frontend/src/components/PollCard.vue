<script setup>
import Button from "primevue/button";
import CandidateCard from "./CandidateCard.vue";

const props = defineProps({
  poll: { type: Object, required: true },
  totalForPoll: { type: Function, required: true },
});

const emit = defineEmits(["vote"]);
</script>

<template>
  <article
    class="flex min-h-[17rem] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Open vote</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ poll.title }}</h2>
      </div>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{{ poll.candidates.length }} choices</span>
    </div>
    <p class="mt-3 line-clamp-3 leading-7 text-slate-600">{{ poll.description }}</p>

    <div class="mt-5 grid gap-2">
      <CandidateCard
        v-for="candidate in poll.candidates.slice(0, 3)"
        :key="candidate.id"
        :candidate="candidate"
      />
    </div>

    <div class="mt-auto flex items-center justify-between gap-3 pt-5">
      <span class="flex items-center gap-2 text-sm font-medium text-slate-500">
        <i class="pi pi-users"></i>
        {{ totalForPoll(poll) }} votes
      </span>
      <Button label="Vote now" icon="pi pi-arrow-right" icon-pos="right" @click="emit('vote', poll.id)" />
    </div>
  </article>
</template>
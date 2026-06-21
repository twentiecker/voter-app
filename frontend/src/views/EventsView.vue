<script setup>
import { onMounted } from "vue";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import PollCard from "../components/PollCard.vue";
import { usePollStore } from "../stores/polls.js";
import { useAuthStore } from "../stores/auth.js";
import { features, processSteps, faqs, platformStats } from "../appContent.js";

const pollStore = usePollStore();
const authStore = useAuthStore();

onMounted(() => {
  pollStore.loadPolls();
});
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
      <div class="flex justify-end gap-2">
        <Button icon="pi pi-refresh" label="Refresh" severity="secondary" outlined :loading="pollStore.loading" @click="pollStore.loadPolls" />
        <Button v-if="authStore.user" icon="pi pi-plus" label="Create" @click="$router.push('/create')" />
      </div>
    </div>

    <div v-if="pollStore.loading" class="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">
      <Skeleton v-for="index in 3" :key="index" height="17rem" border-radius="8px" />
    </div>

    <div v-else-if="pollStore.error" class="py-8">
      <div class="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{{ pollStore.error }}</div>
    </div>

    <div v-else class="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">
      <PollCard
        v-for="item in pollStore.polls"
        :key="item.id"
        :poll="item"
        :total-for-poll="pollStore.totalForPoll"
        @vote="pollStore.selectPoll($event); $router.push('/vote/' + $event)"
      />
    </div>
  </div>
</template>

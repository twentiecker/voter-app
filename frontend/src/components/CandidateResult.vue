<script setup>
defineProps({
  candidate: { type: Object, required: true },
  votePercent: { type: Function, required: true },
  isLeading: { type: Boolean, required: true },
});
</script>

<template>
  <div class="grid gap-2">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate font-medium text-slate-900">{{ candidate.name }}</p>
        <p class="text-sm text-slate-500">{{ candidate.votes }} votes</p>
      </div>
      <span
        class="shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold"
        :class="isLeading ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'"
      >
        {{ votePercent(candidate.votes) }}%
      </span>
    </div>
    <div class="h-2 rounded-full bg-slate-200">
      <div
        class="h-2 rounded-full bg-emerald-500 transition-all"
        :style="{ width: votePercent(candidate.votes) + '%' }"
      />
    </div>
  </div>
</template>
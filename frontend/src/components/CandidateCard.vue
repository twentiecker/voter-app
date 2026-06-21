<script setup>
defineProps({
  candidate: { type: Object, required: true },
});
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-md bg-[#f8fafc] px-3 py-2">
    <span class="truncate text-sm font-medium text-slate-700">{{ candidate.name }}</span>
    <span class="text-sm text-slate-500">{{ candidate.votes }}</span>
  </div>
</template>
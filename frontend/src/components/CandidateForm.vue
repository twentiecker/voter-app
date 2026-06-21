<script setup>
import Button from "primevue/button";

defineProps({
  candidate: { type: Object, required: true },
  index: { type: Number, required: true },
  disabled: { type: Boolean, required: true },
});

const emit = defineEmits(["remove"]);
</script>

<template>
  <div class="grid gap-3 rounded-lg border border-slate-200 bg-[#f8fafc] p-4 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
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
      <Button icon="pi pi-trash" type="button" severity="danger" text rounded :disabled="disabled" @click="emit('remove', index)" />
    </div>
  </div>
</template>
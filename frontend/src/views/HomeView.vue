<script setup>
import Button from 'primevue/button';
import { useVoterApp } from '../composables/useVoterApp.js';
import { features, processSteps, faqs, platformStats } from '../appContent.js';
import { onMounted } from 'vue';

const {
  state,
  actions: { loadPolls },
} = useVoterApp();

onMounted(() => {
  loadPolls();
});
</script>

<template>
  <section>
    <section class="relative overflow-hidden bg-[#111827] text-white">
      <div class="absolute inset-0 opacity-35">
        <div class="hero-grid h-full w-full"></div>
      </div>

      <div class="relative mx-auto grid min-h-[82vh] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10">
        <div class="max-w-3xl">
          <p class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm font-semibold text-emerald-100">
            <i class="pi pi-circle-fill text-[0.45rem] text-emerald-300"></i>
            Modern voting for small teams and communities
          </p>
          <h1 class="max-w-4xl text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Run clean polls with live results in one focused app.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A simple voting experience backed by FastAPI and shaped with Vue, Tailwind CSS, and PrimeVue for a polished front desk to every decision.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button label="Explore votes" icon="pi pi-compass" size="large" @click="$router.push('/events')" />
            <Button label="Create vote" icon="pi pi-plus" size="large" severity="secondary" outlined @click="$router.push('/create')" />
          </div>
        </div>

        <div class="rounded-lg border border-white/10 bg-white p-4 text-slate-950 shadow-2xl">
          <div class="rounded-md bg-[#f8fafc] p-4">
            <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p class="text-sm font-semibold text-emerald-700">Live preview</p>
                <h2 class="mt-1 text-xl font-bold">Community Project Vote</h2>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">Open</span>
            </div>

            <div class="mt-5 grid gap-3">
              <div class="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-semibold">Public Garden</p>
                    <p class="text-sm text-slate-500">Green Spaces</p>
                  </div>
                  <span class="text-lg font-bold text-emerald-700">46%</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-slate-200">
                  <div class="h-2 w-[46%] rounded-full bg-emerald-500"></div>
                </div>
              </div>

              <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-semibold">Library Upgrade</p>
                    <p class="text-sm text-slate-500">Learning First</p>
                  </div>
                  <span class="text-lg font-bold text-slate-700">34%</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-slate-200">
                  <div class="h-2 w-[34%] rounded-full bg-sky-500"></div>
                </div>
              </div>

              <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-semibold">Street Lighting</p>
                    <p class="text-sm text-slate-500">Safer Blocks</p>
                  </div>
                  <span class="text-lg font-bold text-slate-700">20%</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-slate-200">
                  <div class="h-2 w-[20%] rounded-full bg-amber-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
        <article v-for="feature in features" :key="feature.title" class="rounded-lg border border-slate-200 p-5">
          <span class="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <i :class="feature.icon"></i>
          </span>
          <h2 class="mt-4 text-lg font-semibold">{{ feature.title }}</h2>
          <p class="mt-2 leading-7 text-slate-600">{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section class="bg-[#f7f4ec]">
      <div class="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:px-10">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Decision workflow</p>
          <h2 class="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">From question to consensus without extra ceremony.</h2>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="(step, index) in processSteps" :key="step" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <span class="text-sm font-bold text-emerald-700">0{{ index + 1 }}</span>
            <p class="mt-3 text-lg font-semibold">{{ step }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.72fr_1fr] lg:px-10">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">FAQ</p>
          <h2 class="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Common questions before opening a vote.</h2>
          <p class="mt-4 max-w-xl leading-7 text-slate-600">
            The app is intentionally simple: pick a poll, cast a vote, and review the live result state from the same screen.
          </p>
        </div>

        <div class="grid gap-3">
          <details v-for="faq in faqs" :key="faq.question" class="group rounded-lg border border-slate-200 bg-[#f8fafc] p-5 open:bg-white open:shadow-sm">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
              <span>{{ faq.question }}</span>
              <i class="pi pi-chevron-down text-sm text-slate-500 transition group-open:rotate-180"></i>
            </summary>
            <p class="mt-3 leading-7 text-slate-600">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="bg-[#111827] text-white">
      <div class="mx-auto grid max-w-7xl gap-3 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-10">
        <div v-for="stat in platformStats" :key="stat.label" class="rounded-lg border border-white/10 bg-white/5 p-4">
          <p class="text-3xl font-bold">{{ stat.value }}</p>
          <p class="mt-1 text-sm text-slate-300">{{ stat.label }}</p>
        </div>
      </div>
    </section>
  </section>
</template>

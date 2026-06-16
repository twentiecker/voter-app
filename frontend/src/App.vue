<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import RadioButton from 'primevue/radiobutton';
import Toast from 'primevue/toast';
import { useRoute, useRouter } from 'vue-router';
import { castVote, createPoll, getPolls, login, register } from './api.js';
import { useVoterApp } from './composables/useVoterApp.js';
import { navItems } from './appContent.js';
import HomeView from './views/HomeView.vue';
import EventsView from './views/EventsView.vue';
import CreateView from './views/CreateView.vue';
import VoteView from './views/VoteView.vue';

const route = useRoute();
const router = useRouter();
const {
  state,
  actions: { handleLogin, handleRegister, handleLogout },
} = useVoterApp();

const activeView = computed(() => {
  if (route.path.startsWith('/vote/')) return 'vote';
  const map = {
    '/': 'home',
    '/events': 'explore',
    '/create': 'create',
  };
  return map[route.path] ?? 'home';
});

function navigate(to) {
  router.push(to);
}

function showView(view) {
  const map = {
    home: '/',
    explore: '/events',
    create: '/create',
  };
  router.push(map[view] ?? '/');
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f4ec] text-slate-950">
    <Toast />

    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <button type="button" class="flex items-center gap-3 text-left" @click="navigate('/')">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-emerald-300">
            <i class="pi pi-check-square text-lg"></i>
          </span>
          <span>
            <span class="block text-lg font-bold leading-5">Voter App</span>
            <span class="text-sm text-slate-500">Live poll workspace</span>
          </span>
        </button>

        <div class="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
          <button
            v-for="item in navItems"
            :key="item.key"
            type="button"
            class="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition cursor-pointer"
            :class="activeView === item.key ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'"
            @click="showView(item.key)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="state.user">
            <span class="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 sm:flex">
              <i class="pi pi-user text-slate-500"></i>
              <span>{{ state.user.name }}</span>
              <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{{ state.user.role }}</span>
            </span>
            <Button label="Logout" severity="secondary" class="cursor-pointer" @click="handleLogout" />
          </template>
          <template v-else>
            <Button label="Login" class="cursor-pointer" @click="state.showLoginDialog = true" />
          </template>
        </div>
      </nav>
    </header>

    <Dialog v-model:visible="state.showLoginDialog" :header="state.authMode === 'login' ? 'Welcome back' : 'Create account'" :style="{ width: '26rem' }">
      <form v-if="state.authMode === 'login'" class="flex flex-col gap-4" @submit.prevent="handleLogin">
        <span class="text-sm text-slate-600">Use demo account <span class="font-semibold text-slate-900">admin</span> with any password.</span>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-900">Username</label>
          <InputText v-model="state.loginForm.username" class="w-full" placeholder="Enter username" autocomplete="username" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-900">Password</label>
          <Password v-model="state.loginForm.password" class="w-full" placeholder="Enter password" autocomplete="current-password" :feedback="false" toggle-mask />
        </div>
        <Button type="submit" label="Sign in" :loading="state.loggingIn" class="w-full cursor-pointer" />
        <p class="text-center text-sm text-slate-600">
          Don't have an account?
          <button type="button" class="font-semibold text-emerald-700 hover:underline cursor-pointer" @click="state.authMode = 'register'">Register</button>
        </p>
      </form>
      <form v-else class="flex flex-col gap-4" @submit.prevent="handleRegister">
        <span class="text-sm text-slate-600">Create a new voter account.</span>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-900">Full name</label>
          <InputText v-model="state.registerForm.name" class="w-full" placeholder="Enter your name" autocomplete="name" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-900">Username</label>
          <InputText v-model="state.registerForm.username" class="w-full" placeholder="Choose a username" autocomplete="username" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-900">Password</label>
          <Password v-model="state.registerForm.password" class="w-full" placeholder="Create a password" autocomplete="new-password" :feedback="false" toggle-mask />
        </div>
        <Button type="submit" label="Create account" :loading="state.registering" class="w-full cursor-pointer" />
        <p class="text-center text-sm text-slate-600">
          Already have an account?
          <button type="button" class="font-semibold text-emerald-700 hover:underline cursor-pointer" @click="state.authMode = 'login'">Sign in</button>
        </p>
      </form>
    </Dialog>

    <HomeView v-if="activeView === 'home'" />
    <EventsView v-else-if="activeView === 'explore'" />
    <CreateView v-else-if="activeView === 'create'" />
    <VoteView v-else-if="activeView === 'vote'" />
  </main>
</template>

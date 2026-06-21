<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "./stores/auth.js";
import { usePollStore } from "./stores/polls.js";
import { navItems } from "./appContent.js";
import NavBar from "./components/NavBar.vue";
import AuthDialog from "./components/AuthDialog.vue";
import HomeView from "./views/HomeView.vue";
import EventsView from "./views/EventsView.vue";
import CreateView from "./views/CreateView.vue";
import VoteView from "./views/VoteView.vue";
import UnauthorizedView from "./views/UnauthorizedView.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pollStore = usePollStore();
const toast = useToast();

async function handleAuthLogin() {
  const result = await authStore.handleLogin();
  if (result?.fieldsMissing) {
    toast.add({
      severity: "warn",
      summary: "Missing fields",
      detail: "Enter both username and password.",
      life: 2600,
    });
  } else if (!result?.success) {
    toast.add({
      severity: "error",
      summary: "Login failed",
      detail: result?.error || "Invalid username or password.",
      life: 2600,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Welcome back",
      detail: `Signed in as ${result.userData.name}.`,
      life: 2600,
    });
  }
}

async function handleAuthRegister() {
  const result = await authStore.handleRegister();
  if (result?.fieldsMissing) {
    toast.add({
      severity: "warn",
      summary: "Missing fields",
      detail: "Enter name, username, and password.",
      life: 2600,
    });
  } else if (!result?.success) {
    toast.add({
      severity: "error",
      summary: "Registration failed",
      detail: result?.error || "Could not create account. Try a different username.",
      life: 2600,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Account created",
      detail: `Welcome, ${result.userData.name}.`,
      life: 2600,
    });
  }
}

function handleLogout() {
  authStore.handleLogout();
  toast.add({
    severity: "info",
    summary: "Signed out",
    detail: "You have been logged out.",
    life: 2200,
  });
}

function handleNavClick(view) {
  if (view === "create") {
    router.push("/create");
  } else {
    const item = navItems.find((i) => i.key === view);
    router.push(item?.to || "/");
  }
}

watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (!oldUser && newUser) return;
    if (oldUser && !newUser && route.path === "/create") {
      router.push("/events");
    }
  },
);

const activeView = computed(() => {
  if (route.path.startsWith("/vote/")) return "vote";
  const map = {
    "/": "home",
    "/events": "explore",
    "/create": "create",
    "/unauthorized": "unauthorized",
  };
  return map[route.path] ?? "home";
});
</script>

<template>
  <main class="min-h-screen bg-[#f7f4ec] text-slate-950">
    <Toast />

    <NavBar
      :user="authStore.user"
      :active-view="activeView"
      :nav-items="navItems"
      @login="authStore.openLogin"
      @logout="handleLogout"
      @nav-click="handleNavClick"
    />

    <AuthDialog
      :visible="authStore.showLoginDialog"
      :auth-mode="authStore.authMode"
      :login-form="authStore.loginForm"
      :register-form="authStore.registerForm"
      :logging-in="authStore.loggingIn"
      :registering="authStore.registering"
      @login="handleAuthLogin"
      @register="handleAuthRegister"
      @update:visible="(v) => (authStore.showLoginDialog = v)"
      @switch-mode="(mode) => (authStore.authMode = mode)"
    />

    <HomeView v-if="activeView === 'home'" />
    <EventsView v-else-if="activeView === 'explore'" />
    <CreateView v-else-if="activeView === 'create'" />
    <VoteView v-else-if="activeView === 'vote'" />
    <UnauthorizedView v-else-if="activeView === 'unauthorized'" />
  </main>
</template>

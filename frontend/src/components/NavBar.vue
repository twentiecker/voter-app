<script setup>
import { ref, computed } from "vue";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Menu from "primevue/menu";

const props = defineProps({
  user: { type: Object, default: null },
  activeView: { type: String, required: true },
  navItems: { type: Array, required: true },
});

const emit = defineEmits(["login", "logout", "navClick", "userMenuClick"]);

const userInitial = computed(() => props.user?.name?.charAt(0).toUpperCase() || "U");
const userName = computed(() => props.user?.name || "");

const menu = ref();
const menuItems = computed(() => [
  {
    label: userName.value,
    items: [
      {
        label: "Create",
        icon: "pi pi-plus",
        command: () => emit("navClick", "create"),
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => emit("logout"),
      },
    ],
  },
]);

function toggleMenu(event) {
  menu.value?.toggle(event);
}

function navigateTo(view) {
  emit("navClick", view);
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
      <button type="button" class="flex items-center gap-3 text-left" @click="navigateTo('home')">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-emerald-300">
          <i class="pi pi-check-square text-lg"></i>
        </span>
        <span>
          <span class="block text-lg font-bold leading-5">Voter App</span>
          <span class="text-sm text-slate-500">Live poll workspace</span>
        </span>
      </button>

      <div class="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        <button
          v-for="item in navItems"
          :key="item.key"
          type="button"
          class="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition cursor-pointer"
          :class="activeView === item.key ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'"
          @click="navigateTo(item.key)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="user">
          <div class="relative">
            <Menu ref="menu" :model="menuItems" popup />
            <button
              type="button"
              class="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white pl-1 pr-3 py-1 shadow-sm transition hover:shadow-md cursor-pointer"
              @click="toggleMenu"
            >
              <Avatar
                :label="userInitial"
                shape="circle"
                size="normal"
                class="bg-slate-950 text-emerald-300"
                style="font-size: 1rem; font-weight: 600"
              />
              <span class="text-sm font-semibold text-slate-800 max-w-[6rem] truncate">{{ userName }}</span>
              <i class="pi pi-chevron-down text-xs text-slate-500"></i>
            </button>
          </div>
        </template>
        <template v-else>
          <Button label="Login" class="cursor-pointer" @click="emit('login')" />
        </template>
      </div>
    </nav>
  </header>
</template>
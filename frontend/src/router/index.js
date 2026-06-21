import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EventsView from "../views/EventsView.vue";
import CreateView from "../views/CreateView.vue";
import VoteView from "../views/VoteView.vue";
import UnauthorizedView from "../views/UnauthorizedView.vue";
import { useAuthStore } from "../stores/auth.js";

const routes = [
  { path: "/", component: HomeView },
  { path: "/events", component: EventsView },
  { path: "/create", component: CreateView },
  { path: "/unauthorized", component: UnauthorizedView },
  { path: "/vote/:id", component: VoteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path === "/create" && !authStore.user) {
    next("/unauthorized");
  } else {
    next();
  }
});

export default router;

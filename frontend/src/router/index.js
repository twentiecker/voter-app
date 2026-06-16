import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EventsView from '../views/EventsView.vue';
import CreateView from '../views/CreateView.vue';
import VoteView from '../views/VoteView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/events', component: EventsView },
  { path: '/create', component: CreateView },
  { path: '/vote/:id', component: VoteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

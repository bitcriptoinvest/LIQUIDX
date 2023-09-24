import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from './views/Home.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: Home,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

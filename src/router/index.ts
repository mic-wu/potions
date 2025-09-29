import { createRouter, createWebHistory } from 'vue-router'

import ListView from '@/views/ListView/ListView.vue'
import Proto1View from '@/views/Proto1View/Proto1View.vue'

const routes = [
  { path: '/', component: ListView },
  { path: '/proto1', component: Proto1View },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

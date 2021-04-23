import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login';
import Home from '../views/home';

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login }
]

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

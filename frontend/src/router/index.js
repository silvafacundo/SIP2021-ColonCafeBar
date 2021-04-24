import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';
import Login from '../views/login';
import Home from '../views/home';
import Register from '../views/register';
import Profile from '../views/profile';

Vue.use(VueRouter)

const publicRoutes = [
	'home',
	'login',
	'register'
]

const routes = [
	{ name: 'home', path: '/', component: Home },
	{ name: 'login', path: '/login', component: Login },
	{ name: 'register', path: '/register', component: Register },
	{ name: 'me', path: '/me', component: Profile }
]

// eslint-disable-next-line no-new
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach(async (to, from, next) => {
	const logedIn = store.getters['User/token'];
	const isPublicRoute = publicRoutes.includes(to.name)
	if (!isPublicRoute && !logedIn) return next({ name: 'login' });
	if (['login', 'register'].includes(to.name) && logedIn) return next({ name: 'me' });
	return next();
});

export default router

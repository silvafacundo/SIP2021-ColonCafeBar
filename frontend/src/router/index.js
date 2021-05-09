import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';
import Login from '../views/login';
import Home from '../views/home';
import Register from '../views/register';
import Profile from '../views/profile';

import EmptyRoute from '../components/EmptyRoute.vue';

//
import Dashboard from '../views/admin/dashboard';
import Users from '../views/admin/users' ;
import Permissions from '../views/admin/Permissions';
import Roles from '../views/admin/Roles';
//

Vue.use(VueRouter)

const publicRoutes = [
	'home',
	'login',
	'adminLogin',
	'register'
]

const routes = [
	{ path: '/', name: 'home', component: Home },
	{ path: '/login', name: 'login', component: Login },
	{ path: '/register', name: 'register', component: Register },
	{ path: '/me', name: 'me', component: Profile },
	{ path: '/admin/login', name: 'adminLogin', component: Login },
	{ path: '/admin', component: EmptyRoute, children: [
		{ path: '/', name: 'adminDashboard', component: Dashboard },
		{ path: '/users', name: 'adminUsers', component: Users },
		{ path: '/roles', name: 'adminRoles', component: Roles },
		{ path: '/permissions', name: 'adminPermissions', component: Permissions },
	] }
]

// eslint-disable-next-line no-new
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})
const checkAdminLogin = async () => {
	const isAuth = store.getters['Auth/isAdminAuth'];
	const hasToken = store.getters['Auth/adminToken'];
	if (!hasToken) return false;
	if (hasToken && !isAuth) {
		return await store.dispatch('Auth/checkAdminToken');
	}
	return true;
}
const checkClientLogin = async () => {
	const isAuth = store.getters['Auth/isClientAuth'];
	const hasToken = store.getters['Auth/clientToken'];
	if (!hasToken) return false;
	if (hasToken && !isAuth) {
		return await store.dispatch('Auth/checkClientToken');
	}
	return true;
}

const handleAdminRoutes = async (to, from, next) => {
	const isLogedIn = await checkAdminLogin();
	if (!isLogedIn) return next({ name: 'adminLogin' });
	return next();
};

const handleClientRoutes = async (to, from, next) => {
	const isLogedIn = await checkClientLogin();
	if (!isLogedIn) return next({ name: 'login' });
	return next();
}

router.beforeEach(async (to, from, next) => {
	const isPublicRoute = publicRoutes.includes(to.name)
	if (isPublicRoute) return next();

	// Checks if is an admin route
	if (to.matched.length > 0 && to.matched[0].path === '/admin')
		return await handleAdminRoutes(to, from, next);
	return await handleClientRoutes(to, from, next);
});

export default router

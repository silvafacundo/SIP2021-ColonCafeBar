import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

import ResetPassword from '../views/ResetPassword';

import Home from '../views/Home';
import Register from '../views/Register';
import Login from '../views/Login';
import Profile from '../views/Profile';


import Order from '../views/Order';
import Cart from '../views/Cart';

import EmptyRoute from '../components/EmptyRoute.vue';

//
import AdminLogin from '../views/admin/Login';
import Dashboard from '../views/admin/Dashboard';
import Users from '../views/admin/Users';
import Permissions from '../views/admin/Permissions';
import Roles from '../views/admin/Roles';
import Orders from '../views/admin/Orders';
//

Vue.use(VueRouter)

const publicRoutes = [
	'home',
	'login',
	'adminLogin',
	'register',
	'resetPassword'
]

const routes = [
	{ path: '/', name: 'home', component: Home },
	{ path: '/login', name: 'login', component: Login },
	{ path: '/resetpassword/:token', props: true, name: 'resetPassword', component: ResetPassword },
	{ path: '/register', name: 'register', component: Register },
	{ path: '/me', name: 'me', component: Profile },
	{ path: '/cart', name: 'cart', component: Cart },
	{ path: '/order/:orderId', props: true, name: 'order', component: Order },

	// ADMIN:
	{ path: '/admin/login', name: 'adminLogin', component: AdminLogin },
	{ path: '/admin', name: 'adminDashboard', component: Dashboard, children: [
		{ path: 'users', name: 'adminUsers', component: Users },
		{ path: 'roles', name: 'adminRoles', component: Roles },
		{ path: 'permissions', name: 'adminPermissions', component: Permissions },
		{ path: 'ordenes', name: 'adminOrders', component: Orders },
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

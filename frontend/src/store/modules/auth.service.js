import Vue from 'vue';
import router from '../../router';
import firebase from 'firebase/app';
import 'firebase/auth';

const state = () => ({
	user: null,
	client: {
		token: null,
		user: null,
		isAuth: false
	},
	admin: {
		token: null,
		user: null,
		isAuth: false
	}
});

const getters = {
	client: state => state.client,
	isClientAuth: state => state.client.isAuth,
	clientToken: state => state.client.token || localStorage.getItem('client-auth-token'),
	clientUser: state => state.client.user,

	admin: state => state.admin,
	isAdminAuth: state => state.admin.isAuth,
	adminToken: state => state.admin.token || localStorage.getItem('admin-auth-token'),
	adminUser: state => state.admin.user
};
const mutations = {
	setAdminAuth(state, value) {
		state.admin.isAuth = !!value;
		if (value) state.client.isAuth = false;
	},
	setAdminToken(state, token) {
		persistToken(token, true);
		state.admin.token = token;
		setAuthorizationHeader(token);
	},
	setAdminUser(state, user) {
		state.admin.user = user;
	},
	setClientAuth(state, value) {
		state.client.isAuth = !!value;
		if (value) state.admin.isAuth = false;
	},
	setClientToken(state, token) {
		persistToken(token, false);
		state.client.token = token;
		setAuthorizationHeader(token);
	},
	setClientUser(state, user) {
		state.client.user = user;
	}
};
const actions = {
	async resetPassword(_, { password, token }) {
		try {
			const response = await Vue.axios.post('/auth/reset', {
				password,
				token
			});
			return response.data;
		} catch (err) {
			console.error('Failed to reset password', err);
			throw err;
		}
	},
	async requestResetPassword(_, { email }) {
		try {
			const response = await Vue.axios.post('/reset', {
				email
			});
			return response;
		} catch (err) {
			console.error('Failed to send reset password email', err);
			throw err;
		}
	},
	async checkAdminToken({ getters, commit, dispatch }) {
		const token = getters.adminToken;
		if (token) {
			commit('setAdminToken', token);
			try {
				const response = await Vue.axios.get('/admin/auth/me');
				commit('setAdminAuth', true);
				commit('setAdminUser', response.data.user);
				try {
					await firebase.auth().signInWithCustomToken(response.data.user.firebaseToken);
				} catch (err) {
					if (process.env.NODE_ENV === 'production') {
						console.error('Failed to authenticated with firebase', err);
						throw err
					}
					console.warn('ERROR IGNORED IN DEVELOPMENT\nFailed to authenticated with firebase', err)
				}
				return true;
			} catch (err) {
				await dispatch('logOut', { admin: true, client: false });
				return false;
			}
		}
	},
	async adminLogin({ dispatch, commit }, { username, password }) {
		const response = await Vue.axios.post('/auth/admin/login', { username, password });
		const token = response.data.payload;
		commit('setAdminToken', token);
		await dispatch('checkAdminToken');
	},
	async registerAdmin(_, { username, password, name }) {
		const response = await Vue.axios.post('/admin/auth/register', { username, password, name });
		return response.data;
	},
	async checkClientToken({ getters, commit, dispatch }) {
		const token = getters.clientToken;
		if (token) {
			commit('setClientToken', token);
			try {
				const response = await Vue.axios.get('/auth/me');
				commit('setClientAuth', true);
				commit('setClientUser', response.data.user);
				return true;
			} catch (err) {
				await dispatch('logOut', { admin: false, client: true });
				return false;
			}
		}
	},
	async clientLogin({ dispatch, commit }, { email, password }) {
		const response = await Vue.axios.post('/auth/login', { email, password });
		const token = response.data.payload;
		commit('setClientToken', token);
		await dispatch('checkClientToken');
	},
	async registerClient(_, { email, password, firstName }) {
		const response = await Vue.axios.post('/auth/register', { email, password, firstName });
		return response.data;
	},
	logOut({ commit, dispatch }, { admin = false, client = false } = {}) {
		if (admin) {
			firebase.auth().signOut();
			commit('setAdminToken', '');
			commit('setAdminAuth', false);
			commit('setAdminUser', null);
			dispatch('User/RESET', null, { root: true });
			router.push({ name: 'adminLogin' });
		}
		if (client) {
			commit('setClientToken', '');
			commit('setClientAuth', false);
			commit('setClientUser', null);
			router.push({ name: 'login' });
		}
	}
};

const setAuthorizationHeader = payload => {
	Vue.axios.defaults.headers.common.Authorization = payload ? `Bearer ${payload}` : '';
};

const persistToken = function (token, isAdmin = false) {
	const key = isAdmin ? 'admin-auth-token' : 'client-auth-token';
	localStorage.setItem(key, token);
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
import Vue from 'vue';
import router from '../../router';

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
	async checkAdminToken({ getters, commit, dispatch }) {
		const token = getters.adminToken;
		if (token) {
			commit('setAdminToken', token);
			try {
				const response = await Vue.axios.get('/admin/auth/me');
				commit('setAdminAuth', true);
				commit('setAdminUser', response.data.user);
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
	logOut({ commit }, { admin = true, client = true } = {}) {
		if (admin) {
			commit('setAdminToken', '');
			commit('setAdminAuth', false);
			commit('setAdminUser', null);
		}
		if (client) {
			commit('setClientToken', '');
			commit('setClientAuth', false);
			commit('setClientUser', null);
		}
		router.push({ name: 'login' });

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
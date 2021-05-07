import Vue from 'vue';
import router from '../../router';

const state = () => ({
	user: null,
	token: null
});

const getters = {
	isAuth: (state) => !!state.user,
	token: state => state.token || localStorage.getItem('auth-token'),
	user: state => state.user
};
const mutations = {
	setUser(state, payload) {
		state.user = { ...payload };
	},
	setToken(state, token) {
		persistToken(token);
		state.token = token;
		setAuthorizationHeader(token);
	}
};
const actions = {
	async checkToken({ getters, commit, dispatch }) {
		const token = getters.token || localStorage.getItem('auth-token');
		if (token) {
			commit('setToken', token);
			const response = await Vue.axios.get('/me');
			if (response.data.user) {
				commit('setUser', response.data.user)
			} else {
				return await dispatch('logOut');
			}
		}
	},
	async login({ dispatch, commit }, { username, password }) {
		const response = await Vue.axios.post('/auth/admin/login', { username, password });
		const token = response.data.payload;
		commit('setToken', token);
		await dispatch('checkToken');

	},
	async register(_, payload) {
		const response = await Vue.axios.post('/auth/register', { ...payload })
		return response.data;
	},
	logOut({ commit }) {
		commit('setToken', '');
		commit('setUser', null);
		router.push({ name: 'login' });

	}
};

const setAuthorizationHeader = payload => {
	Vue.axios.defaults.headers.common.Authorization = payload ? `Bearer ${payload}` : '';
};

const persistToken = function (token) {
	localStorage.setItem('auth-token', token);
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
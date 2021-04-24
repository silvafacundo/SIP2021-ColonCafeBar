import Vue from 'vue';

const state = () => ({
	user: null,
	token: null
});

const getters = {
	isAuth: (state) => state.user && state.token,
	token: state => localStorage.getItem('auth-token'),
	user: state => state.user
};
const mutations = {
	setUser(state, payload) {
		state.user = { ...payload };
	}
};
const actions = {
	async checkToken({ getters, commit }) {
		if (getters.token) {
			setAuthorizationHeader(getters.token);
			const response = await Vue.axios.get('/me');
			if (response.data.user) {
				commit('setUser', response.data.user)
			}
		}
	},
	async login({ dispatch }, { email, password }) {
		const response = await Vue.axios.post('/auth/login', { email, password });
		const token = response.data.payload;
		persistToken(token);
		setAuthorizationHeader(token);
		await dispatch('checkToken');

	},
	async register(_, payload) {
		const response = await Vue.axios.post('/auth/register', { ...payload })
		return response.data;
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

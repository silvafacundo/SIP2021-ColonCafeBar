import Vue from 'vue';
import router from '../../router';

const state = () => ({
	users: []
});

const getters = {
	users: state => state.users
};
const mutations = {
	setUsers(state, payload) {
		state.users = [...payload];
	},
};
const actions = {
	async fetchUsers({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/users');
			console.log(response)
			if (response.data.users)
				commit('setUsers', response.data.users);
		} catch (err) {
			console.error('Failed to fetch users');
			throw err;
		}
	}
};


export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
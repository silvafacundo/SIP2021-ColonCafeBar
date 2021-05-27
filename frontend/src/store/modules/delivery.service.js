
import Vue from 'vue';
import router from '../../router';

const state = () => ({
	deliveries: []
});

const getters = {
	deliveries: state => state.deliveries
};
const mutations = {
	setDeliveries(state, deliveries) {
		state.deliveries = deliveries || [];
	}
};
const actions = {
	async fetchDeliveries({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/deliveries');
			const deliveries = response.data.payload;
			commit('setDeliveries', deliveries);
			return deliveries;
		} catch (err) {
			console.error('Falied to fetch deliveries', err);
			throw err;
		}
	},
	async createDelivery({ dispatch }, { name, lastName, phoneNumber }) {
		try {
			await Vue.axios.post('/admin/delivery', { name, lastName, phoneNumber });
			await dispatch('fetchDeliveries');
		} catch (err) {
			console.error('Falied to fetch deliveries', err);
			throw err;
		}
	},
	async updateDelivery({ dispatch }, { id, name, lastName, phoneNumber }) {
		try {
			await Vue.axios.put('/admin/delivery', {
				id,
				name,
				lastName,
				phoneNumber
			});
			await dispatch('fetchDeliveries');
		} catch (err) {
			console.error('Falied to update delivery', err);
			throw err;
		}
	},
	async deleteDelivery({ dispatch }, { id }) {
		try {
			await Vue.axios.delete('admin/delivery', {
				params: { id }
			});
			await dispatch('fetchDeliveries');
		} catch (err) {
			console.error('Falied to delete delivery', err);
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
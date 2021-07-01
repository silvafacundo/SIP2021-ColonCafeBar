
import Vue from 'vue';

const state = () => ({
	config: {}
});

const getters = {
	config: state => state.config
};
const mutations = {
	setConfig(state, config) {
		state.config = config || {};
	}
};
const actions = {
	async fetchConfig({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/store');
			if (response.data.store)
				commit('setConfig', response.data.store);
		} catch (err) {
			console.error('Failed to fetch store config', err);
			throw err;
		}
	},
	async updateConfig({ dispatch }, { minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm, coordinates, orderTimeoutMinutes }) {
		try {
			await Vue.axios.put('/admin/store', { minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm, coordinates, orderTimeoutMinutes });
			await dispatch('fetchConfig');
		} catch (err) {
			console.error('Failed to update store config', err);
			throw err;
		}
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
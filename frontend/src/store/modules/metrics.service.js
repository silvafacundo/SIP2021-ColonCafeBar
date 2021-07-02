
import Vue from 'vue';

const state = () => ({
	metrics: {}
});

const getters = {
	metrics: state => state.metrics
};
const mutations = {
	setMetrics(state, metrics) {
		state.metrics = metrics || {};
	}
};
const actions = {
	async fetchMetrics({ commit }, { fromDate, toDate }) {
		try {
			const response = await Vue.axios.post('/admin/metrics', {
				fromDate,
				toDate,
			});

			if (response.data.metrics)
				commit('setMetrics', response.data.metrics);
			return response.data.metrics
		} catch (err) {
			console.error('Failed to fetch metrics', err);
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
import Vue from 'vue';
import router from '../../router';

const state = () => ({
	schedules: [],
});

const getters = {
	schedules: state => state.schedules,
};
const mutations = {
	setSchedules(state, schedules) {
		state.schedules = schedules || [];
	}
};
const actions = {
	async fetchAdminSchedules({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/schedules');
			const schedules = response.data;
			commit('setSchedules', schedules);
			return schedules;
		} catch (err) {
			console.error('Failed to fetch admin schedules', err);
			throw err;
		}
	},
	async fetchAdminSchedule(context, { id }) {
		try {
			const response = await Vue.axios.get(`/admin/schedules?id=${id}`);
			return response.data;
		} catch (err) {
			console.error('Failed to fetch schedule', err)
			throw err;
		}
	},
	async createSchedule({ dispatch }, { openingTime, closingTime, dayOfWeek }){
		try {
			await Vue.axios.post('/admin/schedule', { openingTime, closingTime, dayOfWeek });
			dispatch('fetchAdminSchedules');
		} catch (err) {
			console.error('Failed to create schedule', err)
			throw err;
		}
	},
	async updateSchedule({ dispatch }, { id, openingTime, closingTime, dayOfWeek }){
		try {
			await Vue.axios.put('/admin/schedules', { id, openingTime, closingTime, dayOfWeek });
			dispatch('fetchAdminSchedules');
		} catch (err) {
			console.error('Failed to update schedule', err)
			throw err;
		}
	},
	async deleteSchedule({ dispatch }, { id }){
		try {
			await Vue.axios.delete(`/admin/schedule?id?=${id}`);
			dispatch('fetchaAdminSchedules');
		} catch (err) {
			console.error('Failed to create schedule', err)
			throw err;
		}
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
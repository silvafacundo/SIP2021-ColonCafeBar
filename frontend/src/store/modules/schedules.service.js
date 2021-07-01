import Vue from 'vue';
import router from '../../router';

const state = () => ({
	schedules: [],
	isOpen: null,
	daySchedule: []
});

const getters = {
	schedules: state => state.schedules,
	isOpen: state => state.isOpen,
	daySchedule: state => state.daySchedule || []
};
const mutations = {
	setSchedules(state, schedules) {
		state.schedules = schedules || [];
	},
	setIsOpen(state, isOpen) {
		state.isOpen = isOpen;
	},
	setDaySchedule(state, schedule) {
		state.daySchedule = schedule || [];
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
			await dispatch('fetchAdminSchedules');
		} catch (err) {
			console.error('Failed to create schedule', err)
			throw err;
		}
	},
	async updateSchedule({ dispatch }, { id, openingTime, closingTime, dayOfWeek }){
		try {
			await Vue.axios.put('/admin/schedule', { id, openingTime, closingTime, dayOfWeek });
			await dispatch('fetchAdminSchedules');
		} catch (err) {
			console.error('Failed to update schedule', err)
			throw err;
		}
	},
	async deleteSchedule({ dispatch }, { scheduleId }){
		try {
			await Vue.axios.delete(`/admin/schedule?id=${scheduleId}`);
			await dispatch('fetchAdminSchedules');
		} catch (err) {
			console.error('Failed to create schedule', err)
			throw err;
		}
	},
	async fetchStoreStatus({ commit }) {
		try {
			const response = await Vue.axios.get('/isopen');
			const { isOpen, schedules } = response.data || {};
			commit('setDaySchedule', schedules)
			commit('setIsOpen', isOpen);
		} catch (err) {
			console.error('Failed to fetch isOpen', err);
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
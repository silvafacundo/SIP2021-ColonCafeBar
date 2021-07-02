
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
	async createAddress({ dispatch }, { ...values }) {
		try {
			await Vue.axios.post('/address', { ...values });
			await dispatch('Auth/checkClientToken', null, { root: true });
		} catch (err) {
			console.error('Falied to create address', err);
			throw err;
		}
	},
	async updateAddress({ dispatch }, { addressId, ...values }) {
		try {
			await Vue.axios.put('/address', {
				addressId,
				...values
			});
			await dispatch('Auth/checkClientToken', null, { root: true });
		} catch (err) {
			console.error('Falied to update address', err);
			throw err;
		}
	},
	async deleteAddress({ dispatch }, { addressId }) {
		try {
			await Vue.axios.delete('/address', {
				params: { addressId }
			});
			await dispatch('Auth/checkClientToken', null, { root: true });
		} catch (err) {
			console.error('Falied to delete delivery', err);
			throw err;
		}
	},
	async updateClient({ dispatch }, { ...values }) {
		try {
			await Vue.axios.put('/client', { ...values });
			await dispatch('Auth/checkClientToken', null, { root: true });
		} catch (err) {
			console.error('Failed to update client', err);
			throw err;
		}
	},
	async fetchClients({ dispatch }, { page, perPage, filters }) {
		try {
			const response = await Vue.axios.post('/admin/clients', { page, perPage, filters });
			return response.data
		} catch (err) {
			console.error('Failed to fetch clients')
			throw err;
		}
	},
	async updatePoints(ctx, { clientId, points }) {
		try {
			const response = await Vue.axios.put(`/admin/client/${clientId}/points`, { points });
			return response.data;
		} catch (err) {
			console.error('failed to update client points');
			throw err;
		}
	},
	async adminUpdateClient(ctx, { clientId, ...values }) {
		try {
			const response = await Vue.axios.put(`/admin/client/${clientId}`, { ...values });
		} catch (err) {
			console.error('failed to update client');
			throw err;
		}
	},
	async revokeTokenAccess(ctx, { clientId }) {
		try {
			const response = await Vue.axios.delete(`/admin/client/${clientId}/token`);
		} catch (err) {
			console.error('Failed to revoke client tokens');
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
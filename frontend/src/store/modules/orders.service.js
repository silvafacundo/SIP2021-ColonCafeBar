import Vue from 'vue';
import router from '../../router';

const state = () => ({
	orders: [],
	// TODO hay que cambiar esto maybe
	possibleStatus: []
});

const getters = {
	orders: state => state.orders,
	possibleStatus: state => state.possibleStatus
};
const mutations = {
	setOrders(state, orders) {
		state.orders = orders || [];
	},
	setPossibleStatus(state, possibleStatus = []) {
		possibleStatus = possibleStatus.sort((a, b) => b.priorityService - a.priorityService)
		state.possibleStatus = possibleStatus;
	}
};
const actions = {
	async fetchOrders({ commit }, { page, perPage, filters, orderBy } ) {
		try {
			const response = await Vue.axios.post('/admin/orders', { page, perPage, filters, orderBy });
			const { orders, status, pagination } = response.data;
			commit('setOrders', orders);
			commit('setPossibleStatus', status);
			return { orders, pagination };
		} catch (err) {
			console.error('Failed to fetch orders', err);
			throw err;
		}
	},
	async fetchOrder(context, { orderId }) {
		try {
			const response = await Vue.axios.get(`/order?orderId=${orderId}`);
			return response.data.order;
		} catch (err) {
			console.error('Failed to fetch order', err)
			throw err;
		}
	},
	async fetchClientOrders({ commit }, { page, perPage, filters, orderBy } = {}) {
		try {
			const response = await Vue.axios.post('/client/orders', { page, perPage, filters, orderBy });
			const { orders = [], pagination = {}, status } = response.data || {};
			commit('setPossibleStatus', status);
			commit('setOrders', orders);
			return { orders, pagination };
		} catch (err) {
			console.error('Failed to fetch client orders', err);
			throw err;
		}
	},
	async createOrder( context, { paymentMethod, withDelivery, addressId, products }) {
		try {
			const response = await Vue.axios.post('/order', { paymentMethod, withDelivery, addressId, products })
			return response.data.order;
		} catch (err) {
			console.error('Failed to create order', err);
			throw err;
		}
	},
	async updateOrder({ dispatch }, { orderId, statusId, isPaid, deliveryId }) {
		try {
			await Vue.axios.put('/admin/order', {
				orderId,
				statusId,
				isPaid,
				deliveryId
			});
		} catch (err) {
			console.error('Failed to update order', err);
			throw err;
		}
	},
	async clientCancelOrder({ dispatch }, { orderId }) {
		try {
			await Vue.axios.post('/order/cancel', {
				orderId
			});
		} catch (err) {
			console.error('Failed to update order', err);
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
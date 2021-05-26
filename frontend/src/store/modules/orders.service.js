import Vue from 'vue';
import router from '../../router';

const state = () => ({
	orders: [],
	// TODO hay que cambiar esto maybe
	possibleStatus: [
		'Pendiente a ser aceptado',
		'En preparación',
		'En camino',
		'Esperando a ser retirado',
		'Entregado',
		'Cancelado'
	]
});

const getters = {
	orders: state => state.orders,
	possibleStatus: state => state.possibleStatus
};
const mutations = {
	setOrders(state, orders) {
		state.orders = orders || [];
	}
};
const actions = {
	async fetchOrders({ commit }, { page, perPage, filters, orderBy } ) {
		try {
			const response = await Vue.axios.post('/admin/orders', { page, perPage, filters, orderBy });
			const orders = response.data.orders;
			commit('setOrders', orders);
			return orders;
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
	async createOrder( context, { paymentMethod, withDelivery, addressId, products }) {
		try {
			const response = await Vue.axios.post('/order', { paymentMethod, withDelivery, addressId, products })
			return response.data.order;
		} catch (err) {
			console.error('Failed to create order', err);
			throw err;
		}
	},
	async updateOrder({ dispatch }, { orderId, status, isPaid, deliveryId }) {
		try {
			await Vue.axios.put('/admin/order', {
				orderId,
				status,
				isPaid,
				deliveryId
			});
			//await dispatch('fetchOrders');
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
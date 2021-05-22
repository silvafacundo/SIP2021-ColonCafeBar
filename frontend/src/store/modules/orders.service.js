import Vue from 'vue';
import router from '../../router';

const state = () => ({
	orders: []
});

const getters = {
	orders: state => state.orders
};
const mutations = {
	setOrders(state, orders) {
		state.orders = orders || [];
	}
};
const actions = {
	async fetchOrders({ commit } ) {
		try {
			const response = await Vue.axios.get('/admin/orders');
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
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
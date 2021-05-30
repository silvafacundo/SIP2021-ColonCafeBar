import Vue from 'vue';
import router from '../../router';

const state = () => ({
	cart: JSON.parse(localStorage.getItem('cart')) || {}
});

const getters = {
	cart: state => state.cart,
	items: state => {
		let count = 0;
		for (const key in state.cart) {
			count += state.cart[key];
		}
		return count;
	}
};
const mutations = {
	updateCart(state, { productId, amount = 1 }) {
		const newCart = { ...state.cart };
		if (typeof newCart[productId] !== 'number')
			newCart[productId] = 0;
		newCart[productId] += amount || 1;
		if (newCart[productId] <= 0) delete newCart[productId];
		localStorage.setItem('cart', JSON.stringify(newCart));
		state.cart = newCart;
	},
	emptyCart(state) {
		const newCart = {};
		localStorage.setItem('cart', JSON.stringify(newCart));
		state.cart = newCart;
	}
};
const actions = {

};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
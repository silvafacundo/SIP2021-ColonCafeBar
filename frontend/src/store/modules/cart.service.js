import Vue from 'vue';
import router from '../../router';

function getCart() {
	const cart = JSON.parse(localStorage.getItem('cart'));
	if (!Array.isArray(cart)) return [];
	return cart;
}
const state = () => ({
	cart: getCart()
});

const getters = {
	cart: state => state.cart,
	items: state => {
		let count = 0;
		for (const product of state.cart) {
			count += product.amount;
		}
		return count;
	}
};
const mutations = {
	addToCart(state, config) {
		const newCart = [...state.cart];
		if (typeof config.productId === 'undefined' || config.productId === null) return;
		if (isNaN(config.amount) || typeof config.amount !== 'number' || config.amount < 1) return;
		newCart.push(config);
		localStorage.setItem('cart', JSON.stringify(newCart));
		state.cart = newCart;
	},
	deleteIndex(state, index) {
		if (index < 0 || index >= state.cart.length) return;
		const newCart = [...state.cart];
		newCart.splice(index, 1);
		localStorage.setItem('cart', JSON.stringify(newCart));
		state.cart = newCart;
	},
	emptyCart(state) {
		const newCart = [];
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
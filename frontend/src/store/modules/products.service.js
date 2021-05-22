
import Vue from 'vue';
import router from '../../router';

const state = () => ({
	products: []
});

const getters = {
	products: state => state.products
};
const mutations = {
	setProducts(state, products) {
		state.products = products || [];
	}
};
const actions = {
	async fetchProducts({ commit } ) {
		try {
			const response = await Vue.axios.get('/products');
			const products = response.data.products;
			commit('setProducts', products);
			return products;
		} catch (err) {
			console.error('Failed to fetch products', err);
			throw err;
		}
	},
	async fetchProduct(context, { productId }) {
		try {
			const response = await Vue.axios.get(`/product?productId=${productId}`);
			return response.data.product;
		} catch (err) {
			console.error('Failed to fetch product', err)
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

import Vue from 'vue';
import router from '../../router';

const state = () => ({
	products: [],
	categories: [],
});

const getters = {
	products: state => state.products,
	categories: state => state.categories
};
const mutations = {
	setProducts(state, products) {
		state.products = products || [];
	},
	setCategories(state, categories) {
		state.categories = categories || [];
	},
};
const actions = {
	async fetchProducts({ commit }, { filters, page, perPage, orderBy } = {} ) {
		try {
			const response = await Vue.axios.post('/products', { filters, page, perPage, orderBy });
			const products = response.data.products;
			commit('setProducts', products);
			return products;
		} catch (err) {
			console.error('Failed to fetch products', err);
			throw err;
		}
	},
	async fetchAdminProducts({ commit }, { filter, page, perPage, orderBy } = {}) {
		try {
			const response = await Vue.axios.post('/admin/products', { filter, page, perPage, orderBy });
			const products = response.data.products;
			commit('setProducts', products);
			return products;
		} catch (err) {
			console.error('Failed to fetch admin products', err);
			throw err;
		}
	},
	async fetchProduct(context, { productId }) {
		try {
			const response = await Vue.axios.get(`/product?productId=${productId}`);
			return response.data.payload;
		} catch (err) {
			console.error('Failed to fetch product', err)
			throw err;
		}
	},
	async fetchCategories({ commit }) {
		try {
			const response = await Vue.axios.get('/categories');
			const categories = response.data.categories;
			commit('setCategories', categories);
			return categories;
		} catch (err) {
			console.error('Failed to fetch categories', err)
			throw err;
		}
	},
	async createCategory({ dispatch }, { name }){
		try {
			await Vue.axios.post('/admin/category', { name });
			dispatch('fetchCategories');
		} catch (err) {
			console.error('Failed to create category', err)
			throw err;
		}
	},
	async updateCategory({ dispatch }, { categoryId, name }){
		try {
			await Vue.axios.put('/admin/category', { id: categoryId, name });
			dispatch('fetchCategories');
		} catch (err) {
			console.error('Failed to update category', err)
			throw err;
		}
	},
	async deleteCategory({ dispatch }, { categoryId }){
		try {
			await Vue.axios.delete('/admin/category', {
				params: { id: categoryId }
			});
			dispatch('fetchCategories');
		} catch (err) {
			console.error('Failed to create category', err)
			throw err;
		}
	},
	async updateProduct({ dispatch }, { productId, ...values }) {
		console.log({ ...values });
		try {
			const response = await Vue.axios.put(`/admin/product`, {
				productId,
				...values,
			});
			await dispatch('fetchAdminProducts');
			return response.data.payload;
		} catch (err) {
			console.error('Failed to update product', err);
			throw err;
		}
	},
	async createProduct({ dispatch }, { ...values }) {
		try {
			const response = await Vue.axios.post(`/admin/product`, {
				...values
			});
			await dispatch('fetchAdminProducts');
			return response.data.payload;
		} catch (err) {
			console.error('Failed to create product', err);
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
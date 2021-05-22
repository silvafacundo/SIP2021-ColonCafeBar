<template>
	<div>
		<h1>Colón Café Bar</h1>
		{{ user }}
		<hr>
		{{ products }}
		<router-link to="/login">Login</router-link>
	</div>
</template>

<script>
export default {
	name: 'Home',
	data: () => ({
		isLoading: true,
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'];
		},
		user() {
			return this.$store.getters['Auth/clientUser'];
		}
	},
	mounted() {
		this.fecthProducts();
	},
	methods: {
		async fecthProducts() {
			try {
				this.isLoading = true;
				await this.$store.dispatch('Products/fetchProducts');
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al cargar los productos', true);
			}
		}
	},

}
</script>

<style>

</style>
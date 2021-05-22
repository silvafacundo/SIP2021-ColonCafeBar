<template>
	<div>
		<h1>Colón Café Bar</h1>
		{{ user }}
		<hr>
		<div class="container">
			<div class="products-container">
				<product v-for="(product, key) in products"
					:key="key"
					:name="product.name"
					:price="product.price"
					:description="product.description" />
			</div>
		</div>
		<!--<router-link to="/login">Login</router-link>-->
	</div>
</template>

<script>
//import EditableText from '../../components/EditableText';
import Product from '../components/Product.vue';
export default {
	name: 'Home',
	components: {
		Product,
	},
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

<style scoped lang="scss">
	.products-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
<template>
	<div class="container">
		<b-field>
			<b-input v-model="filters.query"
				placeholder="Buscar..."
				type="search"
				icon="search"
				:loading="isLoading || isSearching"
				icon-clickable
				@input="searchProduct"
			/>
		</b-field>
		<div class="products-container">
			<product v-for="(product, key) in products"
				:key="key"
				:product="product"
				@click="() => selectedProduct = product" />
			<h4 v-if="products.length <= 0" class="no-result">No se han encontrado resultados</h4>
		</div>
		<b-modal :active="!!selectedProduct" @close="closeModal">
			<product-selector v-if="selectedProduct"
				:product="selectedProduct"
				@addToCart="closeModal"
				@cancel="closeModal" />
		</b-modal>
	</div>
</template>

<script>
//import EditableText from '../../components/EditableText';
import Product from '../components/Product.vue';
import ProductSelector from '../components/ProductSelector';
export default {
	name: 'Products',
	components: {
		Product,
		ProductSelector,
	},
	data: () => ({
		isLoading: true,
		isSearching: false,
		selectedProduct: null,
		filters: {
			query: ''
		},
		searchTimeout: null,
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'];
		},
		cart() {
			return this.$store.getters['Cart/cart'];
		},
		categories() {
			return [];
		},
		cartLength() {
			return this.$store.getters['Cart/items'];
		}
	},
	mounted() {
		this.fecthProducts();
	},
	methods: {
		async fecthProducts() {
			try {
				this.isLoading = true;
				await this.$store.dispatch('Products/fetchProducts', { filters: this.filters });
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al cargar los productos', true);
			}
		},
		addToCart() {
			const amount = 1;
			this.$store.commit('Cart/addToCart', { productId: this.selectedProduct.id, amount });
			this.closeModal();
			const message = amount > 1 ? 'Producto agregado al carrito': 'Productos agregado al carrito';
			this.$showToast(message);
		},
		searchProduct() {
			if (this.searchTimeout) clearTimeout(this.searchTimeout);
			this.isSearching = true;
			this.searchTimeout = setTimeout(()=> {
				this.fecthProducts();
				this.isSearching = false;
			}, 500);
		},
		closeModal() {
			this.selectedProduct = null;
		}
	},

}
</script>

<style scoped lang="scss">
	.products-container {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));;
		.no-result {
			grid-column: 1/-1;
			color: white;
		}
	}
	@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
	}
</style>
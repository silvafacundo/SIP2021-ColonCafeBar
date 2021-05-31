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
			<div v-if="selectedProduct" class="card selected-product">
				<div v-if="selectedProduct.imageUrl" class="image-container">
					<img :src="selectedProduct.imageUrl" :alt="selectedProduct.name">
				</div>
				<h3>{{ selectedProduct.name }}</h3>
				<p class="description">{{ selectedProduct.description }}</p>
				<p class="price">${{ selectedProduct.price }}</p>
				<b-button type="is-success" @click="addToCart"> Agregar al Carrito</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
//import EditableText from '../../components/EditableText';
import Product from '../components/Product.vue';
export default {
	name: 'Products',
	components: {
		Product,
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
			this.$store.commit('Cart/updateCart', { productId: this.selectedProduct.id, amount });
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
	.selected-product {
		padding: 20px;
		h3 {
			color: black;
		}
		.image-container {
			text-align: center;
			background-color: rgba(0,0,0,.1);
			img {
				object-fit: cover;
				width: auto;
				max-height: 250px;
			}
		}
		.description {
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			line-height: 18px;
			color: rgb(88, 80, 101);
			margin-top: 10px;
		}
		.price {
			font-size: 18px;
			font-weight: 700;
			margin-top: 8px;
		}
	}
</style>
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
		<div class="categories-container">
			<div v-for="(category,keyc) in renderProducts"
				:key="keyc"
				class="category-container">
				<h2> {{ category.category }} </h2>
					<div class="product-container">
						<product v-for="(product, key) in category.products"
						:key="key"
						:product="product"
						@click="() => selectedProduct = product"
						/>
					</div>
			</div>
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
			return this.$store.getters['Products/categories'];
		},
		cartLength() {
			return this.$store.getters['Cart/items'];
		},
		renderProducts(){
			let categories = this.categories,
				products = this.products,
				categoryProducts = [];
			for (const category of categories) {
				let prod = products.filter((product)=>{
					return product.category.name === category.name
				});
				categoryProducts.push({
					'category': category.name,
					'products': prod
				});
			}
			return categoryProducts;
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
				await this.$store.dispatch('Products/fetchCategories');
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al cargar los productos', true);
			}
		},
		addToCart() {
			const amount = 1;
			this.$store.commit('Cart/addToCart', { productId: this.selectedProduct.id, amount });
			this.closeModal();
			const message = amount > 1 ? 'Producto agregado al carrito': 'Producto agregado al carrito';
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
	.categories-container{

		.category-container {
			display: block;
			margin-bottom: 2em;
				h2{
					color:#fafafa;
					font-family: Holtzberg-Regular;
					font-size: 1.5em;
					margin-bottom: 1em;
					padding-bottom: .5em;
					border-bottom:1px solid #fafafa;
					user-select: none;
				}
				.product-container{
					display: grid;
					// gap: 1rem;
					grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
					.no-result {
						grid-column: 1/-1;
						color: white;
					}
				}
		}
	}
	@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
	}
</style>
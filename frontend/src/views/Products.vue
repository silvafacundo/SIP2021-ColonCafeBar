<template>
	<div class="container">
		<div class="filters-container">
			<div class="filters">
				<b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
						<template #trigger="props">
							<div
								class="card-header"
								role="button"
								aria-controls="contentIdForA11y3">
								<p class="card-header-title">
									<b-icon
									pack="fas"
									icon="filter"
									size="is-small">
									</b-icon>
									Filtros
								</p>
								<a class="card-header-icon">
									<b-icon
										:icon="props.open ? 'caret-down' : 'caret-up'">
									</b-icon>
								</a>
							</div>
						</template>

						<div class="card-content">
							<div class="content">
								<h3>Categorías</h3>
								<b-field v-for="(category, key) in renderProducts"
									:key="key">
									<b-checkbox @input="searchCategory(category.idcategory)"
										v-if="category && category.products && category.products.length > 0"
									>{{ category.category }}</b-checkbox>
								</b-field>
								<h3>Precios</h3>
								<b-field>
									<b-input v-model="filters.fromPrice"
										placeholder="Precio desde"
										type="number"
										:loading="isLoading || isSearching"
										lazy
										size="is-small"
										class="price-filter"
										@input="searchProduct"
									/>
								</b-field>
								<b-field>
									<b-input v-model="filters.toPrice"
										placeholder="Precio hasta"
										type="number"
										:loading="isLoading || isSearching"
										lazy
										size="is-small"
										class="price-filter"
										@input="searchProduct"
									/>
								</b-field>
							</div>
						</div>
					</b-collapse>
				<!-- <h2><b-icon
					pack="fas"
					icon="filter"
					size="is-small">
					</b-icon>
					Filtros</h2>
				<h3>Categorías</h3>
				<b-field v-for="(category, key) in categories"
					:key="key">
					<b-checkbox @input="searchCategory(category.id)">{{ category.name }}</b-checkbox>
				</b-field>
				<h3>Precios</h3>
				<b-field>
					<b-input v-model="filters.fromPrice"
						placeholder="Precio desde"
						type="number"
						:loading="isLoading || isSearching"
						lazy
						size="is-small"
						class="price-filter"
						@input="searchProduct"
					/>
				</b-field>
				<b-field>
					<b-input v-model="filters.toPrice"
						placeholder="Precio hasta"
						type="number"
						:loading="isLoading || isSearching"
						lazy
						size="is-small"
						class="price-filter"
						@input="searchProduct"
					/>
				</b-field>-->
			</div>
		</div>
		<div class="products-container">
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
				<b-collapse v-for="(category,keyc) in renderProducts"
					:key="keyc"
					class="card category-container"
					animation="slide"
					aria-id="contentIdForA11y3">
					<template v-if="category && category.products && category.products.length > 0" #trigger="props">
						<div
							class="card-header"
							role="button"
							aria-controls="contentIdForA11y3">
							<h2 class="card-header-title">
								{{ category.category }}
							</h2>
							<a class="card-header-icon">
								<b-icon
									:icon="props.open ? 'caret-down' : 'caret-up'" />
							</a>
						</div>
					</template>
					<div v-if="category && category.products && category.products.length > 0" class="card-content">
						<div class="content producto-container">
							<product v-for="(product, key) in category.products"
								:key="key"
								:product="product"
								class="product"
								@click="() => selectedProduct = product" />
						</div>
					</div>
				</b-collapse>
				<h4 v-if="products.length <= 0" class="no-result">No se han encontrado resultados</h4>
			</div>
			<b-modal :active="!!selectedProduct" @close="closeModal">
				<product-selector v-if="selectedProduct"
					:product="selectedProduct"
					@addToCart="closeModal"
					@cancel="closeModal" />
			</b-modal>
		</div>
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
		ProductSelector
	},
	data: () => ({
		isLoading: true,
		isSearching: false,
		selectedProduct: null,
		filters: {
			query: '',
			categoriesId: [],
			fromPrice: null,
			toPrice: null,
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
					'idcategory': category.id,
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
		searchCategory(categoryId) {
			const categoryIndex = this.filters.categoriesId.indexOf(categoryId);
			if (categoryIndex !== -1) this.filters.categoriesId.splice(categoryIndex, 1)
			else this.filters.categoriesId.push(categoryId);
			this.searchProduct();
		},
		closeModal() {
			this.selectedProduct = null;
		}
	},

}
</script>

<style scoped lang="scss">
.container {
	margin: 0;
	display: flex;
	flex-wrap: wrap;
	padding: 2rem 0;
}
.filters-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	color: white;
	.filters {
		padding: 0 4rem;

		h2 {
			margin-bottom: 1rem;
			padding: 0;
			color: white;
		}

		a{
			color: rgb(30,30,30);
		}
		h3 {
			font-size: 1em;
			margin-bottom: .7rem;
		}
		::v-deep .price-filter input {
			background-color: transparent;
			border-radius: 20px;
			border: 2px solid;
			color: white;
		}
		::v-deep .price-filter input::placeholder {
			color: black;
		}
	}
}
.products-container {
	flex: 2;
}
.categories-container{
	border: none;
	box-shadow: none;
	.category-container {
		display: block;
		margin-bottom: .5em;
		background-color: transparent;
		border: none;
		box-shadow: none;
		::v-deep .card-content {
			padding: 1.5rem 0;
		}
		.card-header {
			border: none;
			box-shadow: none;
		}

			h2 {
				color: #fafafa;
				font-family: 'Noto Sans JP', 'sans-serif';
				text-transform: uppercase;
				font-size: 1.5em;
				border-bottom:1px solid #fafafa;
				user-select: none;
			}
			a {
				color: #fafafa;
				border-bottom:1px solid #fafafa;
			}
			.producto-container{
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
				grid-gap: 1em;
				.no-result {
					grid-column: 1/-1;
					color: white;
				}

				.product{
					display: block;
					border:1px solid black;
					box-shadow: 10px 10px 17px -11px rgba(0,0,0,0.55);
					transition: .8s box-shadow;
				}

			}
	}
}

@media (max-width: 900px){
	div.container{
		padding: 0;
		width: 95%;
		margin:auto;

		.filters-container{
			margin-bottom: 1em;

			.filters{
				padding: 0;
			}
		}
	}
}
</style>
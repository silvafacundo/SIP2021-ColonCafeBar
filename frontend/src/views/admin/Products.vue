<template>
	<div class="container">
		<h3>Productos</h3>
		<b-table :data="products" @click="row => selectedProduct = { ...row }">
			<!-- <b-table-column>
				<img src="https://http.cat/420.jpg"
					alt="Imágen del producto">
			</b-table-column> -->
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Nombre">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props" label="Descripción">
				{{ props.row.description }}
			</b-table-column>
			<b-table-column v-slot="props" label="Price">
				${{ props.row.price }}
			</b-table-column>
			<b-table-column v-slot="props" label="Visible">
				<b-checkbox :native-value="props.row.isActive"
					:value="props.row.isActive"
					@click.native.prevent="() => saveProduct(props.row.id, 'isActive', !props.row.isActive)" />
			</b-table-column>
		</b-table>
		<b-button type="is-success" @click="newProduct">
			Nuevo Producto
		</b-button>
		<b-modal :active="!!selectedProduct" @close="closeModal">
			<div v-if="selectedProduct" class="card selected-product">
				<EditableImage class="test" src="http://http.cat/420.jpg" />
				<b-field label="Nombre">
					<b-input v-model="selectedProduct.name" />
				</b-field>
				<b-field>
					<b-checkbox v-model="selectedProduct.isActive">Visible</b-checkbox>
				</b-field>
				<b-field label="Precio">
					<b-input v-model="selectedProduct.price"
						icon="dollar-sign"
						min="0"
						type="number" />
				</b-field>
				<b-field label="Categoría">
					<b-dropdown v-model="selectedProduct.idCategory">
						<b-button slot="trigger"
							icon-right="caret-down">
							{{ selectedProduct.idCategory ? categories.find(category => category.id === selectedProduct.idCategory ).name : 'Seleccione una opción' }}
						</b-button>
						<b-dropdown-item v-for="category in categories"
							:key="category.id"
							:value="category.id">
							{{ category.name }}
						</b-dropdown-item>
					</b-dropdown>
				</b-field>
				<b-field label="Descripcion">
					<b-input v-model="selectedProduct.description" type="textarea" />
				</b-field>
				<b-button type="is-danger"
					:disabled="isLoading"
					@click="closeModal">
					Cancelar
				</b-button>
				<b-button type="is-success"
					:loading="isLoading"
					@click="saveProduct">
					Guardar
				</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import EditableImage from '../../components/EditableImage.vue';
export default {
	name: 'Products',
	components: {
		EditableImage
	},
	data: () => ({
		isLoading: false,
		selectedProduct: null,
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'].map(product => ({ ...product, idCategory: product.category.id }));
		},
		categories() {
			return this.$store.getters['Products/categories'];
		}
	},
	mounted() {
		this.fetchProducts();
		this.$store.dispatch('Products/fetchCategories');
	},
	methods: {
		async fetchProducts() {
			try {
				await this.$store.dispatch('Products/fetchAdminProducts') || [];
			} catch (err) {
				console.log(err);
				this.$showToast('Error al traer los productos', true);
			}
		},
		async updateProductValue(productId, key, value) {
			try {
				await this.$store.dispatch('Products/updateProduct', {
					productId,
					[key]: value
				});
			} catch (err) {
				this.$showToast('Error al actualizar el producto', true);
			}
		},
		async newProduct() {
			this.selectedProduct = {
				name: '',
				idCategory: null,
				description: '',
				isActive: true,
				variants: {
					nombre: [
						'hola',
						'chau',
						'con queso'
					]
				},
				price: 0,
			}
		},
		async saveProduct() {
			if (!this.selectedProduct) return;
			try {
				this.isLoading = true;

				if (this.selectedProduct.id)
					await this.$store.dispatch('Products/updateProduct', {
						productId: this.selectedProduct.id,
						...this.selectedProduct
					});
				else
					await this.$store.dispatch('Products/createProduct', {
						...this.selectedProduct
					});
				this.closeModal();
				this.$showToast('Producto actualizado');
			} catch (err) {
				this.$showToast('Error al actualizar el producto', true);
			}
			this.isLoading = false;
		},
		async closeModal() {
			return this.selectedProduct = null;
		}
	}
}
</script>

<style lang="scss" scoped>
	div.container {
		text-align: center;
		> ::v-deep button {
			display: flex;
			margin-left: auto;
			margin-top: .5rem;
		}
		.selected-product {
			color: black;
			padding: 20px;
			text-align: left;
			.test {
				width: 200px;
			}
		}
	}
</style>
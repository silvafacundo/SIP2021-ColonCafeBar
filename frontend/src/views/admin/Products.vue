<template>
	<div class="container">
		<h3>Productos</h3>
		<b-input v-model="filters.query"
			class="mb-2"
			type="search"
			icon="search"
			:loading="isLoading"
			placeholder="Buscar productos..."
			@input="typingSearch" />

		<b-table hoverable
			backend-pagination
			paginated
			:data="products"
			:per-page="pagination.perPage"
			:current-page="pagination.page"
			:total="pagination.total"
			@page-change="pageChange"
			@click="row => selectedProduct = { ...row }">
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
			<template #bottom-left>
				<b-button type="is-success" @click="newProduct">
					Nuevo Producto
				</b-button>
			</template>
		</b-table>
		<b-modal :active="!!selectedProduct" @close="closeModal">
			<div v-if="selectedProduct" class="card selected-product">
				<EditableImage class="test"
					:loading="uploadingImage"
					:src="selectedProduct.imageUrl || ''"
					@file="uploadImage" />
				<b-field label="Nombre">
					<b-input v-model="selectedProduct.name" />
				</b-field>
				<b-field>
					<b-checkbox v-model="selectedProduct.isActive">Visible</b-checkbox>
				</b-field>
				<b-field>
					<b-button
						icon-left="history"
						type="is-success"
						@click="openHistoryPrices()">
						Ver histórico de precios
					</b-button>
				</b-field>
				<b-field label="Precio">
					<b-input v-model="selectedProduct.price"
						icon="dollar-sign"
						min="0"
						type="number" />
				</b-field>
				<b-field label="Precio en puntos">
					<b-input v-model="selectedProduct.pointsPrice"
						icon="parking"
						min="0"
						type="number" />
				</b-field>
				<b-field label="Puntos otorgables">
					<b-input v-model="selectedProduct.grantablePoints"
						icon="parking"
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
				<b-field class="variants-container" label="Variantes">
					<div v-for="(variant, index) of selectedProduct.variants"
						:key="index"
						class="variant">
						<b-field label="Nombre" label-position="on-border">
							<b-input :value="index"
								label="Título"
								lazy
								expanded
								size="is-small"
								@input="value => updateVariantName(value, index)" />
							<b-button
								type="is-danger"
								size="is-small"
								icon-left="times"
								@click="() => deleteProductVariant(index)" />
						</b-field>
						<b-field label="Opciones" label-position="on-border">
							<!-- TODO: Cambiar esto... -->
							<b-taginput v-model="variant.values"
								size="is-small"
								placeholder="Agregar Opción" />
						</b-field>
						<b-field>
							<b-checkbox v-model="variant.required">Obligatorio</b-checkbox>
						</b-field>
					</div>
					<b-button type="is-primary"
						size="is-small"
						:loading="isLoading"
						@click="addProductVariant">
						Agregar variante
					</b-button>
				</b-field>
				<b-field label="Descripcion">
					<b-input v-model="selectedProduct.description" type="textarea" />
				</b-field>
				<div class="buttons-container">
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
					<b-button type="is-danger"
						class="delete-product"
						@click="deleteProduct">
						Eliminar producto
					</b-button>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import EditableImage from '../../components/EditableImage.vue';
import firebase from 'firebase/app';
import 'firebase/storage';
export default {
	name: 'Products',
	components: {
		EditableImage
	},
	data: () => ({
		isLoading: false,
		selectedProduct: null,
		uploadingImage: false,
		searchTimeout: null,
		pagination: {
			page: 1,
			perPage: 20,
		},
		filters: {
			query: ''
		}
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
		async fetchProducts(fromFilters) {
			this.isLoading = true;
			if (fromFilters) {
				this.pagination.page = 1
			}
			try {
				const { pagination } = await this.$store.dispatch('Products/fetchAdminProducts', { ...this.pagination, filters: this.filters });
				this.pagination = { ...this.pagination, ...pagination };
			} catch (err) {
				this.$showToast('Error al traer los productos', true);
			}
			this.isLoading = false;
		},
		async deleteProduct() {
			this.$buefy.dialog.confirm({
				title: 'Eliminando producto',
				message: '<b>¿Seguro que desea eliminar este producto?</b><br><b>Recuerda que no podrás volver a ver ni modificar este producto</b>',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteProduct(),
			});
		},
		async _deleteProduct() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Products/deleteProduct', { productId: this.selectedProduct.id });
				this.closeModal();
				this.$showToast('Producto eliminado con éxito', false);
			} catch (err) {
				this.$showToast('Error al eliminar el producto', true);
			}
			this.isLoading = false;
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
				variants: {},
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
		},
		async uploadImage(e) {
			this.uploadingImage = true;
			try {
				const fileName = `${Date.now()}-${e.name}`
				const ref = firebase.storage().ref().child(fileName);
				const snapshot = await ref.put(e);
				const url = await snapshot.ref.getDownloadURL();
				this.selectedProduct = { ...this.selectedProduct, imageUrl: url };
			} catch (err) {
				console.error('Failed to upload image', err);
				this.$showToast('Error al subir la imágen');
			}
			this.uploadingImage = false;
		},
		updateVariantName(newName, oldName) {
			const newSelectedProduct = { ...this.selectedProduct };
			if (typeof newName === 'string' && newName.length > 0) {
				newSelectedProduct.variants[newName] = { ...newSelectedProduct.variants[oldName] };
				delete newSelectedProduct.variants[oldName];
			}
			this.selectedProduct = newSelectedProduct;
		},
		addProductVariantValue(variantName) {
			const newSelectedProduct = { ...this.selectedProduct };
			newSelectedProduct.variants[variantName].values.push('nuevo');
			this.selectedProduct = newSelectedProduct;
		},
		addProductVariant() {
			const newSelectedProduct = { ...this.selectedProduct };
			if (!newSelectedProduct.variants) newSelectedProduct.variants = {};
			const index = Object.keys(newSelectedProduct.variants).length;
			newSelectedProduct.variants[`Variante ${index + 1}`] = {
				required: false,
				values: ['Opción 1']
			};
			this.selectedProduct = newSelectedProduct;
		},
		deleteProductVariant(variantName) {
			const newSelectedProduct = { ...this.selectedProduct };
			if (newSelectedProduct.variants[variantName]) delete newSelectedProduct.variants[variantName];
			this.selectedProduct = newSelectedProduct;
		},
		deleteProductVariantValue(variantName, variantValue) {
			const newSelectedProduct = { ...this.selectedProduct };
			if (newSelectedProduct.variants[variantName]) {
				const variantValueIndex = newSelectedProduct.variants[variantName].values.indexOf(variantValue);

				if (variantValueIndex !== -1) {
					newSelectedProduct.variants[variantName].values.splice(variantValueIndex, 1);
				}
			}
			this.selectedProduct = newSelectedProduct;
		},
		typingSearch(val) {
			this.isLoading = true;
			clearTimeout(this.searchTimeout);
			this.searchTimeout = setTimeout(() => this.fetchProducts(true), 1000);
		},
		pageChange(page) {
			this.pagination.page = page;
			this.fetchProducts();
		},
		openHistoryPrices() {
			window.open(`${window.location.pathname}/history/${this.selectedProduct.id}`, '_blank');
		}
	}
}
</script>

<style lang="scss" scoped>
	::v-deep .pagination-link:not(.is-current) {
		background-color: white;
	}
	div.container {
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

		::v-deep .variants-container, ::v-deep .variants-container > div > div,  ::v-deep .variants-container > div > div > .variant {
			display: flex;
			flex-flow: column;
			gap: 1rem;
		}
		.variants-container .variant:not(:first-child) {
			border-top: 1px solid rgba(0,0,0,.1);
			padding-top: 1.5rem;
			margin-top: .5rem;
		}

		::v-deep .buttons-container {
			display: flex;
			flex-direction: row;
			gap: 1rem;

			:nth-last-child(1) {
				margin-left: auto;
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
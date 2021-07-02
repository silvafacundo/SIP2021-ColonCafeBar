<template>
	<div class="product">
		<div v-if="product">
			<h3>{{ product.name }} #{{ product.id }}</h3>
			<b-tabs>
				<b-tab-item v-for="(values, key) in priceHistories"
					:key="key"
					:label="getName(key)">
					<b-table :data="values"
						striped>
						<b-table-column v-slot="props"
							label="Fecha de modificación">
							{{ formatDate(props.row.createdAt) }}
						</b-table-column>
						<b-table-column v-slot="props" label="Valor">
							{{ props.row.price }}
						</b-table-column>
						<b-table-column v-if="key === 'productPointsHistory'"
							v-slot="props"
							label="Puntos que otorga">
							{{ props.row.grant }}
						</b-table-column>
					</b-table>
				</b-tab-item>
			</b-tabs>
		</div>
		<div v-else>
			{{ product }}
			<h3>El producto no existe / Ocurrió un error</h3>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		productId: {
			required: true,
			type: String,
			default: undefined
		},
	},
	data: () => ({
		product: null
	}),
	computed: {
		priceHistories() {
			const { productPriceHistory = [], productPointsHistory = [] } = this.product || {};
			return { productPriceHistory, productPointsHistory };
		}
	},
	mounted() {
		this.fetchProduct();
	},
	methods: {
		async fetchProduct() {
			try {
				this.product = await this.$store.dispatch('Products/fetchProductPriceHistory', { productId: this.productId });
			} catch (err) {
				this.$showToast('Error al cargar el historial de precios del producto', true);
			}
		},
		formatDate(date) {
			const formattedDate = (new Date(date)).toLocaleString();
			return formattedDate
		},
		getName(key) {
			const labels = {
				productPriceHistory: 'Histórico de precios',
				productPointsHistory: 'Histórico de puntos'
			}
			return labels[key] || key;
		}
	}
}
</script>

<style lang="scss" scoped>
.product {
	width: 55vw;
	margin:auto;
	padding:3em;
	border: 1px solid black;
	border-radius: 3em;
	background-color: #fafafa;
	text-align: left;

	h3 {
		color: black;
		margin: 1rem 0;
		text-align: center;
	}
}
</style>
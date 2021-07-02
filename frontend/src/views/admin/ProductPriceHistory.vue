<template>
	<div class="product">
		<div v-if="product && product.productHistory">
			<h3>{{ product.name }} #{{ product.id }}</h3>
			<b-table hoverable
				:data="product.productHistory">
				<b-table-column v-slot="props"
					label="Fecha de modificación">
					{{ formatDate(props.row.createdAt) }}
				</b-table-column>
				<b-table-column v-slot="props" label="Precio en $">
					${{ props.row.price }}
				</b-table-column>
				<b-table-column v-slot="props" label="Precio en puntos">
					{{ props.row.pointsPrice }}
				</b-table-column>
				<b-table-column v-slot="props" label="Puntos que otorga">
					{{ props.row.grant }}
				</b-table-column>
			</b-table>
		</div>
		<div v-else>
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
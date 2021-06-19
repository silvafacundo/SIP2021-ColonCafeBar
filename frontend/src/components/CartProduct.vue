<template>
	<div class="product">
		<p class="name">{{ product.name }}</p>
		<p>Precio: ${{ product.price }}</p>
		<p>Cantidad: {{ product.amount }}</p>
		<b-button
			class="delete-product"
			type="is-text"
			icon-left="trash"
			@click="deleteProduct">
			ELIMINAR
		</b-button>
	</div>
</template>

<script>
export default {
	name: 'CartProduct',
	props: {
		product: {
			type: Object,
			required: true
		}
	},
	methods: {
		deleteProduct() {
			this.$emit(this.product);
		}
	}
}
</script>

<style scoped lang="scss">
	.product {
		margin: .5rem 5px;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		justify-content: space-between;
		border-bottom: 1px dotted black;
		.name{
			font-weight: bold;
			color: black;
			font-size: 1rem;
			padding: 0;
		}

		.name::first-letter{
			text-transform: uppercase;
		}

		p {
			color: gray;
			font-size:.9rem;
			margin: .3rem 0;
		}

		.delete-product {
			grid-row: 1/-1;
			grid-column: -1;
		}
	}
</style>
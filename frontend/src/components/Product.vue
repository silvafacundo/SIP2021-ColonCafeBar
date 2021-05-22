<template>
	<div class="product-container">
		<h2>{{ product.name }}</h2>
		<p>{{ product.description }}</p>
		<p>${{ product.price }}</p>
		<b-button type="is-success"
			class="buy"
			@click="addToCart">
			Comprar
		</b-button>
	</div>
</template>

<script>
export default {
	props: {
		product: {
			type: Object,
			required: true
		}
	},
	methods: {
		addToCart() {
			this.$store.commit('Cart/updateCart', { productId: this.product.id, amount: 1 });
		}
	}
}
</script>

<style scoped lang="scss">
.product-container {
	display: flex;
	flex-direction: column;
	min-width: 10rem;
	min-height: 10rem;
	background-color: var(--blanco);
	padding: .2rem;

	h2 {
		text-transform: capitalize;
	}
	.buy {
		margin-top: auto;
	}
}

</style>
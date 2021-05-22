<template>
	<div class="product-container">
		<h2>{{ name }}</h2>
		<p>{{ description }}</p>
		<p>${{ price }}</p>
		<b-button type="is-success" class="buy">Comprar</b-button>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
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
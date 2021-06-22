<template>
	<div class="product-container" @click="() => $emit('click')">
		<div v-if="product.imageUrl">
			<img :src="product.imageUrl" alt="">
		</div>
		<p class="name">{{ product.name }}</p>
		<p class="description" :title="product.description">{{ shortedDescription }}</p>
		<p class="price">${{ product.price }}</p>
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
	computed: {
		shortedDescription() {
			const maxLength = 70;
			if (this.product.description.length <= maxLength) return this.product.description;
			let newDescription = this.product.description.substr(0, maxLength - 3);
			newDescription = newDescription.replace(/([^a-zA-Z0-9])+$/, '');

			return `${newDescription}…`;
		}
	},
	methods: {
		addToCart() {
			this.$store.commit('Cart/addToCart', { productId: this.product.id, amount: 1 });
		}
	}
}
</script>

<style scoped lang="scss">
.product-container {
	background-color: white;
	padding: .5rem;
	border-radius: 5px;
	display: flex;
	flex-flow: column;
	gap: 5px 0;
	cursor: pointer;
	flex-wrap: wrap;
	img {
		object-fit: cover;
		width: 100%;
		height: auto;
		max-height: 150px;
	}
	p {
		font-weight: bold;
		font-size: 16px;
		color: rgb(16, 4, 35);
		line-height: 16px;
		overflow: hidden;
		align-self: flex-start;
		&.description {
			flex-grow: 1;
			font-size: 12px;
			font-weight: 400;
			color: rgb(88, 80, 101);
		}
		&.name {
			margin: calc(12px - 5px ) 0 0;
			text-transform: capitalize;
		}
		&.price {
			padding-top: 6px;
			display: block;
			color: rgb(88, 80, 101);
			justify-self: flex-end;
		}
	}
}
@media (max-width: 900px){
	.product-container {
		width:60%;
		margin:auto;
	}
}
</style>
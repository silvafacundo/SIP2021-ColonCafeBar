<template>
	<div class="cart-container" :class="{ active }">
		<h4>Mi Compra <span>({{ items }})</span></h4>
		<div v-for="(product, index) of products"
			:key="index"
			class="product">
			<p class="name">{{ product.name }}</p>
			<p>Precio: {{ product.price }}</p>
			<p>Cantidad: {{ product.amount }}</p>
			<b-button type="is-text"
				size="is-small"
				icon-left="trash"
				@click="e => deleteProduct(e, index)">
				ELIMINAR
			</b-button>
		</div>
		<p v-if="isEmpty" class="empty">El carrito se encuentra vacío</p>
		<footer>
			<p>Subtotal: <span>${{ totalPrice }}</span></p>
			<b-button type="is-success"
				size="is-small"
				:disabled="isEmpty"
				@click="goToCheckout">
				Continuar
			</b-button>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'Cart',
	model: {
		prop: 'active',
		event: 'close'
	},
	props: {
		active: {
			type: Boolean,
			required: false,
			default: false
		},
	},
	data: () => ({
		lastActive: Date.now(),
		lastDeleteClick: null
	}),
	computed: {
		isEmpty() {
			return this.products.length <= 0;
		},
		items() {
			return this.$store.getters['Cart/items'];
		},
		cartProducts() {
			return this.$store.getters['Cart/cart'];
		},
		products() {
			const products = this.$store.getters['Products/products'];
			const cartProducts = [];
			for (const cartProduct of this.cartProducts) {
				const realProduct = products.find(product => product.id === cartProduct.productId);
				cartProducts.push({
					...cartProduct,
					...realProduct
				});
			}

			return cartProducts;
		},
		totalPrice() {
			return this.products.reduce((prevVal, product) => prevVal + (product.price * product.amount), 0);
		}
	},
	watch: {
		active(newValue, oldValue) {
			if (newValue && !oldValue) {
				this.lastActive = Date.now()
			}
		}
	},
	mounted() {
		document.addEventListener('click', this.handleClick);
	},
	methods: {
		handleClick(event) {
			if (!this.active || (Date.now() - this.lastActive) < 100) return;
			const { target } = event;
			if (this.lastDeleteClick === target) return;
			if (!this.$el.contains(target)) this.$emit('close')
		},
		async deleteProduct(e, index) {
			this.lastDeleteClick = e.target;
			this.$store.commit('Cart/deleteIndex', index);
		},
		goToCheckout() {
			this.$router.push({ name: 'checkout' })
			this.$emit('close')
		}
	}

}
</script>

<style scoped lang="scss">
	.cart-container {
		display: none;
		.empty {
			margin: 1.5rem 0;
			text-align:center;
			color: gray;
		}
		&.active {
			display: block;
		}
		h4:first-child {
			font-size: 1.4rem;
			margin-bottom: 1rem;
			color: black;
			span {
				color: gray;
				font-weight: normal;
			}
		}
		padding: 1rem;
		border-radius:5px;
		right: 0;
		position: absolute;
		background-color:white;
		border:1px solid black;
		.product {
			margin: .5rem 5px;
			p:first-child {
				font-weight: bold;
				color: black;
				font-size: 1rem;
				padding: 0;
			}
			p {
				color: gray;
				font-size:.9rem;
				padding: 0 5px;
				margin: .3rem 0;
			}
		}
		footer {
			> * {
				margin: .5rem 0;
			}
			p {
				font-weight: bold;
				display: flex;
				justify-content: space-between;
				font-size: 1.3rem;
			}
		}
		width: 320px;
	}
</style>
<template>
	<div class="cart">
		<h3>Carrito</h3>
		<b-table :data="parsedCart">
			<b-table-column v-slot="props" label="Item">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props" label="Precio">
				{{ props.row.price }}
			</b-table-column>
			<b-table-column v-slot="props" label="Cantidad">
				<editable-text :value="String(props.row.amount)"
					can-edit
					type="Number"
					@change="value => updateCart(props.row.id, value)" />
			</b-table-column>
		</b-table>
		<h4>Total: ${{ totalPrice }}</h4>
		<b-button :loading="isLoading" @click="createOrder">Comprar</b-button>
	</div>
</template>

<script>
import EditableText from '../components/EditableText.vue';
export default {
	name: 'Cart',
	components: {
		EditableText
	},
	data: () => ({
		isLoading: false,
		order: null,
		interval: null
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'] || [];
		},
		cart() {
			return this.$store.getters['Cart/cart'];
		},
		parsedCart() {
			const cartArray = [];
			for (const productId in this.cart) {
				const amount = this.cart[productId];
				const product = this.products.find( p => p.id === productId);
				cartArray.push({
					...product,
					amount
				});
			}
			return cartArray;
		},
		totalPrice() {
			return this.parsedCart.reduce((prevValue, product) => prevValue + (product.price * product.amount), 0);
		}
	},
	mounted() {
		if (this.products.length <= 0)
			this.$store.dispatch('Products/fetchProducts');
	},
	methods: {
		updateCart(productId, newAmount) {
			newAmount = parseInt(newAmount);
			const oldAmount = this.cart[productId];
			const diff = oldAmount - newAmount;
			this.$store.commit('Cart/updateCart', { productId, amount: -diff })
		},
		async createOrder() {
			try {
				this.isLoading = true;
				const products = this.parsedCart.map(product => ({ id: product.id, amount: product.amount }));
				const order = await this.$store.dispatch('Orders/createOrder', { paymentMethod: 'online', withDelivery: false, products })
				this.$store.commit('Cart/emptyCart');
				this.$router.push({ name: 'order', params: { orderId: order.id } });
			} catch (err) {
				this.$showToast('Error al crear la orden', true);
			}
			this.isLoading = false;
		}
	}
}
</script>

<style scoped lang="scss">
	.cart{
		width: 55vw;
		height: 55vh;
		margin:auto;
		padding:3em;
		border: 1px solid black;
		border-radius: 3em;
		background-color: #fafafa;
		text-align: left;
		h3 {
			color: black;
			text-align: center;
		}
		p, h4 {
			margin: 1rem 0;
		}
	}
</style>
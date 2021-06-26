<template>
	<div v-if="order" class="order">
		<h3>Orden #{{ order.id }}</h3>
		<ul>
			<li v-for="(product, index) of parsedProducts" :key="index">
				<cart-product :product="product" />
			</li>
		</ul>
		<p>Total: ${{ order.total }}</p>
		<p>Estado: {{ order.status }}</p>
		<p>Método de pago: {{ order.paymentMethod }}</p>
		<p>Estado del Pago: {{ order.isPaid ? 'Pago': 'Pendiente' }}</p>
		<p>Tipo de entrega: {{ order.withDelivery ? 'delivery' : 'Take Away' }} </p>
		<a v-if="!order.isPaid && order.paymentMethod === 'online'"
			class="button is-primary"
			target="_blank"
			:href="order.paymentLink">Pagar</a>
		<p v-if="hasGrantablePoints && !hasOrderFinalized">Se te otorgaran {{ order.grantablePoints }} ptos cuando la orden finalice.</p>
		<p v-if="hasGrantablePoints && hasOrderFinalized">Obtuviste {{ order.grantablePoints }} ptos.</p>
	</div>
	<div v-else class="order">
		<p>Loading...</p>
	</div>
</template>

<script>
import CartProduct from '../components/CartProduct.vue';
export default {
	name: 'Order',
	components: { CartProduct },
	props: {
		orderId: {
			type: String,
			required: true
		}
	},
	data: () => ({
		isLoading: true,
		order: null,
		interval: null
	}),
	computed: {
		hasPaidWithPoints() {
			return this.order.paymentMethod === 'points';
		},
		hasOrderFinalized() {
			return this.order.orderStatus.key === 'delivered' || this.order.orderStatus.key === 'dispatched'
		},
		hasGrantablePoints() {
			return this.order.paymentMethod !== 'points'
		},
		parsedProducts () {
			if (!this.order) return [];
			return this.order.products.map(product => ({ ...product.product, amount: product.amount, price: product.price }));
		}
	},
	mounted() {
		this.fetchOrder();
		this.interval = setInterval(this.fetchOrder, 3 * 1000);
	},
	beforeDestroy() {
		if (this.interval)
			clearInterval(this.interval);
	},
	methods: {
		async fetchOrder() {
			try {
				this.isLoading = true;
				this.order = await this.$store.dispatch('Orders/fetchOrder', { orderId: this.orderId });
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al cargar la orden', true);
			}
		},
	}
}
</script>

<style scoped lang="scss">
	.order {
		width: 55vw;
		margin:auto;
		padding:3em;
		border: 1px solid black;
		border-radius: 3em;
		background-color: #fafafa;
		text-align: left;
		a {
			background-color: var(--rojo);
		}
		a:hover {
			cursor: pointer;
			background-color: var(--rojo-oscuro);
		}
		h3 {
			color: black;
			margin: 1rem 0;
			text-align: center;
		}
		p {
			margin: 1rem 0;
		}
	}

	@media (max-width: 900px){
		.order{
			width:100vw;
			border-radius: 0px;
			padding:1em;

			a{
				width:100%;
			}
		}
	}
</style>
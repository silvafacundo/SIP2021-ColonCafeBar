<template>
	<div v-if="order" class="order">
		<h3>Orden #{{ order.id }}</h3>
		<p>Total: ${{ order.total }}</p>
		<p>Estado: {{ order.status }}</p>
		<p>Método de pago: {{ order.paymentMethod }}</p>
		<p>Estado del Pago: {{ order.isPaid ? 'Pago': 'Pendiente' }}</p>
		<p>Tipo de entrega: {{ order.withDelivery ? 'delivery' : 'Take Away' }} </p>
		<a v-if="!order.isPaid && order.paymentMethod === 'online'"
			class="button is-primary"
			target="_blank"
			:href="order.paymentLink">Pagar</a>
	</div>
	<div v-else class="order">
		<p>Loading...</p>
	</div>
</template>

<script>
export default {
	name: 'Order',
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
		height: 55vh;
		margin:auto;
		padding:3em;
		border: 1px solid black;
		border-radius: 3em;
		background-color: #fafafa;
		text-align: center;
		h3 {
			color: black;
		}
		p {
			margin: 1rem 0;
		}
	}
</style>
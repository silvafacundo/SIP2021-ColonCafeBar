<template>
	<div v-if="order" class="order">
		<h3>Orden #{{ order.id }}</h3>
		<div v-for="(product, index) of order.products"
			:key="index"
			class="product">
			<div>
				<div class="prod">
					<p class="name">{{ product.product.name }}</p>
					<p>{{ product.product.category.name }}</p>
				</div>
				<div class="amount">
					<p>Cantidad: {{ product.amount }}</p>
				</div>
				<div class="price">
					<p>${{ product.price }}</p>
				</div>
			</div>
		</div>
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
		margin:auto;
		padding:3em;
		border: 1px solid black;
		border-radius: 3em;
		background-color: #fafafa;
		text-align: left;

		.product {
			border-bottom: 1px dotted black;
			div{
				display: flex;
				justify-content: space-between;

				.prod{
					display: block;
					width:60%;
					.name{
						font-weight: bold;
					}
				}
				.amount{
					width: 25%;
					align-items: end;
				}
				.price{
					width: 15%;
					align-items: end;
					display: flex;
					justify-content: space-between;
				}
			}
		}
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

			.product{
				width: 100%;
			}
			a{
				width:100%;
			}
		}
	}
</style>
<template>
	<div v-if="order" class="order">
		<h3>Orden #{{ order.id }}</h3>
		<ul>
			<li v-for="(product, index) of parsedProducts" :key="index">
				<cart-product :product="product" />
			</li>
		</ul>
		<div class="receipt">
			<p>Subtotal: <span>${{ subtotal }}</span></p>
			<p v-if="order.withDelivery">Envío: <span>${{ order.deliveryPrice }}</span></p>
			<p class="total">Total: <span>${{ order.total }}</span></p>
		</div>
		<b-field label="Forma de pago">
			{{ order.paymentMethod }}
		</b-field>
		<b-field custom-class="delivery" label="Entrega a">
			<p> {{ clientFullName }} </p>
			<p v-if="order.withDelivery"> {{ address }} </p>
			<p v-else>Retira por el local</p>
		</b-field>
		<a v-if="!order.isPaid && order.paymentMethod === 'online'"
			class="button is-primary"
			target="_blank"
			:href="order.paymentLink">Pagar</a>
		<p v-if="hasGrantablePoints && !hasOrderFinalized">Se te otorgaran {{ order.grantablePoints }} ptos cuando la orden finalice.</p>
		<p v-if="hasGrantablePoints && hasOrderFinalized">Obtuviste {{ order.grantablePoints }} puntos</p>
	</div>
	<div v-else class="order">
		<p>Loading...</p>
	</div>
</template>

<script>
import CartProduct from '../components/CartProduct.vue';
export default {
	name: 'LiveOrder',
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
		clientFullName() {
			let name = this.order.client.firstName;
			if (this.order.client.lastName) name += ' ' + this.order.client.lastName;
			return name;
		},
		address() {
			if ( !this.order.withDelivery || !this.order.address) return;
			return this.$parseAddress(this.order.address);
		},
		parsedProducts () {
			if (!this.order) return [];
			return this.order.products.map(product => ({ ...product.product, amount: product.amount, price: product.price }));
		},
		subtotal() {
			return this.parsedProducts.reduce((acc, val) => acc + (val.amount * val.price), 0);
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
		.receipt {
			border-bottom: 1px solid rgba(0,0,0,.1);
			border-top: 1px solid rgba(0,0,0,.1);
			padding: .5rem;
			p {
				font-size: .9rem;
				margin: .3rem;
				color: gray;
				&.total {
					color: black;
					font-weight: bold;
					font-size:1rem;
					margin:.5rem .3rem;
					margin-bottom: 0;
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

			a{
				width:100%;
			}
		}
	}
</style>
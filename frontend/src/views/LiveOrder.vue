<template>
	<div v-if="order" class="order">
		<h3>Order #{{ order.id }}</h3>
		<ul>
			<li v-for="(product, index) of parsedProducts" :key="index">
				<cart-product :product="product" />
			</li>
		</ul>
		<div class="recepit">
			<p>Subtotal: <span>${{ subtotal }}</span> </p>
			<p v-if="order.withDelivery">Envío: <span>${{ order.deliveryPrice }}</span></p>
			<p class="total">Total: <span>${{ order.total }}</span></p>
		</div>
		<div v-if="!order.isPaid && order.paymentMethod === 'online'" class="pay">
			<p>Para continuar con tu orden debes realizar el pago</p>
			<a v-if="!order.isPaid && order.paymentMethod === 'online'"
				class="button is-primary"
				target="_blank"
				:href="order.paymentLink">Pagar</a>
		</div>
		<div>
			<p class="title">Estado</p>
			<order-status :order="order" />
		</div>
		<div class="points" v-if="hasGrantablePoints">
			<p class="title">Puntos</p>
			<p v-if=" !hasOrderFinalized">Se te otorgaran {{ order.grantablePoints }} ptos cuando la orden finalice.</p>
			<p v-else>Obtuviste {{ order.grantablePoints }} ptos.</p>
		</div>
		<div class="payment-metehod">
			<p class="title">Método de pago</p>
			<p>{{ order.paymentMethod }}</p>
		</div>
		<div class="client">
			<p class="title">Entrega a</p>
			<p class="name">{{ clientFullName }}</p>
			<p v-if="order.withDelivery"> {{ address }}</p>
			<p v-else>Retira por el local</p>
		</div>
		<div v-if="order.withDelivery && order.delivery" class="delivery">
			<p class="title">Entrega a cargo de</p>
			<p>{{ deliveryName }}</p>
		</div>
	</div>
</template>

<script>
import CartProduct from '../components/CartProduct.vue'
import OrderStatus from '../components/OrderStatus';
export default {
	name: 'LiveOrder',
	components: {
		CartProduct,
		OrderStatus,
	},
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
		hasOrderFinalized() {
			return this.order.orderStatus.key === 'delivered' || this.order.orderStatus.key === 'dispatched'
		},
		hasGrantablePoints() {
			return this.order.paymentMethod !== 'points' && this.order.grantablePoints > 0
		},
		clientFullName() {
			let name = this.order.client.firstName;
			if (this.order.client.lastName) name += ' ' + this.order.client.lastName;
			return name;
		},
		deliveryName() {
			if (!this.order.delivery) return '';
			let { name, lastName } = this.order.delivery;
			if (lastName) name += ' ' + lastName;
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
		this.interval = setInterval(this.fetchOrder, 10 * 1000);
	},
	beforeDestroy() {
		clearInterval(this.interval)
	},
	methods: {
		async fetchOrder() {
			this.isLoading = true;
			try {
				this.order = await this.$store.dispatch('Orders/fetchOrder', { orderId: this.orderId });
			} catch (err) {
				console.log(err)
				this.$showToast('Error al cargar la orden', true);
			}
			this.isLoading = false
		}
	}
}
</script>

<style lang="scss" scoped>
 .order {
	background-color: white;
	max-width: 550px;
	border-radius: 5px;
	padding: 1rem;
	margin: auto;
	ul {
		margin-bottom: 1rem;
	}
	h3 {
		color: black;
		text-align: center;
	}
	> div {
		padding:.5rem;
		p {
			margin: .2rem 0;
			&.title, &.total {
				font-size: 1rem;
				margin:.5rem 0;
				font-weight: bold;
				color: black;
			}
			font-size: .9rem;
		}
		&:not(:last-child) {
			border-bottom: 1px solid rgba(0,0,0,.1);
		}
	}
	.pay {
		text-align: center;
		p {
			font-size: 1rem;
			margin: .5rem 0;
			margin-bottom: 1rem;
			color: black;
			font-weight: bold;
		}
	}
	.recepit {
		p:not(.total) {
			color: gray;
		}
		p {
			display: flex;
			justify-content: space-between;
			span {
				align-self: flex-end;
			}
		}
	}
	.client {
		.name {
			font-weight: bold;
			color:black;
			margin-bottom: .8rem;
		}
	}
 }
</style>
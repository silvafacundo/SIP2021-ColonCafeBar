<template>
	<router-link :to="`/order/${order.id}`" class="order">
		<div class="card">
			<p class="card-header-title">
				{{ `Orden N°${order.id} - ${order.status}` }}
			</p>
			<div class="card-content">
				<p><b-icon icon="clock" /> {{ date }}</p>
				<p v-if="isTakeAway">Retiro por el local</p>
				<p v-else> <b-icon icon="bicycle" /> {{ preAddress }}: <span>{{ address }}</span></p>
				<p><b-icon :icon="paymentMethodIcon" /> Método de pago: {{ paymentMethodName }} </p>
				<p v-if="paymentMethod !== 'points'" class="price">${{ total }}</p>
				<p v-else> Precio en puntos:<span class="price">{{ total }}</span> </p>
			</div>
		</div>
	</router-link>
</template>

<script>
import moment from 'moment';
export default {
	name: 'Order',
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	computed: {
		date() {
			return moment(this.order.createdAt).format('DD/MM/YYYY HH:mm[hs]');
		},
		paymentMethod() {
			return this.order.paymentMethod;
		},
		isTakeAway() {
			return !this.order.withDelivery;
		},
		preAddress() {
			return this.order.status === 'delivered'? 'Entregado en' : 'Se entregará en';
		},
		paymentMethodIcon() {
			return this.$getPaymentMethod(this.order.paymentMethod).icon
		},
		paymentMethodName() {
			return this.$getPaymentMethod(this.order.paymentMethod).name
		},
		address() {
			if (this.isTakeAway || !this.order.address) return '';
			return this.$parseAddress(this.order.address);
		},
		total() {
			return this.order.total + this.order.deliveryPrice;
		}
	}
}
</script>

<style lang="scss" scoped>
	.order {
		.card-header-title {
			padding-bottom: 0;
		}
		.card-content {
			padding: .5rem 1.5rem;
			padding-top: 0;
			> p {
				display: flex;
				align-items: center;
				gap: .3rem;
				margin: .5rem 0;
			}
			.price {
				font-weight: bold;
			}
		}
	}
</style>
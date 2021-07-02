<template>
	<div class="order-container">
		<b-collapse :open="false"
			class="card"
			animation="slide">
			<template #trigger="props">
				<div class="card-header"
					role="button">
					<p class="card-header-title">
						Orden N° {{ order.id }} - {{ order.status }} <span class="header-time">{{ orderFromNow }}</span>
					</p>
					<p class="icons">
						<b-tooltip v-if="order.isPaid"
							type="is-info"
							label="El pedido ya está pago">
							<b-icon type="is-success" icon="check-circle" />
						</b-tooltip>
						<b-tooltip v-if="order.withDelivery"
							type="is-info"
							label="Con entrega a domicilio">
							<b-icon icon="bicycle" />
						</b-tooltip>
						<b-tooltip type="is-info" :label="paymentMethodText">
							<b-icon :icon="paymentMethodIcon" />
						</b-tooltip>
					</p>
					<a class="card-header-icon">
						<b-icon :icon="props.open ? 'caret-down' : 'caret-up'" />
					</a>
				</div>
			</template>
			<div class="card-content">
				<div class="content">
					<b-table :data="order.products"
						striped>
						<b-table-column v-slot="props" label="Producto">
							{{ props.row.product.name }}
						</b-table-column>
						<b-table-column v-slot="props" label="Opciones">
							<p v-for="(value, key) in props.row.selectedVariants"
								:key="key"
								class="variations">
								<span>{{ key }}</span>: {{ value }}
							</p>
						</b-table-column>
						<b-table-column v-slot="props" label="Cantidad">
							{{ props.row.amount }}
						</b-table-column>
						<b-table-column v-slot="props" label="Precio unitario">
							${{ props.row.price }}
						</b-table-column>
						<b-table-column v-slot="props" label="Total">
							<p style="text-align: right;">${{ props.row.price * props.row.amount }}</p>
						</b-table-column>
					</b-table>
				</div>
				<div style="text-align: right;">
					<p v-if="order.withDelivery">Precio delivery: ${{ order.deliveryPrice || 0 }} </p>
					<p>Total: ${{ order.total }}</p>
				</div>
				<div class="order-info">
					<div class="client">
						<p class="title">Cliente:</p>
						<p>
							<b-icon icon="user" /> {{ order.client.firstName }} {{ order.client.lastName }}
						</p>
						<p v-if="order.client.phoneNumber">
							<b-icon icon="phone" />
							<a target="_blank"
								:href="`tel:${order.client.phoneNumber}`">
								{{ order.client.phoneNumber }}
							</a>
						</p>
						<p v-if="order.client.email">
							<b-icon icon="envelope" />
							<a target="_blank"
								:href="`mail:${order.client.email}`">
								{{ order.client.email }}
							</a>
						</p>
					</div>
					<div v-if="order.withDelivery" class="address">
						<p class="title">Dirección</p>
						<p>{{ deliveryAddress }}</p>
						<a class="button is-text is-small"
							target="_blank"
							:href="deliveryMapsLink">Ver en mapa</a>
					</div>
					<div class="order-data">
						<p class="title">Orden:</p>
						<p>
							<b-icon icon="clock" />
							{{ orderDate }}
						</p>
						<p v-if="order.isPaid">
							<b-icon type="is-success" icon="check-circle" />
							La orden ya está paga
						</p>
						<p v-if="order.withDelivery">
							<b-icon icon="bicycle" />
							Esta orden necesita de delivery
						</p>
						<p v-else>
							<b-icon icon="store" />
							El cliente retirará el pedido
						</p>
						<p><b-icon :icon="paymentMethodIcon" /> Método de pago: {{ order.paymentMethod }}</p>
					</div>
					<b-field label="Estado:">
						<b-select :value="order.statusId"
							placeholder="Estado de la orden"
							:disabled="isOrderFinished || !editable"
							@input="updateStatus">
							<option v-for="status in localStatuses"
								:key="status.id"
								:disabled="!isValidStatus(status.key)"
								:value="status.id">
								{{ status.statusName }}
							</option>
						</b-select>
					</b-field>
					<b-field v-if="order.withDelivery" label="Delivery:">
						<b-select :value="order.delivery && order.delivery.id"
							placeholder="Delivery"
							:disabled="!editable"
							icon="motorcycle"
							icon-pack="fas"
							@input="updateDelivery">
							<option
								v-for="delivery in localDeliveries"
								:key="delivery.id"
								:value="delivery.id">
								{{ delivery.name }}
							</option>
						</b-select>
					</b-field>
				</div>
			</div>
		</b-collapse>
	</div>
</template>

<script>
import moment from 'moment';
export default {
	name: 'Order',
	props: {
		order: {
			required: true,
			type: Object,
		},
		deliveries: {
			required: false,
			type: Array,
			default: () => ([])
		},
		statuses: {
			required: false,
			type: Array,
			default: () => ([])
		},
		editable: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	computed: {
		localDeliveries() {
			return this.deliveries.length <= 0 ? this.$store.getters['Delivery/deliveries'] : this.deliveries;
		},
		localStatuses() {
			return this.statuses.length <= 0 ? this.$store.getters['Orders/possibleStatus']: this.statuses;
		},
		orderFromNow() {
			return moment(this.order.createdAt).locale('es').fromNow();
		},
		orderDate() {
			return moment(this.order.createdAt).format('DD/MM/YYYY HH:mm[hs]');
		},
		paymentMethodIcon() {
			return this.$getPaymentMethod(this.order.paymentMethod).icon
		},
		paymentMethodText() {
			const pm = this.$getPaymentMethod(this.order.paymentMethod).name;
			let text = `El usuario utilizará ${pm} para pagar el pedido`;
			return text;
		},
		deliveryAddress() {
			if (!this.order.withDelivery || !this.order.address) return '';
			return this.$parseAddress(this.order.address);
		},
		deliveryMapsLink() {
			if (!this.order.withDelivery || !this.order.address) return '';
			const [lat, lng] = this.order.address.coordinates.split(';');
			const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
			return url;
		},
		isOrderFinished() {
			const finalStatus = ['dispatched', 'delivered', 'cancelled'];
			const orderStatus = this.order.orderStatus.key;

			return finalStatus.includes(orderStatus);
		}
	},
	methods: {
		updateStatus(statusId) {
			this.$emit('updateStatus', statusId);
		},
		updateDelivery(deliveryId) {
			this.$emit('updateDelivery', deliveryId);
		},
		isValidStatus(newStatus) {
			const actualStatus = this.order.orderStatus.key;
			const withDelivery = this.order.withDelivery;

			const possibleStatus = ['pending', 'awaitingPreparation', 'inPreparation'];

			if (withDelivery) possibleStatus.push('onTheWay', 'delivered');
			else possibleStatus.push('awaitingWithdrawal', 'dispatched');

			possibleStatus.push('cancelled');

			if (newStatus === actualStatus) return true;

			const actualStatusIndex = possibleStatus.indexOf(actualStatus);
			const newStatusIndex = possibleStatus.indexOf(newStatus);

			return actualStatusIndex <= newStatusIndex;
		}
	}
}
</script>

<style lang="scss" scoped>
	div.order-container {
		display: flex;
		flex-direction: column;
		padding: .2rem 0;
		.header-time {
			font-size: .7rem;
			font-weight: normal;
			margin-left: .5rem;
			color: gray;
		}
		.icons {
			display: flex;
			&> * {
				margin: auto .3rem;
			}
		}

		.variations {
			font-size: .8rem;
			&:not(:last-child) {
				margin-bottom: .4rem;
			}
		}
		p {
			margin-bottom: .3rem;
		}

		.select select option:disabled {
			color: #c3c3c3;
		}

		.order-info {
			display: grid;
			grid-template-columns: 1fr 1fr;
			> div {
				margin: .5rem 0;
				> p {
					font-size: .8rem;
					margin-bottom: 0;
					&.title {
						font-weight: bold;
						font-size: 1rem;
						margin-bottom: .5rem;
					}
				}

				padding: .5rem 0;
			}
			.address {
				text-align: center;
				p {
					text-align: left;
				}
				> a {
					margin: .5rem auto;
				}
			}
			.order-data {
				grid-column: 1/-1;
			}
		}
		@media screen and (max-width: 500px) {
			.order-info {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
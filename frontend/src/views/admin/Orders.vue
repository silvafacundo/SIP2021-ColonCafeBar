<template>
	<div class="container">
		<h3>Ordenes</h3>
		<div v-for="(order, key) in orders"
			:key="key"
			class="orders-container">
			<b-collapse class="card"
				animation="slide"
				aria-id="contentIdForA11y3"
				:open="false">
				<template #trigger="props">
					<div
						class="card-header"
						role="button"
						aria-controls="contentIdForA11y3">
						<p class="card-header-title">
							{{ `Orden N°${order.id} - ${order.status}` }}
						</p>
						<a class="card-header-icon">
							<b-icon
								:icon="props.open ? 'caret-down' : 'caret-up'" />
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
						<p>Precio delivery: $0</p>
						<p>Total: ${{ order.total }}</p>
					</div>
					<br>
					<p>Cliente: {{ order.client.firstName }}</p>
					<br>
					<p>Pagado: {{ order.isPaid ? 'Si' : 'No' }}</p>
					<br>
					<p>Delivery: {{ order.withDelivery ? 'Si' : 'No' }}</p>
					<br>
					<p>Método de pago: {{ order.paymentMethod }}</p>
					<br>
					<b-field v-if="order.withDelivery && order.delivery">
						<b-select v-model="order.delivery.id"
							placeholder="Delivery"
							icon="motorcycle"
							icon-pack="fas"
							@input="value => { updateDelivery(order, value) }">
							<option
								v-for="delivery in deliveries"
								:key="delivery.id"
								:value="delivery.id">
								{{ delivery.name }}
							</option>
						</b-select>
					</b-field>
					<b-field>
						<b-select :value="order.statusId"
							placeholder="Estado de la orden"
							@input="value => { updateStatus(order, value) }">
							<option
								v-for="status in ordersPossibleStatus"
								:key="status.id"
								:value="status.id">
								{{ status.statusName }}
							</option>
						</b-select>
					</b-field>
				</div>
			</b-collapse>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Orders',
	data: () => ({
		isLoading: true,
		fromDate: null,
		toDate: null,
	}),
	computed: {
		orders() {
			return this.$store.getters['Orders/orders'];
		},
		ordersPossibleStatus() {
			return this.$store.getters['Orders/possibleStatus'];
		},
		deliveries() {
			return this.$store.getters['Delivery/deliveries'];
		}
		/*getFromDate() {
			return this.fromDate;
		},
		getToDate() {
			return this.toDate;
		}*/
	},
	mounted() {
		this.fetchOrders();
		this.fetchDeliveries();
	},
	methods: {
		async fetchOrders() {
			try {
				this.isLoading = true;
				await this.$store.dispatch('Orders/fetchOrders', {
					page: 1,
					perPage: 50,
					filters: null,
				});
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al recuperar las órdenes', true);
			}
		},
		async fetchDeliveries() {
			try {
				this.isLoading = true;
				await this.$store.dispatch('Delivery/fetchDeliveries', {});
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al recuperar los deliveries', true);
			}
		},
		async updateDelivery(order, deliveryId) {
			try {
				await this.$store.dispatch('Orders/updateOrder', {
					orderId: order.id,
					deliveryId
				});
				this.$showToast('Delivery modificado');
			} catch (err) {
				this.$showToast('Error al modificar el delivery', true);
			}
		},
		async updateStatus(order, statusId) {
			try {
				await this.$store.dispatch('Orders/updateOrder', {
					orderId: order.id,
					statusId
				});
				this.$showToast('Estado de la orden modificado');
			} catch (err) {
				this.$showToast('Error al modificar el delivery', true);
			}
		}
	}
}
</script>

<style scoped lang="scss">
div.orders-container {
	background-color: white;
	display: flex;
	flex-direction: column;
	padding: .2rem 1rem;
}
@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
	}
</style>
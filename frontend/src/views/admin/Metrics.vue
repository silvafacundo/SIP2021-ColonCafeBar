<template>
	<div class="container">
		<h3>Métricas</h3>
		<div class="card filters">
			<b-field
				label="Desde"
				custom-class="is-small">
				<b-datepicker
					v-model="filters.fromDate"
					size="is-small"
					placeholder="Click to select..."
					icon="calendar"
					trap-focus />
				<b-button
					:disabled="!filters.fromDate"
					size="is-small"
					type="is-danger"
					icon-left="times"
					@click="() => { filters.fromDate = null }" />
			</b-field>
			<b-field
				label="Hasta"
				custom-class="is-small">
				<b-datepicker
					v-model="filters.toDate"
					size="is-small"
					placeholder="Click to select..."
					icon="calendar"
					trap-focus />
				<b-button :disabled="!filters.toDate"
					size="is-small"
					type="is-danger"
					icon-left="times"
					@click="() => { filters.toDate = null }" />
			</b-field>
			<div class="button-container">
				<b-button
					:loading="isLoading"
					type="is-success"
					@click="fetchMetrics">
					Aplicar
				</b-button>
			</div>
		</div>
		<div class="metrics-container">
			<MetricStat name="Total Ventas"
				:is-loading="isLoading"
				color="rgb(220, 222, 252)"
				:current-value="metrics && metrics.totalSells ? metrics.totalSells : 0"
				:is-standalone="true"
				:has-variation="false"
				is-currency
				icon="dollar-sign"
				pack="fas" />
			<MetricStat name="Total Ordenes con Delivery"
				:is-loading="isLoading"
				color="rgb(220, 222, 252)"
				:current-value="ordersWithDeliveryAmount"
				:is-standalone="true"
				:has-variation="false"
				icon="motorcycle"
				pack="fas" />
			<MetricStat name="Total Ordenes Take Away"
				:is-loading="isLoading"
				color="rgb(220, 222, 252)"
				:current-value="ordersWithoutDeliveryAmount"
				:is-standalone="true"
				:has-variation="false"
				icon="beer"
				pack="fas" />
			<div class="donut-container">
				<h4>Ordenes por método de pago</h4>
				<apexchart
					type="donut"
					:options="getDonutOptions"
					:series="ordersByPaymentMethod.series" />
			</div>
			<div class="columns-chart-container">
				<h4>Promedio de ordenes por día</h4>
				<apexchart
					type="bar"
					:options="getColumnsOptions"
					:series="avgSalesPerDayOfTheWeek" />
			</div>
			<h3 class="products-title">Productos más vendidos</h3>
			<div class="products-container">
				<b-table hoverable
					:data="mostSelledProducts">
					<b-table-column v-slot="props" label="#">
						{{ props.row.product.id }}
					</b-table-column>
					<b-table-column v-slot="props" label="Nombre">
						{{ props.row.product.name }}
					</b-table-column>
					<b-table-column v-slot="props" label="Precio">
						${{ props.row.product.price }}
					</b-table-column>
					<b-table-column v-slot="props" label="Total Ventas">
						{{ props.row.totalSells }}
					</b-table-column>
				</b-table>
			</div>
			<h3 class="clients-title">Clientes que más compraron</h3>
			<div class="clients-container">
				<div v-if="clientWithMostOrders && clientWithMostOrders.client && clientWithMostOrders.client.email && clientWithMostOrders.totalOrders"
					class="client-with-most-orders">
					<MetricStat name="Cliente que más órdenes realizó"
						:is-loading="isLoading"
						color="rgb(220, 222, 252)"
						:current-string-value="`${clientWithMostOrders.client ? clientWithMostOrders.client.email : ''} - Órdenes: ${clientWithMostOrders.totalOrders}`"
						:is-standalone="true"
						:has-variation="false"
						is-string
						icon="user"
						pack="fas" />
				</div>
				<div v-if="clientSpentTheMost && clientSpentTheMost.client && clientSpentTheMost.client.email && clientSpentTheMost.totalSpent"
					class="client-spent-the-most">
					<MetricStat name="Cliente que más gastó"
						:is-loading="isLoading"
						color="rgb(220, 222, 252)"
						:current-string-value="`${clientSpentTheMost.client.email} - Gastado: $${clientSpentTheMost.totalSpent}`"
						:is-standalone="true"
						:has-variation="false"
						is-string
						icon="user"
						pack="fas" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MetricStat from '../../components/admin/MetricStat.vue';

export default {
	name: 'Metrics',
	components: {
		MetricStat,
	},
	data: ()=> ({
		filters: {
			fromDate: null,
			toDate: new Date(),
		},
		isLoading: false,
	}),
	computed: {
		metrics() {
			return this.$store.getters['Metrics/metrics'];
		},
		ordersWithDeliveryAmount() {
			if (this.metrics && this.metrics.amountOfOrdersByTypeOfDelivery && Array.isArray(this.metrics.amountOfOrdersByTypeOfDelivery)) {
				for (const orderCount of this.metrics.amountOfOrdersByTypeOfDelivery) {
					if (orderCount.withDelivery) return Number(orderCount.count);
				}
			}
			return 0;
		},
		ordersWithoutDeliveryAmount() {
			if (this.metrics && this.metrics.amountOfOrdersByTypeOfDelivery && Array.isArray(this.metrics.amountOfOrdersByTypeOfDelivery)) {
				for (const orderCount of this.metrics.amountOfOrdersByTypeOfDelivery) {
					if (!orderCount.withDelivery) return Number(orderCount.count);
				}
			}
			return 0;
		},
		ordersByPaymentMethod() {
			let ordersResponse = {
				series: [],
				labels: [],
			}
			if (!this.metrics || !this.metrics.amountOfOrdersByTypeOfPayment || !Array.isArray(this.metrics.amountOfOrdersByTypeOfPayment)) return ordersResponse;
			for (const order of this.metrics.amountOfOrdersByTypeOfPayment) {
				ordersResponse.series.push(parseInt(order.count));
				ordersResponse.labels.push(order.paymentMethod);
			}
			return ordersResponse;
		},
		mostSelledProducts() {
			const products = [];
			if (!this.metrics || !this.metrics.mostSelledProducts || !Array.isArray(this.metrics.mostSelledProducts)) return products;
			return this.metrics.mostSelledProducts;
		},
		avgSalesPerDayOfTheWeek() {
			const avgSales = [0, 0, 0, 0, 0, 0, 0];
			if (!this.metrics || !this.metrics.avgSalesPerDayOfTheWeek || !Array.isArray(this.metrics.avgSalesPerDayOfTheWeek)) return [{ data: avgSales }];
			for (const avgSale of this.metrics.avgSalesPerDayOfTheWeek) {
				avgSales[avgSale.dow - 1] = Number(avgSale.avg);
			}
			return [{ data: avgSales }];
		},
		clientSpentTheMost() {
			if (!this.metrics || !this.metrics.customers || !this.metrics.customers.clientSpentTheMost || !this.metrics.customers.clientSpentTheMost.client) return {};
			return this.metrics.customers.clientSpentTheMost;
		},
		clientWithMostOrders() {
			if (!this.metrics || !this.metrics.customers || !this.metrics.customers.clientWithMostOrders || !this.metrics.customers.clientWithMostOrders.client) return {};
			return this.metrics.customers.clientWithMostOrders;
		},
		getDonutOptions() {
			return {
				legend: {
					show: false,
					position: 'center',
					horizontalAlign: 'center',
				},
				colors: ['#ff3d6a', '#47ec64', '#ff3d6a'],
				labels: this.ordersByPaymentMethod.labels,
				chart: {
					height: '250px',
					width: '250px'
				},
				stroke: {
					width: 1
				},
				plotOptions: {
					pie: {
						donut: {
							size: '60%',
							labels: {
								show: true,
								total: {
									show: true,
									showAlways: true,
								}
							}
						}
					}
				},
				noData: {
					text: 'No Data',
					align: 'center',
					verticalAlign: 'middle',
					offsetX: 0,
					offsetY: 0,
				}
			};
		},
		getColumnsOptions() {
			const colors = ['rgba(0, 143, 251, 0.85)'];
			return {
				chart: {
					height: 350,
					type: 'bar',
				},
				colors: colors,
				plotOptions: {
					bar: {
						columnWidth: '45%',
						distributed: true,
					}
				},
				dataLabels: {
					enabled: false
				},
				legend: {
					show: false
				},
				xaxis: {
					categories: [
						'Lunes',
						'Martes',
						'Miercoles',
						'Jueves',
						'Viernes',
						'Sábado',
						'Domingo'
					],
					labels: {
						style: {
							colors: colors,
							fontSize: '12px'
						}
					}
				}
			}
		}
	},
	mounted() {
		this.fetchMetrics();
	},
	methods: {
		async fetchMetrics() {
			try {
				this.isLoading = true;
				await this.$store.dispatch('Metrics/fetchMetrics', {
					fromDate: this.filters.fromDate,
					toDate: this.filters.toDate
				});
			} catch (err) {
				this.$showToast('Error al recuperar las métricas', true);
			}
			this.isLoading = false;
		},
		deleteToDate() {
			this.toDate = null;
		}
	}
}
</script>

<style lang="scss" scoped>

.filters {
	padding: 1rem;
	display: flex;
	gap: .5rem;
	margin-bottom: 1rem;
}
.button-container {
	display: flex;
	align-items: center;
	margin-left: auto;
}
.metrics-container {
	display: grid;
	grid-template-areas:
		"withDelivery withoutDelivery totalSales"
		"ordersByPayment averageOrdersPerDay averageOrdersPerDay"
		"productsTitle productsTitle productsTitle"
		"products products products"
		"clientsTitle clientsTitle clientsTitle"
		"clients clients clients";
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 1rem;

	.donut-container {
		background-color: white;
		grid-area: ordersByPayment;
		padding: 1.2rem;
		border-radius: 0.25rem;
	}
	.columns-chart-container {
		background-color: white;
		grid-area: averageOrdersPerDay;
		padding: 1.2rem;
		border-radius: 0.25rem;
	}

	.products-title {
		grid-area: productsTitle;
	}
	.clients-title {
		grid-area: clientsTitle;
	}
	.products-container {
		grid-area: products;
	}
	.clients-container {
		grid-area: clients;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1rem;
	}
}
</style>
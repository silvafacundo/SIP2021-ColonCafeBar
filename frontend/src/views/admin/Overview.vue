<template>
	<div class="container overview">
		<h3>Resumen</h3>
		<div class="wrapper">
			<b-notification v-if="typeof isShopOpen === 'boolean'"
				:closable="false"
				:type="isShopOpen ? 'is-success' : 'is-warning'">
				{{ notificationText }}
			</b-notification>
			<b-skeleton v-else height="56" />
			<div class="metrics">
				<MetricStat name="Ventas en las últimas 24Hs"
					:is-loading="isLoading && isFirstLoad"
					color="rgb(220, 222, 252)"
					:current-value="metrics && (metrics.totalSales || 0)"
					:is-standalone="true"
					:has-variation="false"
					is-currency
					icon="dollar-sign"
					pack="fas" />
				<MetricStat name="Órdenes en las últimas 24Hs"
					:is-loading="isLoading && isFirstLoad"
					color="rgb(220, 222, 252)"
					:current-value="metricsTotalOrder"
					:is-standalone="true"
					:has-variation="false"
					icon="clipboard-list"
					pack="fas" />
			</div>
			<div class="lastOrders">
				<p class="title">
					Ordenes pendientes ({{ orders.length }})
					<router-link
						class="button is-small is-text"
						to="/admin/orders">
						Ver Ordenes
					</router-link>
				</p>
				<p v-if="orders.length <= 0">No hay ordenes pendientes!</p>
				<ul>
					<li v-for="(order, index) in lastOrders" :key="index">
						<order :order="order" :editable="false" />
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import Order from '../../components/Order.vue';
import MetricStat from '../../components/admin/MetricStat.vue';
export default {
	name: 'Overview',
	components: {
		Order,
		MetricStat
	},
	data: () => ({
		orders: [],
		metrics: {},
		isFirstLoad: true,
		isLoading: false,
		interval: null
	}),
	computed: {
		isShopOpen() {
			return this.$store.getters['Schedules/isOpen'];
		},
		orderStatus() {
			return this.$store.getters['Orders/possibleStatus'] || [];
		},
		notificationText() {
			if (this.isShopOpen) return `El local actualmente se encuentra abierto`;
			return `El local actualmente se encuentra cerrado`
		},
		lastOrders() {
			return this.orders.slice(0, 5)
		},
		metricsTotalOrder() {
			if (!Array.isArray(this.metrics.amountOfOrdersByTypeOfDelivery)) return 0;
			return this.metrics.amountOfOrdersByTypeOfDelivery.reduce((acc, val) => acc + Number(val.count), 0);
		}
	},
	watch: {
		isLoading(newVal, oldVal) {
			if (newVal && !oldVal && this.isFirstLoad) {
				this.isFirstLoad = false;
			}
		}
	},
	async mounted() {
		this.$store.dispatch('Schedules/fetchStoreStatus');
		if (this.orderStatus.length <= 0)
			await this.$store.dispatch('Orders/fetchOrderStatus');
		this.refreshData();
		this.interval= setInterval(this.refreshData.bind(this), 20 * 1000)
	},
	beforeDestroy() {
		clearInterval(this.interval);
	},
	methods: {
		async refreshData() {
			this.isLoading = true;
			try {
				await Promise.all([
					this.fetchLastOrders(),
					this.fetchMetrics()
				]);
			} catch (err) {
				// NOP
			}
			this.isLoading = false;

		},
		async fetchLastOrders() {
			try {
				const pendingStatus = this.orderStatus.find(status => status.key === 'pending');
				if (!pendingStatus) throw Error;
				const filters = {
					statusesId: [pendingStatus.id]
				}
				const { orders } = await this.$store.dispatch('Orders/fetchOrders', { perPage: 10000, filters });
				this.orders = orders;
			} catch (err) {
				console.error(err);
				this.$showToast('Error al traer las órdenes', true);
			}
		},
		async fetchMetrics() {
			try {
				const fromDate = new Date(Date.now() - (24 * 60 * 60 * 1000))
				this.metrics = await this.$store.dispatch('Metrics/fetchMetrics', { fromDate });
			} catch (err) {
				this.$showToast('Error al cargar las métricas');
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.overview {
		.wrapper {
			background-color: white;
			padding: 1rem;
			border-radius: 5px;
			margin: 1rem 0;
			> div {
				p.title {
					font-size: 1.4rem;
					color: black;
				}
				&.metrics {
					display: flex;
					gap: 1rem;
					margin: 1rem 0;
					> * {
						width: 100%;
					}
				}
			}
		}
	}
</style>
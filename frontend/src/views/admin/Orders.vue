<template>
	<div class="container">
		<h3>Ordenes</h3>
		<b-tabs v-model="selectedTab"
			expanded
			type="is-toggle">
			<b-tab-item value="real-time" label="Tiempo Real">
				<OrderFilters v-model="liveFilters"
					:status="nonFinalStatus"
					:query-client="queryClient"
					@input="fetchLiveOrders" />
				<h3 v-if="(!parsedLiveOrders|| parsedLiveOrders.length <= 0)">No se han encontado ordenes</h3>
				<Order v-for="(order, index) of parsedLiveOrders"
					:key="index"
					:order="order"
					@updateStatus="statusId => updateStatus(order, statusId)"
					@updateDelivery="deliveryId => updateDelivery(order, deliveryId)" />
			</b-tab-item>
			<b-tab-item value="history" label="Histórico">
				<OrderFilters v-model="filters"
					:query-client="queryClient"
					@input="fetchOrders" />
				<loading-bar :loading="isLoading" />
				<h3 v-if="!isLoading && (!orders || orders.length <= 0)">No se han encontado ordenes</h3>
				<Order v-for="(order, index) of orders"
					:key="index"
					:order="order"
					@updateStatus="statusId => updateStatus(order, statusId)"
					@updateDelivery="deliveryId => updateDelivery(order, deliveryId)" />
			</b-tab-item>
		</b-tabs>
	</div>
</template>

<script>
import LoadingBar from '../../components/LoadingBar';
import Order from '../../components/Order';
import OrderFilters from '../../components/OrderFilters';
export default {
	name: 'Orders',
	components: {
		Order,
		OrderFilters,
		LoadingBar
	},
	props: {
		queryClient: {
			type: Object,
			required: false,
			default: null
		}
	},
	data: () => ({
		isLoading: true,
		isLoadingLive: false,
		fromDate: null,
		toDate: null,
		liveOrders: [],
		liveInterval: null,
		selectedTab: 'real-time',
		orders: [],
		filters: {

		},
		liveFilters: {

		},
		pagination: {
			page: 1,
			perPage: 20
		}
	}),
	computed: {
		ordersPossibleStatus() {
			return this.$store.getters['Orders/possibleStatus'];
		},
		deliveries() {
			return this.$store.getters['Delivery/deliveries'];
		},
		nonFinalStatus() {
			const finalStatus = ['cancelled', 'delivered', 'dispatched']
			const statuses = this.ordersPossibleStatus.filter(status => !finalStatus.includes(status.key))
			return statuses;
		},
		nonFinalStatusIds() {
			return this.nonFinalStatus.map(status => status.id);
		},
		parsedLiveOrders() {
			const ordered = [...this.liveOrders];


			return ordered.sort((a, b) => {
				const { priorityService: aVal } = a.orderStatus;
				const { priorityService: bVal } = b.orderStatus;
				if (aVal == bVal) return a.id > b.id ? -1 : 1;
				return aVal > bVal ? -1 : 1;
			});
		}
		/*getFromDate() {
			return this.fromDate;
		},
		getToDate() {
			return this.toDate;
		}*/
	},
	watch: {
		selectedTab(newVal) {
			window.location.hash = newVal;
		}
	},
	mounted() {
		this.fetchOrders();
		this.fetchDeliveries();
		this.liveInterval = setInterval(this.fetchLiveOrders.bind(this), 500);
		window.addEventListener('scroll', this.handleScroll.bind(this))
		const hash = window.location.hash.replace('#', '');
		if (hash) this.selectedTab = hash;
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.handleScroll.bind(this));
		clearInterval(this.liveInterval);
	},
	methods: {
		async fetchLiveOrders() {
			if (this.selectedTab !== 'real-time') return;
			this.isLoadingLive = true;
			try {
				const liveFilters = {
					...this.liveFilters,
				}
				if (!Array.isArray(this.liveFilters.statusesId) || this.liveFilters.statusesId.length <= 0)
					liveFilters.statusesId = this.nonFinalStatusIds

				const { orders } = await this.$store.dispatch('Orders/fetchOrders', {
					page: 1,
					perPage: 1000,
					filters: liveFilters,
					orderBy: {
						servicePriority: 'asc'
					}
				});

				this.liveOrders = orders;
			} catch (err) {
				this.$showToast('Error al cargar las ordenes en vivo', true);
			}
			this.isLoadingLive = false;
		},
		async fetchOrders(fromFilters) {
			if (fromFilters) {
				this.pagination = {
					...this.pagination,
					page: 1
				}
				this.orders = [];
			}
			try {
				this.isLoading = true;
				const { orders, pagination } = await this.$store.dispatch('Orders/fetchOrders', {
					page: 1,
					filters: this.filters,
					...this.pagination,
					perPage: 50,
				});
				this.orders = [...this.orders, ...orders];
				this.pagination = { ...pagination, lastPage: orders.length };
				this.isLoading = false;
			} catch (err) {
				this.$showToast('Error al recuperar las ordenes', true);
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
				this.$showToast('Error al modificar el estado de la orden', true);
			}
		},
		handleScroll() {
			if (this.selectedTab !== 'history') return;
			const element = this.$el;
			const isLastPage = this.page >= Math.ceil(this.pagination.total / this.pagination.perPage);
			if (this.pagination.lastPage < this.pagination.perPage || isLastPage) return;
			if ( element.getBoundingClientRect().bottom <= window.innerHeight && !this.isLoading) {
				this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
				this.fetchOrders()
			}
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep .b-tabs > nav {
	> ul > li:not(.is-active) > a {
		background-color:white;
	}
}
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
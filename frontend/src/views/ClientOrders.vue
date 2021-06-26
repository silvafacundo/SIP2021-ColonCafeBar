<template>
	<!-- TODO: Hacer los filtros -->
	<div class="client-orders">
		<h3>Mis Ordenes</h3>
		<ul>
			<li v-for="(order, index) of orders" :key="index">
				<order-preview :order="order" />
			</li>
		</ul>
		<p v-if="isLoading" class="loading">Cargando...</p>
	</div>
</template>

<script>
import OrderPreview from '../components/OrderPreview.vue';
export default {
	name: 'ClientOrders',
	components: { OrderPreview },
	data: () =>({
		orders: [],
		pagination: {
			page: 1,
			perPage: 20
		},
		isLoading: false
	}),
	computed: {
	},
	mounted() {
		this.fetchClientOrders();
		window.addEventListener('scroll', this.handleScroll.bind(this))
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	},
	methods: {
		async fetchClientOrders() {
			this.isLoading = true;
			try {
				const { orders, pagination } = await this.$store.dispatch('Orders/fetchClientOrders', { ...this.pagination });
				this.orders = [...this.orders, ...orders];
				this.pagination = { ...pagination, lastPage: orders.length };
			} catch (err) {
				console.log(err);
				this.$showToast('Error al cargar las ordenes', true);
			}
			this.isLoading = false;
		},
		handleScroll() {
			const element = this.$el;
			const isLastPage = this.page >= Math.ceil(this.pagination.total / this.pagination.perPage);
			if (this.pagination.lastPage < this.pagination.perPage || isLastPage) return;
			if ( element.getBoundingClientRect().bottom <= window.innerHeight && !this.isLoading) {
				this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
				this.fetchClientOrders()
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.client-orders {
		margin: 1rem;
		ul > li {
			margin: .5rem 0;
		}
		.loading {
			color: white;
			text-align: center;
		}
	}
</style>
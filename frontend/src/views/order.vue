<template>
	<div class="order">
		{{ order }}
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
		order: null
	}),
	mounted() {
		this.fetchOrder();
	},
	methods: {
		async fetchOrder() {
			try {
				this.order = await this.$store.dispatch('Orders/fetchOrder', { orderId: this.orderId });
			} catch (err) {
				this.$showToast('Error al cargar la orden', true);
			}
		}
	}
}
</script>

<style>

</style>
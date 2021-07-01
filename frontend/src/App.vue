<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>

import Vue from 'vue';
export default {
	name: 'App',
	components: { },
	data: () =>({
	}),
	computed: {
	},
	watch: {
	},
	created() {
		Vue.prototype.$showToast = (...args) => {
			this.showToast(...args);
		}
		Vue.prototype.$parseAddress = (...args) => {
			return this.parseAddressName(...args);
		}
		Vue.prototype.$getPaymentMethod = (...args) => {
			return this.getPaymentMethod(...args);
		}
	},
	methods: {
		showToast(text, isError, duration=2500) {
			this.$buefy.toast.open({
				duration: duration,
				message: text,
				position: 'is-bottom',
				queue: false,
				type: isError ? 'is-danger' : 'is-success'
			})
		},
		getPaymentMethod(pm) {
			switch (pm) {
				case 'online':
					return {
						name: 'MercadoPago',
						icon: 'credit-card'
					}
				case 'points':
					return {
						name: 'Puntos',
						icon: 'parking'
					}
				default:
					return {
						name: 'Efectivo',
						icon: 'money-bill'
					};
			}
		},
		parseAddressName(address, complete = false) {
			const { street, number, floor, neighborhood, postalCode, corner } = address;
			let text = `${street} ${number}`;

			if (typeof floor !== 'undefined' && floor !== null) text += ` - ${floor}`;
			if (complete) {
				text = `${postalCode} ${neighborhood}, ` + text;
				text += ` esquina ${corner}`
			}
			return text;
		}
	}
}
</script>

<style scoped>
	#app{
		max-width: 100vw;
		height: 100vh;
	}
</style>

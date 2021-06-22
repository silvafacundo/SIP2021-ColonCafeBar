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
	mounted() {
	},
	created() {
		Vue.prototype.$showToast = (...args) => {
			this.showToast(...args);
		}
	},
	methods: {
		showToast(text, isError, duration=2500) {
			this.$buefy.toast.open({
				duration: duration,
				message: text,
				position: 'is-bottom',
				type: isError ? 'is-danger' : 'is-success'
			})
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

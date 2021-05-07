<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>

export default {
	name: 'App',
	components: { },
	mounted() {
		this.$store.dispatch('Auth/checkToken');
	}
}
</script>

<style>
</style>

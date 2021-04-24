<template>
	<div>
		<h3>Profile</h3>
		{{user}}
		<button @click="logOut">Log Out</button>
	</div>
</template>

<script>
export default {
	computed: {
		user() {
			return this.$store.getters['User/user'];
		}
	},
	methods: {
		async logOut() {
			await this.$store.dispatch('User/logOut');
		}
	}
}
</script>

<style>

</style>
<template>
	<div>
		<h3>Profile</h3>
		<p v-for="(value, key) in user" :key="key">{{key}}: {{value}}</p>
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
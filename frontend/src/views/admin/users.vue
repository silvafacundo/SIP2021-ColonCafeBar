<template>
	<div>
		<h3>Usuarios</h3>
		<ul>
			<li v-for="(user, index) of users" :key="index">

			</li>
		</ul>
	</div>
</template>

<script>
export default {
	computed: {
		users() {
			return this.$store.getters('Users/users');
		}
	},
	mounted() {
		this.fetchUsers();
	},
	methods: {
		async fetchUsers() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Users/fetchUsers');
			} catch (err) {
				// TODO: Mostrar que falló
			}
			this.isLoading = false;
		}
	}
}
</script>

<style>

</style>
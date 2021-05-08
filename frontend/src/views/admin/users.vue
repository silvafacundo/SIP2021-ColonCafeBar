<template>
	<div>
		<h3>Usuarios</h3>
		<ul>
			<li v-for="(user, index) of users" :key="index">
				{{user}}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	computed: {
		users() {
			return this.$store.getters['User/users'];
		}
	},
	mounted() {
		this.fetchUsers();
	},
	methods: {
		async fetchUsers() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('User/fetchUsers');
			} catch (err) {
				console.error('toda la mala', err)
				// TODO: Mostrar que falló
			}
			this.isLoading = false;
		}
	}
}
</script>

<style>

</style>
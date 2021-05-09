<template>
	<div>
		<h3>Usuarios</h3>
		<ul>
			<li v-for="(user, index) of users" :key="index">
				<User :user="user" />
			</li>
		</ul>
	</div>
</template>

<script>
import User from '../../components/admin/user';
export default {
	components: {
		User
	},
	computed: {
		users() {
			return this.$store.getters['User/users'];
		},
		roles() {
			return this.$store.getters['User/roles'];
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
				await this.$store.dispatch('User/fetchRoles');
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
<template>
	<div>
		<h3>Login</h3>
		<form @submit.prevent="login">
			<input type="email" name="email" v-model="email" placeholder="Email">
			<br>
			<input type="password" name="password" v-model="password" placeholder="Contraseña">
			<br>
			<button>Login</button>
		</form>
		<router-link to="/register">Register</router-link>
		<p>{{error && 'Error: ' + error}}</p>
	</div>
</template>

<script>
export default {
	data: () => ({
		email: '',
		password: '',
		error: ''
	}),
	mounted() {
	},
	methods: {
		async login() {
			try {
				await this.$store.dispatch('User/login', { email: this.email, password: this.password });
				await this.$router.push({ name: 'me' });
			} catch (err) {
				console.error('Failed to log in', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message
				else this.error = 'Ocurrió un error'
			}
		}
	}
}
</script>

<style>

</style>
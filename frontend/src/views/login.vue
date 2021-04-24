<template>
	<div>
		<h3>Login</h3>
		<input type="email" name="email" v-model="email" placeholder="Email">
		<input type="password" name="password" v-model="password" placeholder="Contraseña">
		<button @click="login">Login</button>
		<p>{{ error}}</p>
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
				alert('Te logeaste bro')
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
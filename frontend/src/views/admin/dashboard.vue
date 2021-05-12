<template>
	<div>
		<b-navbar>
			<template #brand>
				<b-navbar-item tag="router-link" :to="{ path: '/' }">
					<img
						src="@/assets/images/logo.png"
						alt="Logo Colón Café Bar"
					>
				</b-navbar-item>
			</template>
			<template #start>
				<b-navbar-item>
					<router-link :to="{ name: 'adminUsers' }">Usuarios</router-link>
				</b-navbar-item>
				<b-navbar-item>
					<router-link :to="{ name: 'adminRoles' }">Roles</router-link>
				</b-navbar-item>
				<b-navbar-item>
					<router-link :to="{ name: 'adminPermissions' }">Permisos</router-link>
				</b-navbar-item>
			</template>

			<template #end>
				<b-navbar-item tag="div">
					<div class="buttons">
						<b-button type="is-danger" @click="logout">Cerrar sesion</b-button>
					</div>
				</b-navbar-item>
			</template>
		</b-navbar>
		<router-view />
	</div>
</template>

<script>
export default {
	methods: {
		logout(){
			this.$store.dispatch('Auth/logOut', { admin: true });
		}
	}
}
</script>

<style scoped>

</style>
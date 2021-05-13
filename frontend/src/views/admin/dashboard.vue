<template>
	<div>
		<b-navbar>
			<template #brand>
				<b-navbar-item tag="router-link" :to="{ path: '/admin' }">
					<img
						src="@/assets/images/logo.png"
						alt="Logo Colón Café Bar"
					>
				</b-navbar-item>
			</template>
			<template #start class="nav-container">
				<router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Usuarios</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminRoles' }">Roles</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminPermissions' }">Permisos</router-link>
				<!-- <router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Categorías</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Productos</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Pedidos</router-link> -->
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
.navbar-item img{
	max-height: 3.75rem;
}

.navbar-item:hover{
	color:var(--rojo);
}
/*.nav-container {
	display: flex;
	gap: 3rem;
}*/
.b-navbar-item {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 1rem;

}
.b-navbar-item:hover {
	background-color: var(--gris);
}
</style>
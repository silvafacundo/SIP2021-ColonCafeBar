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
			<template #end>
				<a role="button"
					class="navbar-burger burger"
					:class="{'is-active': isMenuOpen }"
					@click="() => isMenuOpen = !isMenuOpen">
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</a>
			</template>
		</b-navbar>
		<router-view />
		<b-sidebar v-model="isMenuOpen"
			class="sidebar"
			type="is-white"
			fullheight>
			<b-menu>
				<b-menu-list label="menú">
					<b-menu-item icon="user"
						tag="router-link"
						to="/admin/users"
						label="Usuarios" />
					<b-menu-item icon="user-tag"
						tag="router-link"
						to="/admin/roles"
						label="Roles" />
					<b-menu-item icon="exclamation-triangle"
						tag="router-link"
						to="/admin/permissions"
						label="Permisos" />
					<b-menu-item icon="clipboard-list"
						tag="router-link"
						to="/admin/orders"
						label="Ordenes" />
					<b-menu-item icon="motorcycle"
						tag="router-link"
						to="/admin/deliveries"
						label="Delivery" />
					<b-menu-item icon="tags"
						tag="router-link"
						to="/admin/categories"
						label="Categorias" />
					<b-menu-item icon="hamburger"
						tag="router-link"
						to="/admin/products"
						label="Productos" />
					<b-menu-item icon="store-alt"
						tag="router-link"
						to="#"
						label="Tienda" />
					<b-menu-item icon="clock"
						tag="router-link"
						to="/admin/schedules"
						label="Horarios" />
					<b-menu-item icon="sign-out-alt"
					@click="logout"
					label="Cerrar sesión"
					class="logout"/>
				</b-menu-list>
			</b-menu>
		</b-sidebar>
	</div>
</template>

<script>
export default {
	data: () =>({
		isMenuOpen: false,
	}),
	computed: {
		username() {
			const user = this.$store.getters['Auth/adminUser'];
			if (!user) return '';
			return user.username;
		}
	},
	methods: {
		logout(){
			this.$store.dispatch('Auth/logOut', { admin: true });
		}
	}
}
</script>

<style scoped lang="scss">
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
	align-items: center;
	padding: 0 1rem;
	padding: .5em;
	margin-bottom:.2em;
}
.b-navbar-item:hover {
	background-color: var(--gris);
}
.navbar-burger {
	align-self: center;
	display: block!important;
	margin-left: 0;
}

.sidebar ::v-deep .sidebar-content {
	padding: 1rem;
	padding-top: 1em;
	height: 100%;
	overflow-y: hidden;
	.menu{
		height: 100%;

		.menu-list{
			height: 100%;
			display:flex;
			flex-flow: column;

			.logout {
				margin-top:auto;
				margin-bottom: 1em;
				width:100%;
			}
		}
	}
}


</style>
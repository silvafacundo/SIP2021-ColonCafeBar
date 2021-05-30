<template>
	<div>
		<header>
			<router-link :to="{ path: '/' }">
				<img
					src="@/assets/images/logo.png"
					alt="Logo Colón Café Bar"
				>
			</router-link>
			<b-button class="cart-button"
				type="is-text"
				@click="goToCart">
				<BadgeIcon icon="shopping-cart" :value="cartItems" />
			</b-button>
			<a role="button"
				class="navbar-burger burger"
				:class="{'is-active': isMenuOpen }"
				@click="() => isMenuOpen = !isMenuOpen">
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</header>
		<b-sidebar v-model="isMenuOpen"
			class="sidebar"
			type="is-white"
			fullheight
			overlay>
			<b-menu>
				<b-menu-list label="menú">
					<b-menu-item icon="home"
						tag="router-link"
						to="/"
						label="Inicio" />
					<b-menu-item icon="user"
						tag="router-link"
						to="/me"
						label="Mi Cuenta" />
				</b-menu-list>
			</b-menu>
		</b-sidebar>
		<router-view />
	</div>
</template>

<script>
import BadgeIcon from '../components/BadgeIcon';
export default {
	name: 'Home',
	components: {
		BadgeIcon
	},
	data: () => ({
		isMenuOpen: false
	}),
	computed: {
		user() {
			return this.$store.getters['Auth/clientUser'];
		},
		cartItems() {
			return this.$store.getters['Cart/items'];
		}
	},
	methods: {
		goToCart() {
			this.$router.push({ name: 'cart' })
		}
	}
}
</script>

<style scoped lang="scss">

	header {
		width: 100%;
		top: 0;
		position: sticky;
		height: 60px;
		background-color: white;
		padding: 0 1rem;
		display: flex;
		gap: 1rem;
		z-index: 1000;
		margin-bottom: 1rem;
		img {
			height: 100%;
			padding: 5px;
		}
		.cart-button {
			align-self: center;
			justify-content: flex-end;
			margin-left: auto;
		}
		.navbar-burger {
			align-self: center;
			display: block!important;
			margin-left: 0;
		}
	}
	.sidebar ::v-deep .sidebar-content {
		padding: 1rem;
		padding-top: 80px;

	}
</style>
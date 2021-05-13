<template>
	<div class="user-container">
		<label>{{ user.username }}</label>
		<b-taginput
			v-model="user.roles"
			:data="filteredRoles"
			autocomplete
			:allow-new="false"
			:allow-duplicates="false"
			open-on-focus
			field="name"
			placeholder="Agregar Rol"
			type="is-danger"
			size="is-small"
			@add="addRole"
			@remove="removeRole"
			@typing="getFilteredRoles" />
	</div>
</template>


<script>

export default {
	components: {

	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		filteredRoles: []
	}),
	computed: {
		roles() {
			return this.$store.getters['User/roles'];
		}
	},
	methods: {
		getFilteredRoles(value) {
			this.filteredRoles = this.roles.filter(role =>
				role.name.toLowerCase()
					.indexOf(value.toLowerCase()) >= 0
			)
		},
		async addRole(role) {
			try {
				const roleId = role.id;
				const userId = this.user.id;
				await this.$store.dispatch('User/addRoleToUser', { roleId, userId })
			} catch (err) {
				//TODO: Cambiar esto
				alert('Mal ahí salió mal');
			}
		},
		async removeRole(role) {
			try {
				const roleId = role.id;
				const userId = this.user.id;
				await this.$store.dispatch('User/deleteRoleFromUser', { roleId, userId })
			} catch (err) {
				//TODO: Cambiar esto
				alert('Mal ahí salió mal');
			}
		}
	}
}

</script>

<style scoped lang="scss">
	div.user-container {
		display: flex;
		background-color: var(--blanco);
		padding: .5rem .5rem;

		label {
			font-size:1.2em;
			display: flex;
			align-items: center;
			margin-right: 0.5rem;
		}
		ul {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.roles {
				border: 2px solid var(--rojo);
				padding: 0.6rem 2rem;
				border-radius: 5px;
			}
		}
		.add-role{
			padding: 1em;
			background-color: var(--rojo);
			border-radius:5px;
		}
	}

</style>


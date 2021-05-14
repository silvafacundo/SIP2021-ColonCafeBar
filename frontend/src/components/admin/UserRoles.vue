<template>
	<b-taginput
		:value="value"
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
</template>


<script>

export default {
	components: {

	},
	props: {
		value: {
			type: Array,
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
				&& !this.hasRole(role.name)
			)
		},
		hasRole(name) {
			return !!this.value.find(role => role.name === name);
		},
		async addRole(role) {
			this.filteredRoles = [];
			this.$emit('add', role);
		},
		async removeRole(role) {
			this.filteredRoles = [];
			this.$emit('remove', role);
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


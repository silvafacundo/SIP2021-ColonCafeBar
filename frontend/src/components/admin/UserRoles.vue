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
		@focus="getFilteredRoles"
		@remove="removeRole"
		@typing="typing" />
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
		filteredRoles: [],
		filterText: '',
	}),
	computed: {
		roles() {
			return this.$store.getters['User/roles'];
		}
	},
	watch: {
		filterText(newValue) {
			this.getFilteredRoles();
		},
		roles() {
			this.getFilteredRoles();
		},
		value(newValue) {
			this.getFilteredRoles();
		}
	},
	methods: {
		getFilteredRoles() {
			this.filteredRoles = this.roles.filter(role =>
				role.name.toLowerCase()
					.indexOf(this.filterText.toLowerCase()) >= 0
				&& !this.hasRole(role.name)
			)
		},
		typing(value) {
			this.filterText = value;
		},
		hasRole(name) {
			return !!this.value.find(role => role.name === name);
		},
		async addRole(role) {
			this.filteredRoles = [];
			this.$emit('add', role);
			this.getFilteredRoles();
		},
		async removeRole(role) {
			this.filteredRoles = [];
			this.$emit('remove', role);
		}
	}
}

</script>

<style scoped lang="scss">
</style>


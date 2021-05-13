<template>
	<b-table :data="permissions">
		<b-table-column v-slot="props">
			<b-checkbox :disabled="disabled"
				:value="selected[props.row.id]"
				@input="val => change(props.row.id, val)" />
		</b-table-column>
		<b-table-column v-slot="props" label="id">
			{{ props.row.id }}
		</b-table-column>
		<b-table-column v-slot="props" label="key">
			{{ props.row.key }}
		</b-table-column>
		<b-table-column v-slot="props" label="name">
			{{ props.row.name }}
		</b-table-column>
	</b-table>
</template>

<script>
export default {
	name: 'PermissionList',
	props: {
		permissions: {
			type: Array,
			required: true
		},
		value: {
			type: Array,
			required: false,
			default: () => ([])
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		selected() {
			const toReturn = {};
			for (const permission of this.permissions) {
				toReturn[permission.id] = this.value.includes(permission.id);
			}
			return toReturn;
		}
	},
	methods: {
		change(permissionId, value) {
			this.$emit('change', { permissionId, value });
		}
	}
}
</script>

<style>

</style>
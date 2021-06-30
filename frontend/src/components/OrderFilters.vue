<template>
	<div class="card toolbar">
		<b-field v-if="!ignoreFields.includes('fromDate')"
			label="Desde"
			custom-class="is-small">
			<b-datepicker
				:value="filters.fromDate"
				size="is-small"
				placeholder="Click to select..."
				icon="calendar"
				trap-focus
				@input="val => updateFilter('fromDate', val)" />
			<b-button
				:disabled="!filters.fromDate"
				size="is-small"
				type="is-danger"
				icon-left="times"
				@click="() => updateFilter('fromDate', null)" />
		</b-field>
		<b-field v-if="!ignoreFields.includes('toDate')"
			label="Hasta"
			custom-class="is-small">
			<b-datepicker
				:value="filters.toDate"
				size="is-small"
				placeholder="Click to select..."
				icon="calendar"
				trap-focus
				@input="val => updateFilter('toDate', val)" />
			<b-button :disabled="!filters.toDate"
				size="is-small"
				type="is-danger"
				icon-left="times"
				@click="() => updateFilter('toDate', null)" />
		</b-field>
		<b-field v-if="!ignoreFields.includes('state')"
			label="Estados"
			custom-class="is-small">
			<b-dropdown multiple
				size="is-small"
				:value="filters.statusesId"
				@change="val => updateFilter('statusesId', val)">
				<template #trigger>
					<b-button size="is-small">
						Selected ({{ filters.statusesId ? filters.statusesId.length : 0 }})
					</b-button>
				</template>
				<b-dropdown-item v-for="(status, index) of localStatus"
					:key="index"
					:value="status.id">
					<span> {{ status.statusName }}</span>
				</b-dropdown-item>
			</b-dropdown>
		</b-field>
		<b-field v-if="!ignoreFields.includes('delivery')"
			label="Delivery"
			custom-class="is-small">
			<b-dropdown multiple
				size="is-small"
				:value="filters.deliveriesId"
				@change="val => updateFilter('deliveriesId', val)">
				<template #trigger>
					<b-button size="is-small">
						Selected ({{ filters.deliveriesId ? filters.deliveriesId.length : 0 }})
					</b-button>
				</template>
				<b-dropdown-item v-for="(delivery, index) of localDeliveries"
					:key="index"
					:value="delivery.id">
					<span>{{ delivery.name }} {{ delivery.lastName }}</span>
				</b-dropdown-item>
			</b-dropdown>
		</b-field>
	</div>
</template>

<script>
export default {
	name: 'OrderFilters',
	props: {
		value: {
			type: Object,
			required: true
		},
		ignoreFields: {
			type: Array,
			required: false,
			default: () => ([])
		}
	},
	data: () => ({

	}),
	computed: {
		filters() {
			return this.value;
		},
		localStatus() {
			return this.$store.getters['Orders/possibleStatus'];
		},
		localDeliveries() {
			return this.$store.getters['Delivery/deliveries'];
		}
	},
	methods: {
		updateFilter(key, value) {
			const newFilter = { ...this.filters };
			newFilter[key] = value;
			this.$emit('input', newFilter);
		}
	}
}
</script>

<style lang="scss" scoped>
	.toolbar {
		padding: 1rem;
		display: flex;
		gap: .5rem;
	}
</style>
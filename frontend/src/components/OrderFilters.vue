<template>
	<div class="card toolbar" :class="{ overflow: canOverflow }">
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
				<b-dropdown-item v-for="(lstatus, index) of localStatus"
					:key="index"
					:value="lstatus.id">
					<span> {{ lstatus.statusName }}</span>
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
		<b-field v-if="!ignoreFields.includes('clients')"
			label="Cliente"
			custom-class="is-small">
			<b-autocomplete v-model="clientText"
				size="is-small"
				field="email"
				placeholder="Busque un cliente..."
				open-on-focus
				clearable
				:loading="autocompleteLoading"
				:data="clientsAutocomplete"
				@select="val => updateFilter('clientsId', val && [val.id])"
				@focus="fetchClients"
				@typing="clientTyping">
				<template v-slot="props">
					<p class="autocomplete-name"> {{ props.option.firstName }} {{ props.option.lastName }} </p>
					<p class="autocomplete-email"> {{ props.option.email }} </p>
				</template>
			</b-autocomplete>
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
		},
		queryClient: {
			type: Object,
			required: false,
			default: null
		},
		status: {
			type: Array,
			required: false,
			default: null
		}
	},
	data: () => ({
		clientsAutocomplete: [],
		clientText: '',
		clientTimeout: null,
		autocompleteLoading: false,
		canOverflow: false
	}),
	computed: {
		filters() {
			return this.value;
		},
		localStatus() {
			if (this.status) return this.status;
			return this.$store.getters['Orders/possibleStatus'];
		},
		localDeliveries() {
			return this.$store.getters['Delivery/deliveries'];
		},
	},
	beforeMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize.bind(this))
	},
	mounted() {
		if (this.queryClient) {
			this.$emit('input', { ...this.filters, clientsId: [this.queryClient.id] })
			this.clientText = this.queryClient.email;
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize.bind(this))
	},
	methods: {
		updateFilter(key, value) {
			const newFilter = { ...this.filters };
			newFilter[key] = value;
			this.$emit('input', newFilter);
		},
		async fetchClients() {
			this.autocompleteLoading = true;
			try {
				const { clients } = await this.$store.dispatch('Client/fetchClients', { filters: { query: this.clientText } })
				this.clientsAutocomplete = clients;
			} catch (err) {
				this.$showToast('Error al cargar los clientes', false);
			}
			this.autocompleteLoading = false;
		},
		clientTyping() {
			this.autocompleteLoading = true;
			clearTimeout(this.clientTimeout);
			this.clientTimeout = setTimeout(()=> {
				this.fetchClients();
			}, 1000)
		},
		handleResize() {
			this.canOverflow = window.innerWidth < 1024;
		}
	}
}
</script>

<style lang="scss" scoped>
	.toolbar {
		padding: 1rem;
		display: flex;
		gap: .5rem;
		&.overflow {
			overflow-y: auto;
		}
	}
	.autocomplete-name {
		font-weight: bold;
	}
	.autocomplete-email {
		font-size: .7rem;
	}
</style>
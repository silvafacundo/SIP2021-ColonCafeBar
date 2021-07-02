<template>
	<div>
		<b-collapse :open="false"
			class="card"
			animation="slide">
			<template #trigger="props">
				<div class="card-header">
					<p class="card-header-title">
						ID: {{ client.id }} - {{ fullName }} - {{ email }}
					</p>
					<a class="card-header-icon">
						<b-icon :icon="props.open ? 'caret-down' : 'caret-up'" />
					</a>
				</div>
			</template>
			<div class="card-content">
				<div class="content">
					<div class="client">
						<p v-if="phone">
							<b-icon icon="phone" />
							<a target="_blank"
								:href="`tel:${phone}`">
								{{ phone }}
							</a>
						</p>
						<p v-if="email">
							<b-icon icon="envelope" />
							<a target="_blank"
								:href="`mail:${email}`">
								{{ email }}
							</a>
						</p>
						<b-field label="Puntos"
							custom-class="is-small"
							:type="isValidPoints? '' : 'is-danger'">
							<b-input v-model="localPoints"
								size="is-small" />
							<b-button icon-left="check"
								:disabled="!didPointsChanged || !isValidPoints"
								type="is-success"
								size="is-small"
								@click="updatePoints" />
						</b-field>
						<b-button type="is-warning" @click="revokeToken">Revocar Tokens de accesso</b-button>
						<router-link class="button" :to="{ name: 'adminOrders', hash: '#history', params: { queryClient: client } }">Ver ordenes</router-link>
					</div>
				</div>
			</div>
		</b-collapse>
	</div>
</template>

<script>
export default {
	name: 'Client',
	props: {
		client: {
			type: Object,
			required: true
		}
	},
	data: () => ({
		localPoints: 0
	}),
	computed: {
		fullName() {
			let name = this.client.firstName;
			if (this.client.lastName) name += ` ${this.client.lastName}`;

			return name;
		},
		email() {
			return this.client.email;
		},
		phone() {
			return this.client.phoneNumber;
		},
		isValidPoints() {
			const local = Number(this.localPoints);
			return !isNaN(local) && local >= 0 && local % 1 === 0;
		},
		didPointsChanged() {
			const local = Number(this.localPoints);
			const original = Number(this.client.availablePoints);
			return local !== original;
		}
	},
	beforeMount() {
		this.localPoints = this.client.availablePoints;
	},
	methods: {
		revokeToken() {
			this.$emit('revokeToken', this.client);
		},
		updatePoints() {
			if (!this.isValidPoints) return
			return this.$emit('updatePoints', this.client, Number(this.localPoints));
		}
	}
}
</script>

<style>

</style>
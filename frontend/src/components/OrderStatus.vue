<template>
	<div class="order-status">
		<b-steps
			v-if="isStepStatus"
			:type="selectedStatusData.type || 'is-success'"
			:value="statusKey"
			:has-navigation="false"
		>
			<b-step-item v-for="(step, index) in validSteps"
				:key="index"
				:clickable="false"
				:value="step.status"
				:icon="step.icon">
				<p class="description"> {{ step.text }}</p>
			</b-step-item>
		</b-steps>
		<div v-else
			class="full"
			:class="typeToClass(selectedStatusData.type || 'is-success')">
			<b-icon custom-class="fa-10x" :icon="selectedStatusData.icon" />
			<p> {{ selectedStatusData.text }} </p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OrderStatus',
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	computed: {
		status() {
			return this.order.orderStatus;
		},
		statusKey() {
			return this.status.key
		},
		selectedStatusData() {
			return this.stepStatus[this.statusKey];
		},
		isStepStatus() {
			return this.validTextSteps.includes(this.statusKey);
		},
		withDelivery() {
			return this.order.withDelivery;
		},
		stepStatus() {
			return {
				pending: {
					icon: 'clock',
					status: 'pending',
					type: 'is-info',
					text: 'Aguarda un momento a que confirmemos tu pedido'
				},
				awaitingPreparation: {
					icon: 'clipboard-list',
					status: 'awaitingPreparation',
					text: 'El local ha aceptado tu pedido y en breves comenzará a preprarlo'
				},
				inPreparation: {
					icon: 'hamburger',
					status: 'inPreparation',
					text: 'El local está preparando tu pedido'
				},
				awaitingWithdrawal: {
					icon: 'check-circle',
					status: 'awaitingWithdrawal',
					text: 'Tu pedido ya está listo, por favor venga al local a retirarlo'
				},
				dispatched: {
					icon: 'check-circle',
					status: 'dispatched',
					text: 'Ya has retirado el pedido'
				},
				onTheWay: {
					icon: 'bicycle',
					status: 'onTheWay',
					text: 'El repartido ya tiene tu pedido y se dirige a tu dirección!',
				},
				delivered: {
					icon: 'check-circle',
					status: 'delivered',
					text: 'Tu pedido ya fue entregado, esperamos que lo disfrutes!'
				},
				cancelled: {
					icon: 'times-circle',
					status: 'cancelled',
					type: 'is-danger',
					text: 'Lo sentimos, tu pedido fue cancelado.'
				}
			}
		},
		validTextSteps() {
			let steps = [
				'awaitingPreparation',
				'inPreparation'
			]

			steps.push( this.withDelivery ? 'onTheWay' : 'awaitingWithdrawal')

			return steps;
		},
		validSteps() {
			return this.validTextSteps.map(step => this.stepStatus[step]);
		}
	},
	methods: {
		typeToClass(type) {
			return type.replace('is-', 'has-background-')
		}
	}
}
</script>

<style lang="scss" scoped>
	.order-status {
		.description {
			text-align: center;
			font-weight: bold;
		}
		.full {
			padding: 1rem;
			display:flex;
			color: white;
			font-weight: bold;
			border-radius: 5px;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			::v-bind .icon {
				width: 70px;
			}
		}
	}
</style>
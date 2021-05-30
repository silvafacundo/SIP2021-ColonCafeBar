<template>
	<section class="badge-icon" :class="{ 'is-disabled': disabled }">
		<b-icon :icon="icon"
			class="icon" />
		<span v-if="(showZero || value > 0)"
			class="badge">
			{{ value }}
		</span>
	</section>
</template>

<script>
export default {
	name: 'BadgeIcon',
	props: {
		icon: {
			type: String,
			default: ''
		},
		value: {
			type: Number,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		showZero: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
	}),
	computed: {
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
	.badge-icon {
		position: relative;

		.icon {
			font-size: 1.3rem;
			margin-right: calc(-0.5em - 1px)!important;
		}
		.badge {
			position: absolute;
			font-size: .7rem;
			bottom:-.1rem;
			right: -1.1rem;
			border-radius: 50%;
			color: white;
			background-color: var(--rojo);
			width:1rem;
			height: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>

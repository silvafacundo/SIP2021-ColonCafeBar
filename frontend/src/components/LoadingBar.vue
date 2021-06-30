<template>
	<div :class="{ active: loading }"
		class="bar"
		:style="style" />
</template>

<script>
export default {
	name: 'LoadingBar',
	props: {
		loading: {
			type: Boolean,
			default: true
		},
		color: {
			type: String,
			default: 'var(--verde-ok)'
		},
		duration: {
			type: [String, Number],
			default: 1000
		}
	},
	data: ()=> ({
	}),
	computed: {
		style() {
			return {
				'--color': this.color,
				'--duration': typeof this.duration === 'number' ? `${this.duration}ms` : this.duration
			}
		}
	},
}
</script>

<style scoped lang="scss">
	.bar {
		position: relative;
		width: 100%;
		display: flex;
		height: .5rem;
		overflow: hidden;
		--color: blue;
		--duration: 1000ms;
		&.active::after {
			position: relative;
			content: '';
			width: 30%;
			height: 100%;;
			background-color: var(--color);
			animation: loading var(--duration) ease-in-out infinite;
			border-radius: 5px;
		}
	}
	@keyframes loading {
		0%{
			left: -30%;
		}
		100%{
			left: calc(100%);
		}
	}
</style>
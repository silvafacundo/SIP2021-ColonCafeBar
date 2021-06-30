<template>
	<div class="schedule"
		:class="{ selected }"
		@click="()=>$emit('click')">
		<b-icon icon="clock" />
		<p>
			<span v-if="schedule.alias" class="alias">{{ schedule.alias }}</span>
		</p>
		<b-icon icon="chevron-right" />
	</div>
</template>

<script>
export default {
	name: 'Schedule',
	props: {
		schedule: {
			type: Object,
			required: true,
		},
		selected: {
			type: Boolean,
			required: false,
			default: false
		}
	}
}
</script>

<style scoped lang="scss">
	.schedule {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		padding: 1rem;
		&.selected {
			background-color:rgba(0,0,0,.05)
		}
		p {
			margin-bottom: 0!important;
			span.alias {
				font-weight: bold;
			}
		}
		&:hover{
			background-color:rgba(0,0,0,.1);
		}
	}
</style>
<template>
	<div class="address"
		:class="{ selected }"
		@click="()=>$emit('click')">
		<b-icon icon="map-marker-alt" />
		<p>
			<span v-if="address.alias" class="alias">{{ address.alias }}</span>
			{{ address.street }} {{ address.number }}
		</p>
		<b-icon icon="chevron-right" />
	</div>
</template>

<script>
export default {
	name: 'Address',
	props: {
		address: {
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
	.address {
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
<template>
	<div class="category-container" @click="() => $emit('click')">
		<p class="name">{{ category.name }}</p>
	</div>
</template>

<script>
export default {
	props: {
		product: {
			type: Object,
			required: true
		}
	},
	computed: {
	},
	methods: {
	}
}
</script>

<style scoped lang="scss">

</style>
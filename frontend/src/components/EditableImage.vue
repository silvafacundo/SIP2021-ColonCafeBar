<template>
	<div class="editable-imagen">
		<div class="overlay">
			<p>Editar imagen</p>
		</div>
		<img :src="src" :alt="alt">
	</div>
</template>

<script>
export default {
	name: 'EditableImage',
	props: {
		src: {
			type: String,
			required: true
		},
		alt: {
			type: String,
			required: false,
			default: ''
		},
	}

}
</script>

<style scoped lang="scss">
	.editable-imagen {
		position: relative;
		.overlay {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(255,255,255, .7);
			border: 5px solid rgba(255,255,255, .5);
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			opacity: 0;
			cursor: pointer;
			transition: all 100ms ease-in-out;
		}
		&:hover .overlay {
			opacity: 1;
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
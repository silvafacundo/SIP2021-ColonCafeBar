<template>
	<div class="editable-imagen"
		:class="{ 'active': draggingOver || loading }"
		@dragover="dragOver"
		@dragenter="dragEnter"
		@dragleave="dragLeave"
		@drop="drop"
		@click="() => !loading && $refs.input.click()">
		<div class="overlay">
			<p v-if="!loading">Editar imagen</p>
			<b-loading :is-full-page="false"
				:active="loading" />
		</div>
		<img :src="src" :alt="alt">
		<input ref="input"
			type="file"
			@input="updateFile">
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
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		alt: {
			type: String,
			required: false,
			default: ''
		},
	},
	data: () => ({
		dragCount: 0,
	}),
	computed: {
		draggingOver() {
			return this.dragCount !== 0;
		}
	},
	watch: {
		draggingOver(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.$emit('dragging', newVal);
			}
		}
	},
	methods: {
		dragOver(e) {
			e.preventDefault();
		},
		dragEnter(e) {
			e.preventDefault();
			if (!e.dataTransfer.types.includes('Files')) return this.dragCount = 0;
			this.dragCount++;

		},
		dragLeave(e) {
			e.preventDefault();
			if (!e.dataTransfer.types.includes('Files')) return this.dragCount = 0;
			this.dragCount--;
			if (this.dragCount < 0) this.dragCount = 0;
		},
		drop(e) {
			e.preventDefault();
			this.dragCount = 0;
			this.$emit('file', [...e.dataTransfer.files].pop());
		},
		updateFile(e) {
			const { target } = e;
			const file = [...target.files].pop();
			if (!file) return;
			target.value='';
			this.$emit('file', file);
		}
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
		&:hover .overlay, &.active .overlay {
			opacity: 1;
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
	input {
		display:none;
	}
</style>
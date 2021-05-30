<template>
	<div :style="{ width, height }"
		class="editable-text-container"
		:class="{ 'is-editable': !isEditing && canEdit, 'is-bold': bold }">
		<!-- Text edit -->
		<div :class="{'invalid': !isRegexValid, 'hidden': !isEditing}">
			<input v-if="type === 'text'"
				ref="text-input"
				v-model="localText"
				v-bind="inputAttributes"
				@blur="stopEditing"
				@focus="onStartEdit"
				@keyup.enter="textInputElement.blur()">
			<b-input v-else
				ref="text-b-input"
				v-model="localText"
				:type="type"
				v-bind="inputAttributes"
				@focus="onStartEdit"
				@blur="stopEditing" />
				<!--@keyup.native.enter="stopEditing" />-->
		</div>
		<!-- Simple text display -->
		<component :is="tag"
			v-show="!isEditing"
			class="dynLabel"
			:class="{ muted: !localText }"
			:style="{ 'white-space': getWrap }"
			@click="onStartEdit"
			v-text="localText || placeholder" />
	</div>
</template>

<script>
export default {
	name: 'EditableText',
	components: {
	},
	props: {
		regexValidator: {
			type: String,
			default: null
		},
		value: {
			type: [String, Number],
			default: ''
		},
		placeholder: {
			type: String,
			default: 'Enter some text value'
		},
		tag: {
			type: String,
			default: 'div'
		},
		type: {
			type: String,
			default: 'text'
		},
		width: {
			type: String,
			default: 'auto'
		},
		height: {
			type: String,
			default: 'auto'
		},
		wrap: {
			type: Boolean,
			default: false
		},
		bold: {
			type: Boolean,
			default: false
		},
		errorMsg: {
			type: String,
			default: 'Invalid Input'
		},
		canEdit: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
		localText: null,
		isEditing: false, // define whether it is in edit mode or not
	}),
	computed: {
		getWrap(){
			if (this.wrap){ return 'pre-wrap'; }
			else { return 'pre'; } //solia ser pre
		},
		inputAttributes(){
			return {
				type: this.type,
				placeholder: this.placeholder,
				class: 'dynInput vlabeledit-input'
			}
		},
		textInputElement(){ //this is the input object thats currently being used
			return (this.type == 'text') ? this.$refs['text-input'] : this.$refs['text-b-input'];
		},
		isRegexValid() {
			if (!this.regexValidator) return true;

			const inputRegex = new RegExp(this.regexValidator);
			return inputRegex.test(this.localText)
		},
	},
	watch: {
		value() {
			this.updateLocalText();
		}
	},
	mounted() {
		this.updateLocalText();
	},
	methods: {
		updateLocalText() {
			this.localText = this.value;
		},
		onStartEdit() {
			if (this.canEdit){
				this.isEditing = true;
				this.$nextTick(() => { if (typeof this.textInputElement !== 'undefined') this.textInputElement.focus(); })
			}
		},
		stopEditing() {
			if (!this.isRegexValid) {
				this.$showToast(this.errorMsg, true);
				return;
			}

			this.isEditing = false;
			if (this.localText !== this.value) {
				this.$emit('input', this.localText);
				this.$emit('change', this.localText);
			}
			if ((typeof this.textInputElement !== 'undefined') && (this.type === 'text')) this.textInputElement.blur();
		}
	}
}
</script>


<style lang="scss" >
	.invalid{
		border: solid #f14668 1px;
		color: #f14668;
	}
	.editable-text-container {
		&.is-bold {
			font-weight: bold;
		}
	}

	.divContainer{
		padding: 2px 0px;
	}

	.is-editable{
		&:hover {
			background-color: rgb(235, 236, 240);
		}

		padding: 2px 0px;
		transition: background-color 0.3s ease-in-out 0s, border-color 1.2s ease-in-out 0s;
	}
	.dynLabel {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		display: block;
	}

	.dynInput {
		padding: 2px 5px;
		word-spacing: inherit;
		line-height: inherit;
		font-size: inherit;
		font-weight: inherit;
		font-family: inherit;
		color: inherit;
		font-style: inherit;
		margin: 0px;
		border: none !important;
		width: 100%;
		-webkit-box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
		box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);

		&:focus{
			outline: 1px solid rgba(10, 10, 10, 0.02);

		}
	}
	.hidden {
		position: absolute;
		top: -100vh;
		width:0;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}
</style>
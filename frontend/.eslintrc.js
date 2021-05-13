module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'plugin:vue/strongly-recommended',
		'plugin:vue/recommended',
		'eslint:recommended',
		'plugin:vue-scoped-css/base',
		'plugin:vue-scoped-css/recommended'
	],
	rules: {
		'no-console': 0,
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'indent': [2, 'tab', { 'SwitchCase': 1 }],
		'no-unused-vars': 1,
		'vue/no-unused-components': 1,
		'no-useless-escape': 0,
		'no-case-declarations': 1,
		'quotes': [2, 'single', {
			avoidEscape: true,
			allowTemplateLiterals: true
		}],
		'keyword-spacing': [2, {
			before: true,
			after: true,
		}],
		'comma-spacing': [2, {
			before: false,
			after: true
		}],
		'object-curly-spacing': [2, 'always'],
		'array-bracket-spacing': [1, 'never'],
		'no-trailing-spaces': 2,
		'block-spacing': [2, 'always'],
		'key-spacing': [2, {
			afterColon: true
		}],
		'vue/html-indent': [1, 'tab'],
		'vue/max-attributes-per-line': [1, {
			singleline: 2,
			multiline: {
				allowFirstLine: true
			}
		}],
		'vue/singleline-html-element-content-newline': 0,
		'vue/html-closing-bracket-newline': 0,
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}

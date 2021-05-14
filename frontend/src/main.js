import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import axios from 'axios';
import VueAxios from 'vue-axios';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);


Vue.use(Buefy, {
	defaultIconComponent: 'vue-fontawesome',
	defaultIconPack: 'fas',
});



require('./assets/styles/reset.css');
require('./assets/styles/style.css');
require('./assets/fonts/font.css');
axios.defaults.baseURL = process.env.VUE_APP_HOST_API || 'http://localhost:3000/api/';
Vue.use(VueAxios, axios);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

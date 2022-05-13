import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import auth, { isEnableMinPanel } from './plugins/auth0'
import vuetify from './plugins/vuetify'
import './plugins/vue-moment'
import './plugins/vue-axios'
import './plugins/vue2-datepicker'
import './plugins/vue-clipboard2'
import './plugins/pubnub-vue'
import './plugins/vue2-perfect-scrollbar'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.prototype.$mixpanel = require('mixpanel-browser')

if (isEnableMinPanel) {
  Vue.prototype.$mixpanel.init('02423df8de57d7a659cfaf6a03187a03', { api_host: 'https://api-eu.mixpanel.com' }, '')
}

Vue.prototype.$imgLink = 'https://alappimages.s3.amazonaws.com/'
Vue.prototype.$avatar = 'defaultProfile.png'
Vue.prototype.$company = 'defaultProfileBack.png'
Vue.prototype.$auth = auth
// eslint-disable-next-line no-undef
Vue.prototype.$UA = UA
Vue.prototype.$statusIconList = [
  {
    id: 0,
    name: 'Not Taking Calls',
    iconURL: 'unavailable.png',
  }, {
    id: 1,
    name: 'Taking Calls',
    iconURL: 'takingCalls.png',
  }]

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')

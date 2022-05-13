import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'https://devapi.answeringmobile.com/1/'
// Vue.axios.defaults.baseURL = 'https://api.answeringmobile.com/1/'
Vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

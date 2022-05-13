import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import vuexPersist from './vuex-persist'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [vuexPersist.plugin],
})

export default store

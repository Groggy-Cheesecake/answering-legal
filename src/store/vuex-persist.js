import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key: 'answering',
  storage: window.localStorage,
})

export default vuexPersist

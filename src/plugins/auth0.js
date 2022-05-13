import auth0 from 'auth0-js'
import Vue from 'vue'
import moment from 'moment'
import store from '../store'
import Service from '../service'

export const isEnableMinPanel = false

// Dev env
const url = process.env.NODE_ENV === 'production' ? 'https://webappdev.answeringmobile.com' : 'http://localhost:8080'
const clientID = 'aQXh1e7oKgF0EdEEWi9eZfza4uI8qkL3'
const audience = 'https://devapi.answeringmobile.com'

// // Production env
// const url = process.env.NODE_ENV === 'production' ? 'https://webapp.answeringmobile.com' : 'http://localhost:8080'
// const clientID = 'MG8OpO2RMYXlnzDaP2jdKAfxOHIAvQXM'
// const audience = 'https://api.answeringmobile.com'

// exchange the object with your own from the setup step above.
const webAuth = new auth0.WebAuth({
  domain: 'dev-p2qq100m.auth0.com',
  clientID,
  redirectUri: `${url}/login`,
  audience,
  responseType: 'token id_token',
  scope: 'openid profile', // define the scopes you want to use
})

const auth = new Vue({
  computed: {
    expiresAt: {
      get() {
        return localStorage.getItem('expires_at')
      },
      set(expiresIn) {
        const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime())
        localStorage.setItem('expires_at', expiresAt)
      },
    },
    authenticated: {
      get() {
        return store.state.auth
      },
      set(authenticated) {
        store.commit('setAuth', authenticated)
      },
    },
  },
  methods: {
    login() {
      webAuth.authorize()
    },
    logout() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        localStorage.removeItem('expires_at')
        store.commit('clearAll')
        if (isEnableMinPanel) {
          Vue.prototype.$mixpanel.track('Logged In', { genre: 'hip-hop', 'duration in seconds': 42 })
        }

        webAuth.logout({
          returnTo: `${url}`,
          clientID,
        })
      })
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt
    },
    handleAuthentication() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.expiresAt = authResult.expiresIn
            this.authenticated = {
              token: authResult.accessToken,
              userID: authResult.idTokenPayload.sub.replace('auth0|', ''),
            }
            Vue.axios.defaults.headers.common.Authorization = `Bearer ${authResult.accessToken}`
            Service.getUser(authResult.idTokenPayload.sub.replace('auth0|', '')).then((res) => {
              if (res.status === 200 && res.data.length > 0) {
                store.commit('setUser', res.data[0])
                if (isEnableMinPanel) {
                  Vue.prototype.$mixpanel.identify(res.data[0].id)
                  Vue.prototype.$mixpanel.people.set({
                    $email: res.data[0].email,
                    'Sign up date': moment().toISOString(),
                    USER_ID: `${res.data[0].firstName} ${res.data[0].lastName}`,
                    credits: 150,
                  })

                  Vue.prototype.$mixpanel.track('Logged In', { genre: 'hip-hop', 'duration in seconds': 42 })
                }
                resolve()
              }
            }).catch(() => {
              store.commit('setUser', null)
            })
          } else if (err) {
            this.logout()
            reject(err)
          }
        })
      })
    },
  },
})
Vue.use(auth)
export default auth

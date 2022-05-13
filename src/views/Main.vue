<template>
  <v-app id="inspire" v-if="auth">
    <transition name="fade" mode="out-in" appear>
      <HeaderContent />
    </transition>

    <transition name="fade" mode="out-in" appear>
      <Navigation />
    </transition>

    <v-main>
      <v-container fluid>
        <transition name="fade" mode="out-in" appear>
          <router-view />
        </transition>
      </v-container>
    </v-main>

    <transition name="fade" mode="out-in" appear>
      <FooterContent />
    </transition>

    <transition name="fade" mode="out-in" appear>
      <v-row justify="center">
        <v-dialog v-model="isMainTutorialShow" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card height="100%">
            <v-toolbar color="primary">
              <v-btn @click="doneMainTutorial">Skip</v-btn>
              <v-spacer />
              <v-toolbar-title class="white--text">Main Tutorial</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-container style="height: calc(100% - 64px);" fluid>
              <v-fade-transition mode="out-in">
                <v-card height="100%">
                  <v-img src="@/assets/images/mainTutorial-1.png" height="calc(100% - 52px)" contain v-if="step === 1" />
                  <v-img src="@/assets/images/mainTutorial-2.png" height="calc(100% - 52px)" contain v-if="step === 2" />
                  <v-img src="@/assets/images/mainTutorial-3.png" height="calc(100% - 52px)" contain v-if="step === 3" />
                  <v-img src="@/assets/images/mainTutorial-4.png" height="calc(100% - 52px)" contain v-if="step === 4" />
                  <v-img src="@/assets/images/mainTutorial-5.png" height="calc(100% - 52px)" contain v-if="step === 5" />
                  <v-img src="@/assets/images/mainTutorial-6.png" height="calc(100% - 52px)" contain v-if="step === 6" />
                  <v-card-actions class="primary">
                    <v-btn dark icon v-if="step > 1" @click="step--">
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn dark icon v-if="step < 6" @click="step++">
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                    <v-btn dark icon v-if="step === 6" @click="doneMainTutorial">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-fade-transition>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </transition>

    <transition name="fade" mode="out-in" appear>
      <v-row justify="center">
        <v-dialog v-model="isMessageTutorialShow" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card height="100%">
            <v-toolbar color="primary">
              <v-btn @click="doneMessageTutorial">Skip</v-btn>
              <v-spacer />
              <v-toolbar-title class="white--text">Main Tutorial</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-container style="height: calc(100% - 64px);" fluid>
              <v-fade-transition mode="out-in">
                <v-card height="100%">
                  <v-img src="@/assets/images/messagesTutorial-1.png" height="calc(100% - 52px)" contain v-if="step === 1" />
                  <v-img src="@/assets/images/messagesTutorial-2.png" height="calc(100% - 52px)" contain v-if="step === 2" />
                  <v-img src="@/assets/images/messagesTutorial-3.png" height="calc(100% - 52px)" contain v-if="step === 3" />
                  <v-img src="@/assets/images/messagesTutorial-4.png" height="calc(100% - 52px)" contain v-if="step === 4" />
                  <v-img src="@/assets/images/messagesTutorial-5.png" height="calc(100% - 52px)" contain v-if="step === 5" />
                  <v-card-actions class="primary">
                    <v-btn dark icon v-if="step > 1" @click="step--">
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn dark icon v-if="step < 5" @click="step++">
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                    <v-btn dark icon v-if="step === 5" @click="doneMessageTutorial">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-fade-transition>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </transition>
  </v-app>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import HeaderContent from '../components/layouts/HeaderContent.vue'
import Navigation from '../components/layouts/Navigation.vue'
import FooterContent from '../components/layouts/FooterContent.vue'
import Service from '../service'

export default {
  name: 'Home',
  components: {
    FooterContent,
    Navigation,
    HeaderContent,
  },
  data: () => ({
    isMainTutorialShow: false,
    isMessageTutorialShow: false,
    model: 0,
    step: 1,
    mainTutorials: ['mainTutorial-1.jpg'],
  }),
  computed: {
    ...mapGetters(['auth', 'isMainTutorial', 'isMessageTutorial']),
  },
  created() {
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${this.auth.token}`

    this.$UA.then((sdk) => {
      if (sdk.channel === null || sdk.channel.id === null) {
        sdk.register()
        sdk.plugins.load('html-prompt', 'https://aswpsdkus.com/notify/v1/ua-html-prompt.min.js', { askAgainDelay: 3600 }).then((plugin) => plugin.prompt())
      }
      Service.registerPushNotification(this.auth.userID, { channelID: sdk.channel.id })
    }).catch((err) => {
      console.log(err.message)
    })

    this.getAllTeamMembers(this.auth.userID)
    this.getAllGroupTextMembers(this.auth.userID)
    this.getAllTags(this.auth.userID)
    this.getCurrentStatus(this.auth.userID)
    this.getDefaultStatus(this.auth.userID)
    this.getAllStatus(this.auth.userID)
    this.getAllStatusMessages(this.auth.userID)
    this.getAllStatusCallbackMessages(this.auth.userID)
    this.getSchedules(this.auth.userID)
    this.getAllNotificationSetting(this.auth.userID)
  },
  watch: {
    $route(to) {
      if (to.name === 'dashboard' && this.isMainTutorial === false) {
        this.isMainTutorialShow = true
      }

      if (to.name === 'message' && this.isMessageTutorial === false) {
        this.isMessageTutorialShow = true
      }
    },
  },
  mounted() {
    if (this.$route.name === 'dashboard' && this.isMainTutorial === false) {
      this.isMainTutorialShow = true
    }

    if (this.$route.name === 'message' && this.isMessageTutorial === false) {
      this.isMessageTutorialShow = true
    }
  },
  methods: {
    ...mapActions(['getAllTeamMembers', 'getAllGroupTextMembers', 'getAllTags', 'getCurrentStatus', 'getAllStatus', 'getAllStatusMessages', 'getSchedules',
      'getAllStatusCallbackMessages', 'getDefaultStatus', 'getAllNotificationSetting']),
    doneMainTutorial() {
      this.$store.commit('setMainTutorial', true)
      this.isMainTutorialShow = false
      this.step = 1
    },
    doneMessageTutorial() {
      this.$store.commit('setMessageTutorial', true)
      this.isMessageTutorialShow = false
      this.step = 1
    },
  },
}
</script>

<style>
a:hover {
  text-decoration: none;
}
</style>

<template>
  <v-app-bar dark color="primary" app clipped-left extension-height="110" class="header">
    <v-app-bar-nav-icon @click="showNav" class="cursorPointer"></v-app-bar-nav-icon>

    <v-toolbar-title class="d-sm-block d-none cursorPointer pl-0" @click="$router.push('/')">
      <v-img :src="logo" width="230" contain />
    </v-toolbar-title>
    <v-toolbar-title class="d-sm-none d-block cursorPointer mx-2 w-45p" @click="$router.push('/')">
      <v-img :src="smallLogo" height="40" contain />
    </v-toolbar-title>
    <v-spacer />

    <template v-slot:extension class="secondary">
      <SubHeader />
    </template>

    <v-spacer></v-spacer>

    <v-btn class="mx-2" text fab small dark @click="goToChangeLog">
      <v-icon>mdi-chart-line</v-icon>
    </v-btn>

    <v-divider inset vertical class="d-sm-block d-none" />

    <v-btn class="ma-2 py-1 d-sm-block d-none white--text text-capitalize" color="primary" @click="goToProfile">
      <v-avatar size="24" class="menu_avatar mr-2">
        <v-img :src="userAvatar" />
      </v-avatar>
      {{ user.firstName }} {{ user.lastName }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SubHeader from './SubHeader.vue'

export default {
  name: 'HeaderContent',
  components: { SubHeader },
  data: (vm) => ({
    logo: `${vm.$imgLink}Answering-Legal_WHT.png`,
    smallLogo: `${vm.$imgLink}ALIcon.png`,
  }),
  computed: {
    ...mapGetters(['auth', 'user']),
    userAvatar: (vm) => vm.$imgLink + (vm.user.usersImageURL || vm.$avatar),
  },
  methods: {
    goToProfile() {
      if (this.$route.name !== 'profile') {
        this.$router.push({ name: 'profile' })
      }
    },
    goToChangeLog() {
      if (this.$route.name !== 'logs') {
        this.$router.push({ name: 'logs' })
      }
    },
    showNav() {
      this.$root.$emit('openNav')
    },
  },
}
</script>

<style scoped>
.menu_avatar {
  border: .1rem solid;
}

.text-lowercase {
  font-size: 0.8em;
}
</style>

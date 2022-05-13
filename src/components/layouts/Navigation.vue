<template>
  <v-navigation-drawer v-model="drawer" dark color="primary" clipped app width="200">
    <v-list dense nav class="py-0">
      <v-divider class="d-sm-none d-block"></v-divider>

      <v-list-item class="d-sm-none d-flex" two-line v-if="user" to="profile">
        <v-list-item-avatar>
          <v-avatar size="40" class="nav_avatar">
            <v-img :src="userAvatar" />
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.companyName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="drawer = !drawer" class="d-lg-none d-flex">
        <v-list-item-icon>
          <v-icon>mdi-arrow-left-bold</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="primaryText">
          <v-list-item-title>Close</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-badge color="red" :content="count" inline overlap v-if="item.title === 'MESSAGES' && count > 0">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-badge>
          <v-list-item-title v-else>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="#848484" block @click="logout">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'

export default {
  name: 'Navigation',
  data() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    return {
      drawer: vw > 1264,
      value: null,
      items: [{
        title: 'HOME',
        icon: 'mdi-view-dashboard',
        to: '/',
      }, {
        title: 'MESSAGES',
        icon: 'mdi-email',
        to: '/messages',
      }, {
        title: 'TASKS',
        icon: 'mdi-notebook',
        to: '/tasks',
      }, {
        title: 'STATUS MANAGER',
        icon: 'mdi-calendar',
        to: '/schedules',
      }, {
        title: 'CONTACTS',
        icon: 'mdi-account',
        to: '/contacts',
      }, {
        title: 'SUPPORT',
        icon: 'mdi-help-circle',
        to: '/support',
      }, {
        title: 'ACTIVITY FEED',
        icon: 'mdi-chart-line',
        to: '/logs',
      }, {
        title: 'SETTINGS',
        icon: 'mdi-cogs',
        to: '/settings',
      }],
      count: 0,
    }
  },
  computed: {
    ...mapGetters(['auth', 'user', 'messages']),
    userAvatar: (vm) => vm.$imgLink + (vm.user.usersImageURL || vm.$avatar),
  },
  watch: {
    messages: {
      handler() {
        this.getUnreadMessageCounter()
      },
      deep: true,
    },
  },
  mounted() {
    this.$root.$on('openNav', () => {
      this.drawer = !this.drawer
    })

    this.$root.$on('getCounter', () => {
      this.getUnreadMessageCounter()
    })
  },
  methods: {
    getUnreadMessageCounter() {
      Service.getUnreadMessageCounter(this.auth.userID).then((res) => {
        if (res.status === 200) {
          this.count = res.data[0]['COUNT(*)']
          this.$store.commit('setUnreadMessageCounter', res.data[0]['COUNT(*)'])
        }
      })
    },
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

<style scoped>
.nav_avatar {
  border: .15rem solid;
}
</style>

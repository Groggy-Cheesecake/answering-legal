<template>
  <v-row class="px-4">
    <v-col cols="12">
      <GroupText />
    </v-col>
    <v-col cols="12">
      <Integrations />
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-toolbar dense class="primary text-white z-index-1 position-relative">
          <v-toolbar-title class="ma-auto d-flex justify-center">
            Notification Dashboard
          </v-toolbar-title>
        </v-toolbar>
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-row class="px-3">
          <v-col sm="12" md="4" cols="12">
            <MessageNotificationForm />
          </v-col>
          <v-col sm="12" md="4" cols="12">
            <TaskNotificationForm />
          </v-col>
          <v-col sm="12" md="4" cols="12">
            <ScheduleNotificationForm />
            <SupportNotificationForm />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '@/service'
import Integrations from '@/views/settings/Integrations.vue'
import { isEnableMinPanel } from '@/plugins/auth0'
import GroupText from './GroupText.vue'
import TaskNotificationForm from './TaskNotificationForm.vue'
import ScheduleNotificationForm from './ScheduleNotificationForm.vue'
import SupportNotificationForm from './SupportNotificationForm.vue'
import MessageNotificationForm from './MessageNotificationForm.vue'

export default {
  name: 'profile',
  data: () => ({
    loading: false,
  }),
  components: {
    Integrations,
    MessageNotificationForm,
    SupportNotificationForm,
    ScheduleNotificationForm,
    TaskNotificationForm,
    GroupText,
  },
  computed: {
    ...mapGetters(['auth']),
  },
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Settings', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
    this.loading = true
    Service.getAllNotificationSetting(this.auth.userID).then((res) => {
      if (res.status === 200) {
        this.$store.commit('setAllNotificationSetting', res.data)
      } else {
        this.$store.commit('setAllNotificationSetting', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      this.$store.commit('setAllNotificationSetting', null)
    }).finally(() => {
      this.loading = false
    })
  },
}
</script>

<style scoped>

</style>

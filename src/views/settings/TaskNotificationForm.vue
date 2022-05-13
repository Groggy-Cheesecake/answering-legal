<template>
  <v-card class="elevation-0">
    <v-card-title>
      Tasks Notification
    </v-card-title>
    <v-divider class="ma-0" />
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-0">
          <h5 class="mb-0 primaryText">My Tasks</h5>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" class="pt-0" v-for="notification in myTaskNotifications" :key="notification.typeNotificationID">
          <v-switch v-model="notification.isStatusOn" hide-details dense class="ma-0" color="green" :label="`${notification.subType}`"
                    @change="changeNotification(notification)" />
        </v-col>
      </v-row>
      <v-row class="pt-4">
        <v-col cols="12" class="py-0">
          <h5 class="mb-0 primaryText">Tasks assigned to other users</h5>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" class="pt-0" v-for="notification in otherTaskNotifications" :key="notification.typeNotificationID">
          <v-switch v-model="notification.isStatusOn" hide-details dense class="ma-0" color="green" :label="`${notification.subType}`"
                    @change="changeNotification(notification)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '@/service'

export default {
  name: 'TaskNotificationForm',
  data: () => ({
    isAll: true,
    myTaskNotifications: [],
    otherTaskNotifications: [],
  }),
  computed: {
    ...mapGetters(['auth', 'allNotificationSetting']),
  },
  mounted() {
    this.myTaskNotifications = this.allNotificationSetting.filter((item) => item.type === 'My Tasks')
    this.otherTaskNotifications = this.allNotificationSetting.filter((item) => item.type === 'Task assigned to other users')
  },
  methods: {
    changeNotification(item) {
      Service.updateNotification(this.auth.userID, {
        typeNotificationID: item.typeNotificationID,
        isStatusOn: item.isStatusOn ? 1 : 0,
      }).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Updated the Notification Setting!')
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      })
    },
  },
}
</script>

<style scoped>

</style>

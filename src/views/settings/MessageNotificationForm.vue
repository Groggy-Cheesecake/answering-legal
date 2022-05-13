<template>
  <v-card class="elevation-0">
    <v-card-title>
      Message Notification
    </v-card-title>
    <v-divider class="ma-0" />
    <v-card-text>
      <v-row>
        <v-col class="py-0">
          <h5 class="mb-0 primaryText">New Message</h5>
        </v-col>
        <v-col cols="auto" class="py-0">
          <v-switch v-model="isAll" hide-details dense class="ma-0" color="green" label="All" @change="changeAllNotification" />
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" class="pt-0">
        </v-col>
        <v-col cols="12" class="pt-0" v-for="notification in newMessageNotifications" :key="notification.typeNotificationID">
          <v-switch v-model="notification.isStatusOn" hide-details dense class="ma-0" color="green" :label="`${notification.subType}`"
                    @change="changeNotification(notification)" />
        </v-col>
      </v-row>
      <v-row class="pt-4">
        <v-col cols="12" class="py-0">
          <h5 class="mb-0 primaryText">Set Appointment</h5>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" class="pt-0" v-for="notification in setAppointmentNotifications" :key="notification.typeNotificationID">
          <v-switch v-model="notification.isStatusOn" hide-details dense class="ma-0" color="green" :label="`${notification.subType}`"
                    @change="changeNotification(notification)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Service from '@/service'

export default {
  name: 'MessageNotificationForm',
  data: () => ({
    isAll: true,
    newMessageNotifications: [],
    setAppointmentNotifications: [],
  }),
  computed: {
    ...mapGetters(['auth', 'allNotificationSetting']),
  },
  watch: {
    newMessageNotifications: {
      handler(val) {
        const isFalse = _.filter(val, (v) => !v.isStatusOn)
        this.isAll = isFalse.length <= 0
      },
      deep: true,
    },
    isAll(val) {
      if (val) {
        this.newMessageNotifications.forEach((notification) => {
          if (notification.isStatusOn === false) {
            // eslint-disable-next-line no-param-reassign
            notification.isStatusOn = true
            this.changeNotification(notification)
          }
        })
      }
    },
  },
  mounted() {
    this.newMessageNotifications = this.allNotificationSetting.filter((item) => item.type === 'New Message')
    this.setAppointmentNotifications = this.allNotificationSetting.filter((item) => item.type === 'Set Appointment')
  },
  methods: {
    changeAllNotification(val) {
      if (!val) {
        this.newMessageNotifications.forEach((notification) => {
          if (notification.isStatusOn === true) {
            // eslint-disable-next-line no-param-reassign
            notification.isStatusOn = false
            this.changeNotification(notification)
          }
        })
      }
    },
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

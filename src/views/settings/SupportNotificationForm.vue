<template>
  <v-card class="elevation-0">
    <v-card-title>
      Support Notification
    </v-card-title>
    <v-divider class="ma-0" />
    <v-card-text>
      <v-row>
        <v-col cols="12" class="pt-0" v-for="notification in supportNotifications" :key="notification.typeNotificationID">
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
  name: 'SupportNotificationForm',
  data: () => ({
    supportNotifications: [],
    notifications: {
      isNew: true,
      isExisting: true,
      isGeneral: true,
      isUrgent: true,
      isJudge: true,
      isCourt: true,
      isFamily: true,
      isInsurance: true,
      isJail: true,
      isSpanish: true,
      isSolicitation: true,
      isMiscellaneous: true,
    },
  }),
  computed: {
    ...mapGetters(['auth', 'allNotificationSetting']),
  },
  mounted() {
    this.supportNotifications = this.allNotificationSetting.filter((item) => item.groupName === 'Support Notification')
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

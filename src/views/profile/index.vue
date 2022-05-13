<template>
  <v-row class="px-4">
    <v-col sm="12" md="5" lg="4" xl="3" cols="12">
      <BannerCard />
      <TeamMembers />
    </v-col>
    <v-col sm="12" md="7" lg="8" xl="9" cols="12">
      <EditProfileForm :isEdit="isEdit" @cancel="cancel" />
    </v-col>
  </v-row>
</template>

<script>
import { isEnableMinPanel } from '@/plugins/auth0'
import BannerCard from '../settings/BannerCard.vue'
import EditProfileForm from './EditProfileForm.vue'
import TeamMembers from './TeamMembers.vue'

export default {
  name: 'profile',
  components: {
    TeamMembers,
    EditProfileForm,
    BannerCard,
  },
  data: () => ({
    isEdit: false,
    isNotificationEdit: false,
  }),
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Profile', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
  },
  methods: {
    cancel() {
      this.isEdit = !this.isEdit
    },
    cancelNotification() {
      this.isNotificationEdit = !this.isNotificationEdit
    },
  },
}
</script>

<style scoped>

</style>

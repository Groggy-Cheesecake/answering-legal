<template>
  <v-col cols="12">
    <router-view />
  </v-col>
</template>

<script>

import { isEnableMinPanel } from '@/plugins/auth0'

export default {
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Schedule', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
  },
}
</script>

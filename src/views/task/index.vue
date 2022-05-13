<template>
  <v-col cols="12">
    <TaskList />
  </v-col>
</template>

<script>
import { isEnableMinPanel } from '@/plugins/auth0'
import TaskList from './TaskList.vue'

export default {
  components: { TaskList },
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Tasks', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
  },
}
</script>

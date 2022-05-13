<template>
  <v-row class="px-0">
    <v-col cols="12" sm="6">
      <MessageList isSmall />
    </v-col>
    <v-col cols="12" sm="6">
      <TaskList isSmall />
    </v-col>
    <v-col cols="12" sm="6">
      <ScheduleList isSmall />
    </v-col>
    <v-col cols="12" sm="6">
      <ContactList isSmall />
    </v-col>
  </v-row>
</template>

<script>
import MessageList from '../messages/MessageList.vue'
import TaskList from '../task/TaskList.vue'
import ScheduleList from '../schedules/ScheduleList.vue'
import ContactList from '../contacts/ContactList.vue'

export default {
  name: 'home',
  components: {
    ContactList,
    ScheduleList,
    TaskList,
    MessageList,
  },
  data: () => ({
    isEdit: false,
  }),
  methods: {
    cancel() {
      this.isEdit = !this.isEdit
    },
  },
}
</script>

<style scoped>

</style>

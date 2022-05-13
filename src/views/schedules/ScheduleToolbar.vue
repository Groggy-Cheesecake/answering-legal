<template>
  <v-toolbar dense class="primary text-white z-index-1 position-relative schedule-toolbar">
    <v-toolbar-title class="m-auto d-flex justify-center">
      <v-icon left color="white">mdi-calendar</v-icon>
      Status Manager
    </v-toolbar-title>
    <v-spacer v-if="!isSmall" />
    <v-checkbox v-model="isAll" label="Show Default Status" class="pr-4" dark dense hide-details v-if="!isSmall" />
    <v-btn class="secondary mr-4" @click="createStatus" v-if="!isSmall">
      <v-icon left>mdi-plus</v-icon>
      New Status Templates
    </v-btn>
    <v-btn class="secondary" @click="createSchedule" v-if="!isSmall">
      <v-icon left>mdi-calendar-plus</v-icon>
      NEW
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'ScheduleToolbar',
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isAll: true,
  }),
  watch: {
    isAll(val) {
      this.$root.$emit('showAllEvents', val)
    },
  },
  mounted() {
    this.today = {
      year: this.$moment().format('YYYY'),
      month: this.$moment().format('MMMM'),
      day: this.$moment().format('D'),
      week: this.$moment().format('ddd'),
    }
  },
  methods: {
    createSchedule() {
      this.$emit('createSchedule', `${this.today.year}-${this.today.month}-${this.today.day}`)
    },
    createStatus() {
      this.$emit('createStatus')
    },
  },
}
</script>

<style>
.schedule-toolbar .theme--dark.v-label {
  color: white;
  margin-bottom: 2px;
}
</style>

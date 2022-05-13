<template>
  <v-dialog v-model="isShow" persistent max-width="620">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
          <v-icon left color="white">mdi-notebook</v-icon>
          Task Filter
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider class="ma-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="error" @click="clearFilter">
          <v-icon left color="white">mdi-delete</v-icon>
          Clear
        </v-btn>
        <v-btn color="secondary" @click="filterTask()">
          <v-icon left color="white">mdi-filter</v-icon>
          Filter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TaskFilterForm',
  props: ['isShow'],
  data: () => ({
    isDateEdit: false,
    filter: {},
  }),
  computed: {
    ...mapGetters(['taskFilter']),
  },
  watch: {
    isShow(val) {
      if (val) {
        this.filter = { ...this.taskFilter }
      }
    },
  },
  methods: {
    clearFilter() {
      const taskFilter = {
        status: null,
        startDate: null,
      }

      const searchFilter = { ...this.filter, ...taskFilter }
      this.$store.commit('setTaskFilter', searchFilter)
      this.$emit('save')
    },
    filterTask() {
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>

</style>

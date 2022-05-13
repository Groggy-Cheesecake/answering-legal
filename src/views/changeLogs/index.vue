<template>
  <v-col cols="12">
    <v-row>
      <v-col sm="6" cols="12">
        <v-select v-model="filter" :items="filterList" label="Filter" multiple hide-details prepend-inner-icon="mdi-filter">
          <template v-slot:prepend-item>
            <v-list-item @click="setAll">
              <v-list-item-action>
                <v-icon color="primary">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-progress-linear indeterminate size="64" v-if="isLoading"></v-progress-linear>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="(log,i) in logList" :key="i">
        <v-expansion-panel-header>
          <p class="mb-0">Update made by: {{ log.changesMade }}</p>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p class="text-uppercase">update made: {{ log.dateChangesMade | moment('YYYY-MM-DD hh:mm:ss A') }}</p>
          <p class="text-uppercase">update made by: {{ log.changesMade }}</p>
          <p class="text-uppercase">method: {{ log.changedFromApp }}</p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script>
import Service from '@/service'
import { mapGetters } from 'vuex'
import { isEnableMinPanel } from '@/plugins/auth0'

export default {
  name: 'index',
  data: () => ({
    search: '',
    logList: [],
    itemsPerPageArray: [10, 25, 50],
    pageNumber: 1,
    pageSize: 10,
    isLoading: false,
    filter: ['Messages', 'Contacts', 'Tasks', 'Profile', 'Settings', 'Schedule'],
    filterList: ['Messages', 'Contacts', 'Tasks', 'Profile', 'Settings', 'Schedule'],
  }),
  computed: {
    ...mapGetters(['auth']),
    likesAllFilters() {
      return this.filter.length === this.filterList.length
    },
    likesSomeFilters() {
      return this.filter.length > 0 && !this.likesAllFilters
    },
    icon() {
      if (this.likesAllFilters) return 'mdi-checkbox-marked'
      if (this.likesSomeFilters) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    numberOfPages() {
      return Math.ceil(this.logList.length / this.pageSize)
    },
  },
  watch: {
    filter(val, oldVal) {
      if (val.length === 0 && oldVal.length === 1) {
        this.filter = [...oldVal]
      }
      this.getChangeLogs()
    },
    pageNumber() {
      this.getChangeLogs()
    },
    pageSize() {
      this.getChangeLogs()
    },
  },
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Change Logs', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
    this.getChangeLogs()
  },
  methods: {
    getChangeLogs() {
      this.isLoading = true
      if (this.filter.length === 6) {
        Service.getAllChangeLogs(this.auth.userID, this.pageNumber, this.pageSize).then((res) => {
          if (res.status === 200) {
            this.logList = res.data
          }
        }).finally(() => {
          this.isLoading = false
        })
      } else {
        Service.getFilterChangeLogs(this.auth.userID, this.pageNumber, this.pageSize, this.filter.join()).then((res) => {
          if (res.status === 200) {
            this.logList = res.data
          }
        }).finally(() => {
          this.isLoading = false
        })
      }
    },
    setAll() {
      this.$nextTick(() => {
        if (!this.likesAllFilters) {
          this.filter = this.filterList.slice()
        }
      })
    },
    nextPage() {
      if (this.pageNumber + 1 <= this.numberOfPages) this.pageNumber += 1
    },
    formerPage() {
      if (this.pageNumber - 1 >= 1) this.pageNumber -= 1
    },
    updateItemsPerPage(number) {
      this.pageSize = number
    },
  },
}
</script>

<style scoped>

</style>

<template>
  <v-dialog v-model="isShow" persistent max-width="620">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
          <v-icon left color="white">mdi-filter</v-icon>
          Message Filter
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <v-checkbox v-model="filter.isFavorite" label="Favorite" class="pr-4" hide-details :true-value="1" :false-value="null" />
        <v-row class="px-2" align="center">
          <v-col>
            <h6 class="primaryText mb-0">Dates </h6>
            <v-spacer />
          </v-col>
          <v-col cols="auto">
            <v-btn icon small class="mx-0 text-right" @click="isDateEdit = true" v-if="!isDateEdit">
              <v-icon small color="primary">mdi-calendar-edit</v-icon>
            </v-btn>
            <v-btn icon small class="mx-0 text-right" @click="clearRange" v-if="!isDateEdit && isSetRange">
              <v-icon small color="red">mdi-calendar-remove</v-icon>
            </v-btn>
            <template v-if="isDateEdit">
              <v-btn icon small class="mx-0 text-right" @click="saveSetRange">
                <v-icon small color="primary">mdi-content-save</v-icon>
              </v-btn>
              <v-btn icon small class="mx-0 text-right" @click="cancelSetRange">
                <v-icon small color="primary">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-col>
          <v-col cols="12" class="pt-0" v-if="!isDateEdit && !isSetRange">
            <h5 class="text-center primaryText mb-0">All Date</h5>
          </v-col>
          <v-col cols="12" class="pt-0" v-if="isDateEdit">
            <v-row align="center">
              <v-col class="py-0">
                <label>Start Date</label>
                <DatePicker v-model="range.fromDate" format="MM/DD/YYYY" :valueType="'YYYY-MM-DD'" :clearable="false" :editable="false" />
              </v-col>
              <v-col class="py-0">
                <label>Start Time</label>
                <DatePicker v-model="range.fromTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false"
                            :editable="false" />
              </v-col>
              <v-col cols="auto" class="px-2 py-0">
                <v-icon color="primary" size="36" class="mt-5">mdi-arrow-right-bold</v-icon>
              </v-col>
              <v-col class="py-0">
                <label>End Date</label>
                <DatePicker v-model="range.toDate" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" />
              </v-col>
              <v-col class="py-0">
                <label>End Time</label>
                <DatePicker v-model="range.toTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false"
                            :editable="false" />
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="red--text text-center mb-0 mt-2" v-if="isValidError">The start DateTime must be before the end DateTime.</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pt-0" v-if="!isDateEdit && isSetRange">
            <v-row align="center">
              <v-col class="py-0">
                <label>Start Date</label>
                <h4 class="mb-0 primaryText">{{ convertTime(range.fromDate, range.fromTime) }}</h4>
              </v-col>
              <v-col cols="auto" class="px-2 py-0">
                <v-icon color="primary" size="36" class="mt-5">mdi-arrow-right-bold</v-icon>
              </v-col>
              <v-col class="py-0">
                <label>End Date</label>
                <h4 class="mb-0 primaryText">{{ convertTime(range.toDate, range.toTime) }}</h4>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-0 mt-2" />
        <v-row class="px-2">
          <v-col>
            <h6 class="primaryText mb-0">Sort By</h6>
            <v-chip-group v-model="filter.sortBy" column active-class="secondary--text secondary">
              <v-chip filter outlined value="dateReceived">Date</v-chip>
              <v-chip filter outlined value="callTypeID">Type</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
        <v-divider class="my-0 mt-2" />
        <!--        <v-row class="px-2">-->
        <!--          <v-col>-->
        <!--            <h6 class="primaryText mb-0">Search</h6>-->
        <!--            <v-chip-group v-model="filter.searchFields" column multiple active-class="secondary&#45;&#45;text secondary">-->
        <!--              <v-chip filter outlined value="name">Name</v-chip>-->
        <!--              <v-chip filter outlined value="email">Email</v-chip>-->
        <!--              <v-chip filter outlined value="message">Message</v-chip>-->
        <!--              <v-chip filter outlined value="phone">Phone</v-chip>-->
        <!--            </v-chip-group>-->
        <!--          </v-col>-->
        <!--        </v-row>-->
        <!--        <v-divider class="my-0 mt-2" />-->
        <v-row class="px-2">
          <v-col>
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header class="pa-0"><h6 class="primaryText mb-0">Tags</h6></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group v-model="filter.searchTags" column multiple active-class="secondary--text secondary">
                    <template v-for="(tag, i) in allTags">
                      <v-chip :key="i" filter outlined :value="tag.tags">{{ tag.tags }}</v-chip>
                    </template>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="ma-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="error" @click="clearFilter">
          <v-icon left color="white">mdi-delete</v-icon>
          Clear
        </v-btn>
        <v-btn color="secondary" @click="search">
          <v-icon left color="white">mdi-magnify</v-icon>
          Search
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  TimePickerOptions, DateFormat, TimeFormat, DateTimeFormatByAMPM,
} from '../../const'

export default {
  name: 'FilterForm',
  props: ['isShow', 'searchWord'],
  data: () => ({
    isDateEdit: false,
    range: null,
    isValidError: false,
    timePickerOptions: TimePickerOptions,
    isSetRange: false,
    filter: {},
  }),
  computed: {
    ...mapGetters(['allTags', 'messageSearchFilter']),
  },
  watch: {
    isShow(val) {
      if (val) {
        this.filter = { ...this.messageSearchFilter }
      }
    },
    range: {
      handler(val) {
        if (val) {
          this.isValidError = this.$moment(`${val.fromDate} ${val.fromTime}`).unix() > this.$moment(`${val.toDate} ${val.toTime}`).unix()
        }
      },
      deep: true,
    },
    isDateEdit(val) {
      if (val) {
        const minute = this.$moment().format('mm') > 30 ? 30 : 0
        if (!this.isSetRange) {
          if (this.filter.startDate && this.filter.endDate) {
            this.range = {
              fromDate: this.$moment(this.filter.startDate).format(DateFormat),
              fromTime: this.$moment(this.filter.startDate).format(TimeFormat),
              toDate: this.$moment(this.filter.endDate).format(DateFormat),
              toTime: this.$moment(this.filter.endDate).format(TimeFormat),
            }
          } else {
            this.range = {
              fromDate: this.$moment().format(DateFormat),
              fromTime: this.$moment().set('minute', minute).set('second', 0).format(TimeFormat),
              toDate: this.$moment().add(30, 'minute').format(DateFormat),
              toTime: this.$moment(this.$moment().set('minute', minute).set('second', 0)).add(30, 'minute').format(TimeFormat),
            }
          }
        }
      }
    },
  },
  methods: {
    search() {
      let searchFilter = {
        ...this.filter,
        searchWords: this.searchWord,
        startDate: null,
        endDate: null,
      }
      if (this.isSetRange) {
        const startDate = this.$moment(this.$moment(`${this.range.fromDate} ${this.range.fromTime}`)).toISOString()
        const endDate = this.$moment(this.$moment(`${this.range.toDate} ${this.range.toTime}`)).toISOString()
        searchFilter = {
          ...searchFilter,
          startDate,
          endDate,
        }
      }
      this.$store.commit('setMessageSearchFilter', searchFilter)
      this.$emit('save')
    },
    clearFilter() {
      const messageSearchFilter = {
        searchWords: null,
        endDate: null,
        startDate: null,
        sortBy: 'dateReceived',
        searchFields: [],
        searchTags: [],
        isFavorite: null,
      }

      const searchFilter = { ...this.filter, ...messageSearchFilter }
      this.$store.commit('setMessageSearchFilter', searchFilter)
      this.$emit('save')
    },
    close() {
      this.$emit('close')
    },
    convertTime(date, time) {
      return this.$moment(`${date}T${time}`).format(DateTimeFormatByAMPM)
    },
    saveSetRange() {
      this.isDateEdit = false
      this.isSetRange = true
    },
    cancelSetRange() {
      this.isDateEdit = false
    },
    clearRange() {
      this.isSetRange = false
      this.isDateEdit = false
      this.range = null
    },
  },
}
</script>

<style scoped>

</style>

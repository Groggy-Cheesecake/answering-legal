<template>
  <v-card class="schedule">
    <ScheduleToolbar :isSmall="false" @createSchedule="createSchedule" @createStatus="createStatus" />
    <v-row no-gutters>
      <v-col cols="12" lg="12" xl="6" class="pa-0">
        <v-card-text>
          <ScheduleViewer :isSmall="false" @editSchedule="editSchedule" @onlyShow="onlyShow" />
        </v-card-text>
      </v-col>
      <v-col cols="12" xl="6" class="pa-0">
        <v-card-text>
          <Calendar @selectDate="selectDate" />
        </v-card-text>
      </v-col>
    </v-row>

    <v-dialog v-model="isShow" persistent max-width="540">
      <DefaultScheduleForm @close="closeDefaultScheduleForm" :item="event" v-if="isOnlyShow" />
      <DispatchStatusEdit :isEdit="false" @close="isFromToolbar ? close() : isNewStatus = false" @done="isFromToolbar ? close() : isNewStatus = false"
                          v-if="!isOnlyShow && isNewStatus" />
      <ScheduleEventForm :isShow="isShow" :isEdit="isEdit" :isFromDispatch="false" :item="event" @close="close" @createStatus="isNewStatus = true"
                         v-if="!isOnlyShow && !isNewStatus" />
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DateFormat, TimeFormat } from '@/const'
import ScheduleToolbar from './ScheduleToolbar.vue'
import Calendar from './Calendar.vue'
import ScheduleViewer from './ScheduleView.vue'
import ScheduleEventForm from '../../components/ScheduleEvents/ScheduleEventForm.vue'
import DispatchStatusEdit from '../../components/DispatchStatus/DispatchStatusEdit.vue'
import DefaultScheduleForm from '../../components/ScheduleEvents/DefaultScheduleForm.vue'

export default {
  name: 'Schedule',
  components: {
    DefaultScheduleForm,
    DispatchStatusEdit,
    ScheduleEventForm,
    ScheduleViewer,
    Calendar,
    ScheduleToolbar,
  },
  data: () => ({
    isShow: false,
    isEdit: false,
    event: null,
    isChangeEvent: false,
    isOnlyShow: false,
    isNewStatus: false,
    isFromToolbar: false,
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  mounted() {
    this.getSchedules(this.auth.userID)
  },
  methods: {
    ...mapActions(['getSchedules']),
    close() {
      this.isShow = false
      this.isFromToolbar = false
      if (this.isChangeEvent) {
        this.schedule.revert()
      }
    },
    closeDefaultScheduleForm() {
      this.isShow = false
      setTimeout(() => {
        this.isOnlyShow = false
      }, 150)
    },
    createStatus() {
      this.isShow = true
      this.isEdit = false
      this.isNewStatus = true
      this.isFromToolbar = true
    },
    createSchedule() {
      this.isShow = true
      this.isEdit = false
      this.isNewStatus = false
      this.isFromToolbar = false

      const minute = this.$moment().format('mm') > 30 ? 30 : 0
      this.event = {
        data: {},
        dispatchStatusID: 3,
        fromDate: this.$moment().format(DateFormat),
        fromTime: this.$moment().set('minute', minute).set('second', 0).format(TimeFormat),
        toDate: this.$moment().add(30, 'minute').format(DateFormat),
        toTime: this.$moment(this.$moment().set('minute', minute).set('second', 0)).add(30, 'minute').format(TimeFormat),
      }
    },
    editSchedule(schedule) {
      this.isShow = true
      this.isEdit = true
      this.event = {
        data: schedule,
        id: schedule.id,
        dispatchStatusID: schedule.dispatchStatusID,
        fromDate: this.$moment(schedule.startDate).format(DateFormat),
        fromTime: this.$moment(schedule.startDate).format(TimeFormat),
        toDate: this.$moment(schedule.endDate).format(DateFormat),
        toTime: this.$moment(schedule.endDate).format(TimeFormat),
      }
    },
    onlyShow(event) {
      this.isOnlyShow = true
      this.schedule = event
      this.isEdit = false
      this.isChangeEvent = false
      this.isShow = true
      this.event = {
        data: event,
        id: event.id,
        dispatchStatusID: event.dispatchStatusID,
        fromDate: this.$moment(event.startDate).format(DateFormat),
        fromTime: this.$moment(event.startDate).format(TimeFormat),
        toDate: this.$moment(event.endDate).format(DateFormat),
        toTime: this.$moment(event.endDate).format(TimeFormat),
      }
    },
    selectDate(val, status, isChangeEvent = false, isOnlyShow = false) {
      this.isOnlyShow = isOnlyShow
      this.schedule = val
      this.isEdit = status
      this.isChangeEvent = isChangeEvent
      this.isShow = true
      if (this.isEdit) {
        this.event = {
          data: val.event.extendedProps.data,
          id: val.event.extendedProps.data.id,
          dispatchStatusID: val.event.extendedProps.data.dispatchStatusID,
          fromDate: this.$moment(val.event.start).format(DateFormat),
          fromTime: this.$moment(val.event.start).format(TimeFormat),
          toDate: this.$moment(val.event.end).format(DateFormat),
          toTime: this.$moment(val.event.end).format(TimeFormat),
        }
      } else if (val.startStr === this.$moment().format(DateFormat)) {
        const minute = this.$moment().format('mm') > 30 ? 30 : 0

        this.event = {
          dispatchStatusID: 3,
          fromDate: this.$moment().format(DateFormat),
          fromTime: this.$moment().set('minute', minute).set('second', 0).format(TimeFormat),
          toDate: this.$moment().add(30, 'minute').format(DateFormat),
          toTime: this.$moment(this.$moment().set('minute', minute).set('second', 0)).add(30, 'minute').format(TimeFormat),
        }
      } else {
        this.event = {
          dispatchStatusID: 3,
          fromDate: this.$moment(val.start).format(DateFormat),
          fromTime: this.$moment(val.start).format(TimeFormat),
          toDate: this.$moment(val.start).add(30, 'minute').format(DateFormat),
          toTime: this.$moment(val.end).add(30, 'minute').format(TimeFormat),
        }
      }
    },
  },
}
</script>

<style scoped>

</style>

<template>
  <v-card v-bind:class="{ small: isSmall }">
    <ScheduleToolbar isSmall />
    <v-card-text class="schedule-content position-relative pa-0">
      <PerfectScrollbar class="mh-100 he-100">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <ScheduleViewer :isSmall="isSmall" @editSchedule="editSchedule" />
      </PerfectScrollbar>
    </v-card-text>
    <v-divider class="my-0"></v-divider>
    <v-card-actions>
      <v-btn class="secondary" @click="createSchedule">
        <v-icon left>mdi-calendar-plus</v-icon>
        NEW
      </v-btn>
      <v-spacer />
      <v-btn class="secondary pl-4" to="schedules">
        VIEW STATUS MANAGER
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="isShow" persistent max-width="540">
      <DispatchStatusEdit :isEdit="false" @close="isNewStatus = false" @done="isNewStatus = false" v-if="isNewStatus" />
      <ScheduleEventForm :isShow="isShow" :isEdit="isEdit" :isFromDispatch="false" @createStatus="isNewStatus = true" :item="event" @close="close" v-else />
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { DateFormat, TimeFormat } from '@/const'
import ScheduleToolbar from './ScheduleToolbar.vue'
import ScheduleViewer from './ScheduleView.vue'
import ScheduleEventForm from '../../components/ScheduleEvents/ScheduleEventForm.vue'
import DispatchStatusEdit from '../../components/DispatchStatus/DispatchStatusEdit.vue'

export default {
  name: 'ScheduleList',
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DispatchStatusEdit,
    ScheduleEventForm,
    ScheduleViewer,
    ScheduleToolbar,
  },
  data: () => ({
    loading: false,
    selected: null,
    isShow: false,
    isEdit: true,
    event: null,
    isNewStatus: false,
  }),
  computed: {
    ...mapGetters(['auth', 'schedules']),
  },
  methods: {
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
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
    createSchedule() {
      this.isShow = true
      this.isEdit = false
      const minute = this.$moment().format('mm') > 30 ? 30 : 0
      this.event = {
        dispatchStatusID: 3,
        fromDate: this.$moment().format(DateFormat),
        fromTime: this.$moment().set('minute', minute).set('second', 0).format(TimeFormat),
        toDate: this.$moment().add(30, 'minute').format(DateFormat),
        toTime: this.$moment(this.$moment().set('minute', minute).set('second', 0)).add(30, 'minute').format(TimeFormat),
      }
    },
    close() {
      this.isShow = false
      this.isEdit = true
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.schedule-content {
  min-height: 15rem;
  height: calc(100vh - 25.5rem);
}

.small .schedule-content {
  min-height: 15rem;
  height: calc(50vh - 17.5rem);
}

.schedule-item:hover {
  background: #EFEFEF;
  cursor: pointer;
}
</style>

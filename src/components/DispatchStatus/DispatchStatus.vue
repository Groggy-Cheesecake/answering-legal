<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <DispatchStatusList @close="close" v-if="isStatusList" @select="goToEdit" @updateSchedule="goToUpdateScheduleEvent" :isReload="isReload" />
    <DispatchStatusEdit :isEdit="isEdit" :status="selected" @close="back" @done="done" v-if="!isStatusList && !isUpdate" />
    <ScheduleEventForm :isShow="isUpdate" :isEdit="isEdit" :isFromDispatch="isFromDispatch" :item="item" @close="goToList" v-if="isUpdate" />
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DispatchStatusList from './DispatchStatusList.vue'
import DispatchStatusEdit from './DispatchStatusEdit.vue'
import ScheduleEventForm from '../ScheduleEvents/ScheduleEventForm.vue'
import { DateFormat, DateTimeFormat, TimeFormat } from '../../const'

export default {
  name: 'DispatchStatus',
  components: {
    ScheduleEventForm,
    DispatchStatusEdit,
    DispatchStatusList,
  },
  props: ['isShow'],
  data: () => ({
    isStatusList: true,
    isEdit: false,
    selected: null,
    isReload: true,
    isUpdate: false,
    isFromDispatch: false,
    item: null,
  }),
  computed: {
    ...mapGetters(['auth', 'currentStatus']),
  },
  methods: {
    ...mapActions(['getCurrentStatus']),
    close() {
      this.isStatusList = true
      this.isEdit = false
      this.isUpdate = false
      this.$emit('close')
    },
    back() {
      this.isStatusList = true
      this.isReload = false
    },
    goToList() {
      this.isStatusList = true
      this.isEdit = false
      this.isUpdate = false
      this.getCurrentStatus(this.auth.userID)
    },
    goToEdit(item, isEdit) {
      this.isStatusList = false
      this.isEdit = isEdit
      this.selected = item
    },
    goToUpdateScheduleEvent(item) {
      this.isStatusList = false
      this.isFromDispatch = true
      this.isUpdate = true
      this.isEdit = this.currentStatus.isDefaultStatus !== 1 || this.currentStatus.repeatCode === null

      if (this.isEdit) {
        this.item = {
          data: this.currentStatus,
          id: this.currentStatus.id,
          dispatchStatusID: item.dsid,
          fromDate: this.$moment(this.currentStatus.startDate).format(DateFormat),
          fromTime: this.$moment(this.currentStatus.startDate).format(TimeFormat),
          toDate: this.$moment(this.currentStatus.endDate).format(DateFormat),
          toTime: this.$moment(this.currentStatus.endDate).format(TimeFormat),
        }
      } else {
        const todayDate = this.$moment().format(DateFormat)
        const start = this.$moment(this.currentStatus.startDate)
        const end = this.$moment(this.currentStatus.endDate)
        const duration = this.$moment.duration(end.diff(start)).asMinutes()

        const startTime = this.$moment(start).format(TimeFormat)
        const endDate = this.$moment(this.$moment(`${todayDate} ${startTime}`)).add(duration, 'minutes')

        this.item = {
          data: this.currentStatus,
          id: this.currentStatus.id,
          dispatchStatusID: item.dsid,
          fromDate: this.$moment(`${todayDate} ${startTime}`, DateTimeFormat).format(DateFormat),
          fromTime: startTime,
          toDate: this.$moment(endDate).format(DateFormat),
          toTime: this.$moment(endDate).format(TimeFormat),
        }
      }
    },
    done() {
      this.isStatusList = true
      this.isReload = true
    },
  },
}
</script>

<style scoped>

</style>

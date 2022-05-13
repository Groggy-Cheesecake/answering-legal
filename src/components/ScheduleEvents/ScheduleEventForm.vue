<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
        <v-icon left color="white" v-if="isEdit">mdi-calendar-edit</v-icon>
        <v-icon left color="white" v-else>mdi-calendar-plus</v-icon>
        {{ isEdit ? 'Edit' : 'Add' }} Status
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon text small class="mx-0" @click="close">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="py-4" v-if="event">
      <v-row>
        <v-col cols="12" class="pa-0 text-right" v-if="!isEdit && !isFromDispatch">
          <v-btn class="secondary" @click="newStatus">
            <v-icon left>mdi-plus</v-icon>
            NEW STATUS TEMPLATE
          </v-btn>
        </v-col>
        <v-col>
          <v-select v-model="event.dispatchStatusID" :items="allStatus" item-text="statusName" item-value="dsid" label="Status" hide-details class="pa-0">
            <template v-slot:selection="{item}">
              <v-avatar size="26" class="mr-2">
                <v-img :src="statusImage(item.takingCalls)" />
              </v-avatar>
              {{ item.statusName }}
            </template>
            <template v-slot:item="{item}">
              <v-avatar size="26" class="mr-2">
                <v-img :src="statusImage(item.takingCalls)" />
              </v-avatar>
              {{ item.statusName }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-select v-model="messageID" :items="allStatusMessages" item-text="message" item-value="gsid" label="Message To Callers:" />
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-select v-model="callBackMessageID" :items="allStatusCallbackMessages" item-text="callBackMessage" item-value="cbid" label="When you will return the call:" />
        </v-col>
        <v-col cols="12" class=" align-center align-self-center">
          <v-row>
            <v-col cols="12" sm="12" md="6" class="py-0 text-center" align-self="center" v-if="isFromDispatch">
              <h4 class="mb-0">Start: Now</h4>
            </v-col>
            <template v-else>
              <v-col cols="12" sm="6" md="3" class="py-0">
                <label>Start Date</label>
                <DatePicker v-model="event.fromDate" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" />
              </v-col>
              <v-col cols="12" sm="6" md="3" class="py-0">
                <label>Start Time</label>
                <DatePicker v-model="event.fromTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false"
                            :editable="false" />
              </v-col>
            </template>
            <v-col cols="12" sm="6" md="3" class="py-0">
              <label>End Date</label>
              <DatePicker v-model="event.toDate" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" />
            </v-col>
            <v-col cols="12" sm="6" md="3" class="py-0">
              <label>End Time</label>
              <DatePicker v-model="event.toTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false"
                          :editable="false" />
            </v-col>
            <v-col cols="12" class="py-0">
              <p class="red--text text-center mb-0 mt-2" v-if="isValidError">The start DateTime must be before the end DateTime.</p>
            </v-col>
            <v-col class="py-0" v-if="repeat === 5">
              <CustomRepeat :event="event" @changed="(val) => {customRRuleTemp = val}" v-show="!isFromDispatch" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" v-if="!isFromDispatch">
          <v-select v-model="repeat" :items="repeatList" item-text="name" item-value="id" label="Repeat" hide-details :disabled="isFromDispatch" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-0" />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="close">Cancel</v-btn>
      <v-btn color="error" @click="deleteEvent(event.id)" :loading="isDeleteLoading" :disabled="isDeleteLoading" v-if="isEdit">
        <v-icon left color="white">mdi-delete</v-icon>
        Delete
      </v-btn>
      <v-btn color="secondary" @click="update" :loading="loading" :disabled="isDisableUpdate" v-if="isEdit">
        <v-icon left>mdi-content-save</v-icon>
        Update
      </v-btn>
      <v-btn color="secondary" @click="create" :loading="loading" :disabled="isDisableCreate" v-else>
        <v-icon left>mdi-content-save</v-icon>
        {{ isFromDispatch ? 'Update' : 'Create' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { TimePickerOptions } from '@/const'
import Service from '../../service'
import formatMixin from '../formatTimeMixin'
import CustomRepeat from './CustomRepeat.vue'

export default {
  name: 'ScheduleEventForm',
  components: { CustomRepeat },
  props: ['isShow', 'isFromDispatch', 'isEdit', 'item'],
  mixins: [formatMixin],
  data: (vm) => ({
    loading: false,
    isDeleteLoading: false,
    timePickerOptions: TimePickerOptions,
    repeat: 0,
    event: null,
    selectedStatus: null,
    repeatList: [{
      id: 0,
      name: 'Does not repeat',
    }, {
      id: 1,
      name: 'Daily',
    }, {
      id: 2,
      name: `Weekly on ${vm.$moment().format('dddd')}`,
    }, {
      id: 3,
      name: 'Monthly on the',
    }, {
      id: 4,
      name: 'Every weekday (Monday - Friday)',
    }, {
      id: 5,
      name: 'Custom',
    }],
    customRRuleTemp: null,
    isValidError: false,
    isDisableUpdate: false,
    isDisableCreate: false,
    messageID: null,
    callBackMessageID: null,

    momentFormat: {
      stringify: (date) => (date ? vm.$moment(date).format('LL') : ''),
    },
  }),
  computed: {
    ...mapGetters(['auth', 'allStatus', 'allStatusMessages', 'allStatusCallbackMessages']),
  },
  watch: {
    event: {
      handler(val) {
        this.isValidError = this.$moment(`${val.fromDate} ${val.fromTime}`).unix() > this.$moment(`${val.toDate} ${val.toTime}`).unix()
        this.isDisableCreate = this.isValidError
        this.isDisableUpdate = this.isValidError
      },
      deep: true,
    },
    'event.dispatchStatusID': function dispatchStatusID(val) {
      this.setStatusMessages(val)
    },
    isShow(val) {
      if (val) {
        this.setEvent()
      }
    },
  },
  mounted() {
    const firstWeekDayInMonth = this.$moment().set('date', 1).day() + 1
    const weekNumberInMonth = this.$moment().date()
    const numbers = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
    this.repeatList[3].name = `Monthly on the ${numbers[parseInt((firstWeekDayInMonth + weekNumberInMonth) / 7, 10)]} ${this.$moment().format('dddd')}`
    this.setEvent()
  },
  methods: {
    ...mapActions(['getSchedules', 'getCurrentStatus', 'getAllStatus']),
    setEvent() {
      this.event = { ...this.item }
      if (this.item.data && this.item.data.repeatCode) {
        this.repeat = this.setRepeat(this.item.data)
      } else {
        this.repeat = 0
      }
    },
    setStatusMessages(val) {
      const selectedStatus = this.allStatus.filter((d) => d.dsid === val)
      this.messageID = selectedStatus[0].gsid
      this.callBackMessageID = selectedStatus[0].cbid
    },
    statusImage(val) {
      const icon = this.$statusIconList.filter((d) => d.id === val)
      return this.$imgLink + icon[0].iconURL
    },
    close() {
      this.$emit('close')
    },
    newStatus() {
      this.$emit('createStatus')
    },
    create() {
      this.loading = true
      this.isDisableCreate = true

      const selectedStatus = this.allStatus.filter((d) => d.dsid === this.event.dispatchStatusID)
      if (selectedStatus[0].cbid === this.callBackMessageID && selectedStatus[0].gsid === this.messageID) {
        this.createDispatchScheduleEvent(this.event.dispatchStatusID)
      } else if (this.event.dispatchStatusID > 20) {
        const data = {
          dispatchStatusID: selectedStatus[0].dsid,
          statusName: selectedStatus[0].statusName,
          greetingScriptID: this.messageID,
          takingCalls: selectedStatus[0].takingCalls,
          isDefault: false,
          callBackScriptID: this.callBackMessageID,
        }

        Service.updateDispatchStatus(this.auth.userID, data).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'Updated the Dispatch Status!')
          }
        }).finally(() => {
          this.createDispatchScheduleEvent(selectedStatus[0].dsid)
        })
      } else {
        let createdStatusID = ''
        const data = {
          usersID: this.auth.userID,
          statusName: selectedStatus[0].statusName,
          greetingScriptID: this.messageID,
          takingCalls: selectedStatus[0].takingCalls,
          isDefault: false,
          createdByUsersID: this.auth.userID,
          callBackScriptID: this.callBackMessageID,
        }

        Service.createDispatchStatus(data).then((res) => {
          if (res.status === 200) {
            createdStatusID = res.data.insertId
            this.$root.$emit('snackbar', 'success', `Created the ${data.statusName} Dispatch Status!`)
          }
        }).finally(() => {
          this.createDispatchScheduleEvent(createdStatusID)
        })
      }
    },
    update() {
      this.loading = true
      this.isDisableUpdate = true
      if ((this.isFromDispatch && this.event.dispatchStatusID > 20) || (this.event.data.callBackScriptID === this.callBackMessageID && this.event.data.gsid === this.messageID)) {
        this.updateDispatchScheduleEvent(this.event.dispatchStatusID)
      } else if (this.event.data.dispatchStatusID > 20) {
        const data = {
          dispatchStatusID: this.event.data.dispatchStatusID,
          statusName: this.event.data.statusName,
          greetingScriptID: this.messageID,
          takingCalls: this.event.data.takingCalls,
          isDefault: false,
          callBackScriptID: this.callBackMessageID,
        }

        Service.updateDispatchStatus(this.auth.userID, data).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'Updated the Dispatch Status!')
          }
        }).finally(() => {
          this.updateDispatchScheduleEvent(this.event.dispatchStatusID)
        })
      } else {
        const data = {
          usersID: this.auth.userID,
          statusName: this.event.data.statusName,
          greetingScriptID: this.messageID,
          takingCalls: this.event.data.takingCalls,
          isDefault: false,
          createdByUsersID: this.auth.userID,
          callBackScriptID: this.callBackMessageID,
        }

        let createdStatusID = ''
        Service.createDispatchStatus(data).then((res) => {
          if (res.status === 200) {
            createdStatusID = res.data.insertId
            this.$root.$emit('snackbar', 'success', `Created the ${data.statusName} Dispatch Status!`)
          }
        }).finally(() => {
          this.updateDispatchScheduleEvent(createdStatusID)
        })
      }
    },
    createDispatchScheduleEvent(dsid) {
      const data = {
        usersID: this.auth.userID,
        dispatchStatusID: dsid,
        callBackScriptID: this.callBackMessageID,
        startDate: this.$moment(this.$moment(`${this.event.fromDate} ${this.event.fromTime}`)).toISOString(),
        endDate: this.$moment(this.$moment(`${this.event.toDate} ${this.event.toTime}`)).utc().toISOString(),
        repeatCode: this.getRepeatCode(this.repeat),
        isCustomRepeat: this.repeat === 5 ? 1 : 0,
      }

      if (this.isFromDispatch) data.repeatCode = null

      Service.createDispatchScheduleEvent(data).then((res) => {
        if (res.status === 200) {
          this.getAllStatus(this.auth.userID)
          this.getCurrentStatus(this.auth.userID)
          this.getSchedules(this.auth.userID)
          this.close()
          this.$root.$emit('snackbar', 'success', 'Created New Schedule!')
        }
      }).finally(() => {
        this.loading = false
        this.isDisableCreate = false
      })
    },
    updateDispatchScheduleEvent(dsid) {
      const data = {
        dispatchScheduleID: this.event.id,
        dispatchStatusID: dsid,
        callBackScriptID: this.callBackMessageID,
        startDate: this.$moment(this.$moment(`${this.event.fromDate} ${this.event.fromTime}`)).toISOString(),
        endDate: this.$moment(this.$moment(`${this.event.toDate} ${this.event.toTime}`)).toISOString(),
        repeatCode: this.getRepeatCode(this.repeat),
        isCustomRepeat: this.repeat === 5 ? 1 : 0,
      }

      Service.updateDispatchScheduleEvent(this.auth.userID, data).then((res) => {
        if (res.status === 200) {
          this.getCurrentStatus(this.auth.userID)
          this.getSchedules(this.auth.userID)
          this.getAllStatus(this.auth.userID)
          this.close()
          this.$root.$emit('snackbar', 'success', 'Updated Schedule!')
        }
      }).finally(() => {
        this.loading = false
        this.isDisableUpdate = false
      })
    },
    deleteEvent(id) {
      this.isDeleteLoading = true
      Service.deleteDispatchScheduleEvent(this.auth.userID, id).then((res) => {
        if (res.status === 200) {
          this.getCurrentStatus(this.auth.userID)
          this.getSchedules(this.auth.userID)
          this.close()
          this.$root.$emit('snackbar', 'success', 'Deleted Schedule!')
        }
      }).finally(() => {
        this.isDeleteLoading = false
      })
    },
    getRepeatCode(repeatType) {
      let repeatCode = null
      switch (repeatType) {
        case 1: // Daily
          repeatCode = JSON.stringify({ FREQ: 'DAILY' })
          break
        case 2: // Weekly on Week
          repeatCode = JSON.stringify({
            FREQ: 'WEEKLY',
            BYDAY: [this.$moment().format('dd').toUpperCase()],
          })
          break
        case 3: // Monthly on the {X} Week
          repeatCode = JSON.stringify({
            FREQ: 'MONTHLY',
            BYSETPOS: parseInt((this.$moment().set('date', 1).day() + 1 + this.$moment().date()) / 7, 10) + 1,
            BYDAY: [this.$moment().format('dd').toUpperCase()],
          })
          break
        case 4: // Every Week without weekend
          repeatCode = JSON.stringify({
            FREQ: 'WEEKLY',
            BYDAY: ['MO', 'TU', 'WE', 'TH', 'FR'],
          })
          break
        case 5: // Custom
          repeatCode = JSON.stringify({
            FREQ: this.customRRuleTemp.FREQ,
            BYDAY: this.customRRuleTemp.BYDAY,
            UNTIL: this.customRRuleTemp.until,
            COUNT: this.customRRuleTemp.count,
          })
          break
        default:
          break
      }

      return repeatCode
    },
    setRepeat(data) {
      const rruleObj = JSON.parse(data.repeatCode)
      let repeat = 0
      const correctMonthly = JSON.stringify({
        FREQ: 'MONTHLY',
        BYSETPOS: parseInt((this.$moment().set('date', 1).day() + 1 + this.$moment().date()) / 7, 10) + 1,
        BYDAY: [this.$moment().format('dd').toUpperCase()],
      })
      const correctWeekly = JSON.stringify({
        FREQ: 'WEEKLY',
        BYDAY: [this.$moment().format('dd').toUpperCase()],
      })
      switch (rruleObj.FREQ) {
        case 'DAILY': // Daily
          repeat = 1
          break
        case 'WEEKLY': // Weekly on {week} / Weekly
          if (data.isCustomRepeat === 1) {
            repeat = 5
          } else if (correctWeekly === data.repeatCode) {
            repeat = 2
          } else {
            repeat = rruleObj.BYDAY.length === 4 ? 4 : 5
          }
          break
        case 'MONTHLY': // Monthly on the{X} week
          repeat = correctMonthly === data.repeatCode ? 3 : 5
          break
        default:
          break
      }

      return repeat
    },
  },
}
</script>

<style scoped>

</style>

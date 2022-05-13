<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          {{ isEdit ? 'Edit' : 'Add' }} Task
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <v-row>
          <v-col cols="12" sm="6" class="pt-0">
            <label>Date</label>
            <br />
            <DatePicker v-model="date" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" />
          </v-col>
          <v-col cols="12" sm="6" class="pt-0">
            <label>Clock</label>
            <br />
            <DatePicker v-model="timeValue" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false" :editable="false" />
          </v-col>
        </v-row>
        <v-textarea v-model="description" label="Description" />
        <v-select v-model="assignedToUsersID" :items="assignedUserList" item-value="id" label="Assigned To User">
          <template v-slot:selection="data">
            <v-chip v-bind="data.attrs" :input-value="data.selected">
              <v-avatar left>
                <v-img :src="getImageUrl(data.item.usersImageURL)" />
              </v-avatar>
              {{ data.item.firstName }} {{ data.item.lastName }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar>
              <v-img :src="getImageUrl(data.item.usersImageURL)" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.firstName }} {{ data.item.lastName }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-select>
        <v-row align="center" justify="center" v-if="isEdit">
          <!--          <v-col cols="4" class="text-right">-->
          <!--            <v-checkbox v-model="isCompleted" label="Mark Complete" hide-details class="mt-0" />-->
          <!--          </v-col>-->
          <template v-if="isPast">
            <v-col v-if="isSnooze">
              <v-select v-model="snoozeTime" :items="snoozeTimeList" label="How long to snooze?" dense hide-details>
                <template v-slot:selection="{item}">{{ item > 0 ? `${item} minutes` : 'None' }}</template>
                <template v-slot:item="{item}"> {{ item > 0 ? `${item} minutes` : 'None' }}</template>
              </v-select>
            </v-col>
            <v-col cols="auto">
              <v-btn color="secondary" @click="isSnooze = true" :loading="loadingSnooze" v-if="!isSnooze">Snooze</v-btn>

              <v-btn @click="isSnooze = false" class="mr-2" :loading="loadingSnooze" v-if="isSnooze">Cancel</v-btn>
              <v-btn color="secondary" @click="snooze" :loading="loadingSnooze" v-if="isSnooze">Save</v-btn>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="secondary" @click="save" :loading="loading" :disabled="disable">
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { DateFormat, TimeFormat, TimePickerOptions } from '@/const'
import Service from '../service'
import formatMixin from './formatTimeMixin'

export default {
  name: 'TaskForm',
  props: ['isShow', 'usersID', 'isEdit', 'task'],
  mixins: [formatMixin],
  data: (vm) => ({
    loading: false,
    loadingSnooze: false,
    disable: true,
    description: '',
    assignedToUsersID: null,
    timePickerOptions: TimePickerOptions,
    date: vm.$moment().format(DateFormat),
    timeValue: vm.$moment().format(TimeFormat),
    assignedUserList: null,
    snoozeTime: 0,
    snoozeTimeList: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180],
    isSnooze: false,
  }),
  computed: {
    ...mapGetters(['auth', 'user', 'allTeamMembers']),
    isPast() {
      if (this.task) {
        return this.task.isCompleted !== 1 && this.$moment(this.task.taskDueDate) - this.$moment() < 0
      }
      return false
    },
  },
  watch: {
    isShow(val) {
      if (val) {
        this.description = this.task.taskDescription
        this.assignedToUsersID = this.task.assignedToUsersID || this.user.id
        this.attachedToMessageID = this.task.attachedToMessageID
        this.date = this.$moment(this.task.taskDueDate).format(DateFormat)
        this.timeValue = this.$moment(this.task.taskDueDate).format(TimeFormat)
        this.attachedToContactsID = this.task.attachedToContactsID
        this.assignedUserList = _.orderBy([this.user, ...this.allTeamMembers], 'firstName')
        this.isSnooze = false
      }
    },
    description(val) {
      this.disable = val.length === 0
    },
  },
  methods: {
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
    close() {
      this.$emit('close')
    },
    save() {
      this.loading = true
      this.disable = true
      const data = {
        usersID: parseInt(this.auth.userID, 10),
        taskDueDate: this.$moment(`${this.date} ${this.timeValue}`).toISOString(),
        taskDescription: this.description,
        assignedToUsersID: this.assignedToUsersID,
        attachedToMessageID: this.attachedToMessageID || null,
        attachedToContactsID: this.attachedToContactsID || null,
        assignedTaskAccepted: 1,
      }

      if (this.isEdit) {
        Service.editTask(this.task.tsid, data).then((res) => {
          if (res.status === 200) {
            this.loading = false
            this.disable = false
            this.$emit('close')
            this.$emit('reloadTasks')
          }
        })
      } else {
        Service.addTask(data).then((res) => {
          if (res.status === 200) {
            this.loading = false
            this.disable = false
            this.$emit('close')
            this.$emit('reloadTasks')
          }
        })
      }
    },
    snooze() {
      const date = this.$moment(this.task.taskDueDate).toISOString()
      const snoozeTime = (this.$moment(date).add(this.snoozeTime, 'minute').toISOString())
      this.date = this.$moment(snoozeTime).format(DateFormat)
      this.timeValue = this.$moment(snoozeTime).format(TimeFormat)
      this.isSnooze = false
    },
  },
}
</script>

<style>
.isStatus .v-input--radio-group__input {
  justify-content: center;
}
</style>

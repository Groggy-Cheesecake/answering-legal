<template>
  <v-dialog v-model="isShow" persistent max-width="620">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          Confirm Status Change
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pb-0 pt-5">
        <h4 class="red--text text-center mb-6">Change My Status to Hold My Calls</h4>
        <v-row>
          <v-col class="pr-1 py-0">
            <h6 class="mb-2 primaryText">Current Status</h6>
            <v-divider class="ma-0" />
          </v-col>
          <v-col cols="auto" class="pa-0 h-25p">
            <v-icon color="white" size="48">mdi-arrow-right-bold</v-icon>
          </v-col>
          <v-col class="pl-1 py-0">
            <h6 class="mb-2 primaryText">Change Status To</h6>
            <v-divider class="ma-0" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pr-1 py-0">
            <v-img class="d-sm-flex d-md-none" width="56" height="56" contain :src="statusIcon" />
            <v-list class="transparent pa-0">
              <v-list-item class="d-md-flex d-none">
                <v-list-item-avatar width="48" height="48">
                  <v-img :src="statusIcon" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="text-wrap">
                    <h4 class="mb-0">{{ currentStatus.statusName }}</h4>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    <h6 class="mb-0 mt-1">
                      <v-icon x-small color="red" v-if="currentStatus.takingCalls === 0">mdi-circle</v-icon>
                      <v-icon x-small color="green" v-else>mdi-circle</v-icon>
                      {{ currentStatus.takingCalls === 0 ? 'Not' : '' }}
                      taking Calls
                    </h6>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p class="mb-0 px-4">{{ currentStatus.message }}</p>
            <p class="px-4">{{ currentStatus.callBackMessage }}</p>
          </v-col>
          <v-col cols="auto" class="pa-0">
            <v-icon color="primary" size="48">mdi-arrow-right-bold</v-icon>
          </v-col>
          <v-col class="pr-1 py-0">
            <v-img class="d-sm-flex d-md-none" width="56" height="56" contain :src="holdMyCallsStatusIcon" />
            <v-list class="transparent pa-0">
              <v-list-item class="d-md-flex d-none">
                <v-list-item-avatar width="48" height="48">
                  <v-img :src="holdMyCallsStatusIcon" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="text-wrap">
                    <h4 class="mb-0">{{ holdMyCallsInfo.statusName }}</h4>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    <h6 class="mb-0 mt-1">
                      <v-icon x-small color="red" v-if="holdMyCallsInfo.takingCalls === 0">mdi-circle</v-icon>
                      <v-icon x-small color="green" v-else>mdi-circle</v-icon>
                      {{ holdMyCallsInfo.takingCalls === 0 ? 'Not' : '' }}
                      taking Calls
                    </h6>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p class="mb-0 px-4">{{ holdMyCallsInfo.message }}</p>
            <p class="px-4">{{ holdMyCallsInfo.callBackMessage }}</p>
            <v-select v-model="holdTime" :items="holdTimeList" label="Hold My Calls Until" dense class="pa-4" hide-details>
              <template v-slot:selection="{item}">{{ getHoldTimeLabel(item) }}</template>
              <template v-slot:item="{item}">{{ getHoldTimeLabel(item) }}</template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="secondary" @click="update" :loading="loading" :disabled="loading">
          <v-icon left>mdi-content-save</v-icon>
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { TimeAMPMFormat } from '@/const'
import Service from '../../service'

export default {
  name: 'HoldCall',
  props: ['isShow', 'isUpdate'],
  data: () => ({
    loading: false,
    disable: true,
    holdTime: 30,
    holdTimeList: [30, 60, 90, 120, 150, 180],
  }),
  computed: {
    ...mapGetters(['auth', 'currentStatus', 'allStatus']),
    statusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.currentStatus.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
    holdMyCallsStatusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.holdMyCallsInfo.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
    holdMyCallsInfo: (vm) => vm.allStatus.filter((d) => d.dsid === 10)[0],
  },
  methods: {
    ...mapActions(['getCurrentStatus', 'getSchedules']),
    getHoldTimeLabel(time) {
      if (this.isUpdate) {
        return this.$moment(this.currentStatus.endDate).add(time, 'minute').format(TimeAMPMFormat)
      }

      const minute = this.$moment().format('mm') > 30 ? 30 : 0
      const now = this.$moment().set('minute', minute).set('second', 0)
      return this.$moment(now).add(time, 'minute').format(TimeAMPMFormat)
    },
    update() {
      this.loading = true
      if (this.isUpdate) {
        const data = {
          dispatchScheduleID: this.currentStatus.id,
          dispatchStatusID: this.holdMyCallsInfo.dsid,
          callBackScriptID: this.holdMyCallsInfo.callBackScriptID,
          startDate: this.currentStatus.startDate,
          endDate: this.$moment(this.currentStatus.endDate).add(this.holdTime, 'minute').toISOString(),
          repeatCode: this.currentStatus.repeatCode,
          isCustomRepeat: this.currentStatus.isCustomRepeat,
        }

        Service.updateDispatchScheduleEvent(this.auth.userID, data).then((res) => {
          if (res.status === 200) {
            this.getCurrentStatus(this.auth.userID)
            this.getSchedules(this.auth.userID)
            this.close()
            this.$root.$emit('snackbar', 'success', 'Updated Hold my call!')
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        const minute = this.$moment().format('mm') > 30 ? 30 : 0
        const startDate = this.$moment().set('minute', minute).set('second', 0).toISOString()

        const data = {
          usersID: this.auth.userID,
          dispatchStatusID: this.holdMyCallsInfo.dsid,
          callBackScriptID: this.holdMyCallsInfo.callBackScriptID,
          startDate,
          endDate: this.$moment(startDate).add(this.holdTime, 'minute').toISOString(),
          repeatCode: null,
          isCustomRepeat: 0,
        }

        Service.createDispatchScheduleEvent(data).then((res) => {
          if (res.status === 200) {
            this.getCurrentStatus(this.auth.userID)
            this.getSchedules(this.auth.userID)
            this.close()
            this.$root.$emit('snackbar', 'success', 'Updated Hold my call!')
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    close() {
      this.holdTime = 30
      this.$emit('close')
    },
  },
}
</script>

<style scoped>

</style>

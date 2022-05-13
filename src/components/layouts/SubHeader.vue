<template>
  <v-row justify="center" align="center" v-if="auth && currentStatus && allStatus">
    <v-col cols="12" sm="2" md="6" class="d-sm-flex d-none">
      <v-img class="d-sm-flex d-md-none" width="56" height="56" contain :src="statusIcon" />
      <v-list class="transparent">
        <v-list-item class="d-md-flex d-none">
          <v-list-item-avatar width="56" height="56">
            <v-img :src="statusIcon" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-wrap">
              <v-row class="align-center no-gutters">
                <v-col cols="auto py-0 px-0">
                  <h4 class="mb-0">{{ currentStatus.statusName }}</h4>
                </v-col>
                <v-col class="py-0 pl-2 text-capitalize">
                  <h6 class="mb-0 mt-1">
                    <v-icon x-small color="red" v-if="currentStatus.takingCalls === 0">mdi-circle</v-icon>
                    <v-icon x-small color="green" v-else>mdi-circle</v-icon>
                    {{ currentStatus.takingCalls === 0 ? 'Not' : '' }}
                    taking Calls
                  </h6>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle class="text-wrap" id="step-2" style="line-height: 1.2">{{ currentStatus.message }}<br>{{ currentStatus.callBackMessage }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-wrap">
              <span class="mr-3">Next:</span>
              <template v-if="duration.days > 0">{{ duration.days }} <span class="text-lowercase mr-3">days</span></template>
              <template v-if="duration.hours > 0">{{ duration.hours }} <span class="text-lowercase mr-3">hours</span></template>
              <template v-if="duration.minutes > 0">{{ duration.minutes }} <span class="text-lowercase mr-3">minutes</span></template>
              <template v-if="duration.seconds > 0">{{ duration.seconds }} <span class="text-lowercase mr-3">seconds</span></template>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" sm="10" md="6">
      <v-row justify="center" align="center">
        <v-col cols="4" class="py-0">
          <v-card class="py-1 px-2 dispatchBtn" ripple color="secondary cursorPointer" @click="isShowReturnDefaultStatus = true" :disabled="defaultStatus === null">
            <div class="d-flex align-center justify-center">
              <v-img src="../../assets/images/returnToDefault.png" height="36" width="36" contain class="mr-2 dispatchBtn-imgIcon" />
              <p class="mb-0 text-uppercase text-center" style="line-height: 1">Return to Default</p>
            </div>
          </v-card>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-card class="py-1 px-2" ripple color="secondary cursorPointer" @click="isShowStatus = true">
            <div class="d-flex align-center justify-center">
              <v-img src="../../assets/images/changeStatus.png" height="36" width="36" contain class="mr-2 dispatchBtn-imgIcon" />
              <p class="mb-0 text-uppercase text-center" style="line-height: 1">CHANGE CURRENT STATUS</p>
            </div>
          </v-card>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-card class="py-1 px-2" ripple color="secondary cursorPointer" @click="isShowHoldCall = true">
            <div class="d-flex align-center justify-center">
              <v-img src="../../assets/images/holdCalls.png" height="36" width="36" contain class="mr-2 dispatchBtn-imgIcon" />
              <p class="mb-0 text-uppercase text-center" style="line-height: 1">HOLD MY CALLS</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <DispatchStatus :isShow="isShowStatus" @close="isShowStatus = false" />
    <ReturnToDefault :isShow="isShowReturnDefaultStatus" @close="isShowReturnDefaultStatus = false" :isUpdate="currentStatus.isDefaultStatus === 0" />
    <HoldCall :isShow="isShowHoldCall" @close="isShowHoldCall = false" :isUpdate="currentStatus.isDefaultStatus === 0" />
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DispatchStatus from '../DispatchStatus/DispatchStatus.vue'
import ReturnToDefault from '../DispatchStatus/ReturnToDefault.vue'
import HoldCall from '../DispatchStatus/HoldCall.vue'

export default {
  name: 'SubHeader',
  components: {
    HoldCall,
    ReturnToDefault,
    DispatchStatus,
  },
  computed: {
    ...mapGetters(['auth', 'currentStatus', 'defaultStatus', 'schedules', 'nextStatus', 'allStatus']),
    statusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.currentStatus.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
  },
  data: () => ({
    isShowStatus: false,
    isShowReturnDefaultStatus: false,
    isShowHoldCall: false,
    nextChannel: null,
    duration: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  }),
  mounted() {
    this.startCountDown()
  },
  methods: {
    ...mapActions(['getCurrentStatus']),
    getNextChannel() {
      if (this.currentStatus) {
        this.nextChannel = this.currentStatus.endDate
      } else {
        this.nextChannel = null
      }
    },
    startCountDown() {
      const interval = 1000
      setInterval(() => {
        this.getNextChannel()
        const nextTime = this.$moment(this.nextChannel).unix()
        const currentTime = this.$moment().unix()
        const diffTime = nextTime - currentTime
        let duration = this.$moment.duration(diffTime * 1000, 'milliseconds')
        duration = this.$moment.duration(duration - interval, 'milliseconds')
        if (diffTime > 0) {
          this.duration = {
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
          }
        } else {
          // this.getCurrentStatus(this.auth.userID)
        }
      }, interval)
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/variables";

.dispatchBtn-imgIcon {
  flex: 1 0 auto !important;
  max-width: 36px;
}

h4 span {
  font-size: 1.2rem;
}
</style>

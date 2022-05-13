<template>
  <v-card v-bind:class="{'elevation-0 small': isSmall }" v-if="today" style="height: 100%">
    <v-toolbar dense class="primary text-white z-index-1 position-relative align-center" v-if="!isSmall">
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center primary text-white text-center">{{ $moment() | moment('M/DD/YYYY ') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text class="schedule-header py-1 px-6 text-center font-weight-bold" v-if="isSmall">{{ today.month }} {{ today.week }} {{ today.day }}</v-card-text>
    <h1 v-if="todaySchedules && todaySchedules.length < 1" class="emptyDesc mb-0" style="color: rgba(0, 0, 0, 0.6)">No Schedules</h1>
    <v-list two-line class="py-0 transparent" v-if="todaySchedules">
      <template v-for="(event, index) in todaySchedules">
        <v-list-item :key="index" class="message-item" v-if="isShowAll || event.isDefaultStatus !== 1" @click="editSchedule(event)">
          <v-list-item-avatar class="mr-2" size="56">
            <v-img :src="getImageUrl(event.takingCalls)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content class="ml-2">
            <v-list-item-title class="text-wrap mb-2">
              <v-row class="align-center">
                <v-col cols="auto py-0" class="primaryText">
                  <h5 class="mb-0">{{ event.statusName }}</h5>
                </v-col>
                <v-col class="py-0 pl-0 text-capitalize">
                  <h6 class="mb-0 mt-0">
                    <v-icon x-small color="red" v-if="event.takingCalls === 0">mdi-circle</v-icon>
                    <v-icon x-small color="green" v-else>mdi-circle</v-icon>
                    {{ event.takingCalls === 0 ? 'Not' : '' }}
                    taking Calls
                  </h6>
                </v-col>
                <v-col class="py-0 pl-0 text-capitalize text-right">
                  <p style="font-size: 0.75em" class="mb-0">{{ getDate(event) }}</p>
                  <p style="font-size: 0.85em" class="mb-0 font-weight-bold">{{ event.startDate | moment('h:mm A') }} - {{ event.endDate | moment('h:mm A') }}</p>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>{{ event.message }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ event.callBackMessage }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ event.startDate | moment('M/D/YY hh:mm A') }} ~ {{ event.endDate | moment('M/D/YY hh:mm A') }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon flab small @click="editSchedule(event)" v-if="event.isDefaultStatus !== 1">
              <v-icon small color="secondary">mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="`line-${index}`" v-if="index < todaySchedules.length-1 && (isShowAll || event.isDefaultStatus !== 1)" class="my-0" />
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ScheduleViewer',
  props: ['isSmall'],
  data: () => ({
    today: null,
    isShowAll: true,
  }),
  computed: {
    ...mapGetters(['auth', 'schedules', 'todaySchedules']),
  },
  watch: {
    schedules: {
      handler() {
        this.getTodayDispatchScheduleEvent(this.auth.userID)
      },
      deep: true,
    },
  },
  mounted() {
    this.today = {
      year: this.$moment().format('YYYY'),
      month: this.$moment().format('MMMM'),
      day: this.$moment().format('D'),
      week: this.$moment().format('ddd'),
    }
    this.getTodayDispatchScheduleEvent(this.auth.userID)
  },
  methods: {
    ...mapActions(['getTodayDispatchScheduleEvent']),
    getImageUrl(val) {
      const icon = this.$statusIconList.filter((d) => d.id === val)
      return this.$imgLink + icon[0].iconURL
    },
    editSchedule(val) {
      if (val.isDefaultStatus === 1) {
        this.$emit('onlyShow', val)
      } else {
        this.$emit('editSchedule', val)
      }
    },
    getDate(event) {
      const startDate = this.$moment(event.startDate).format('M/D/YY')
      const endDate = this.$moment(event.endDate).format('M/D/YY')
      if (startDate === endDate) {
        return startDate
      }
      return `${startDate} - ${endDate}`
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.schedule-header {
  color: $DarkBlue;
  background-color: $LightGray;
}

.small {
  border-radius: 0 !important;
}

.small .todayEventsContent {
  height: 205px;
}

.fixedHeight {
  height: 50px;
}

@media (max-width: 1904px) {
  .small .todayEventsContent {
    //height: 205px;
  }

  .todayEventsContent {
    height: 100%;
  }
}
</style>

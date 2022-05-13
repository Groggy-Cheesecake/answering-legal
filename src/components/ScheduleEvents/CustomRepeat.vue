<template>
  <v-row class="custom-rrule">
    <v-col cols="12" class="text-center">
      <h6 class="primaryText text-left">Repeat on:</h6>
      <v-item-group multiple v-model="configs.weeks" @change="updateRRuleCode">
        <v-item value="SU" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>SUN</v-btn>
        </v-item>
        <v-item value="MO" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Mon</v-btn>
        </v-item>
        <v-item value="TU" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Tue</v-btn>
        </v-item>
        <v-item value="WE" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Wed</v-btn>
        </v-item>
        <v-item value="TH" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Thu</v-btn>
        </v-item>
        <v-item value="FR" v-slot:default="{ active, toggle }" class="mr-2">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Fri</v-btn>
        </v-item>
        <v-item value="SA" v-slot:default="{ active, toggle }">
          <v-btn small active-class="secondary" :input-value="active" @click="toggle" fab>Sat</v-btn>
        </v-item>
      </v-item-group>
    </v-col>
    <v-col cols="12" class="text-center pb-0">
      <h6 class="primaryText text-left">Ends:</h6>
      <v-row>
        <v-col cols="auto" class="py-0 mr-6">
          <v-radio-group v-model="ends" column class="mt-0" hide-details @change="updateRRuleCode">
            <v-radio label="Never"></v-radio>
            <v-radio label="On"></v-radio>
            <v-radio label="After"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="px-2">
          <v-row v-if="ends === 1">
            <v-col cols="6" class="py-0 text-left">
              <label>Date</label>
              <DatePicker v-model="configs.now.date" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" />
            </v-col>
            <v-col cols="6" class="py-0 text-left">
              <label>Time</label>
              <DatePicker v-model="configs.now.time" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false"
                          :editable="false" />
            </v-col>
          </v-row>
          <v-row v-if="ends === 2">
            <v-col cols="12">
              <v-text-field v-model="configs.after" suffix="occurrences" hide-details type="number" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import formatMixin from '../formatTimeMixin'
import {
  DateFormat, DateTimeFormatByAMPM, TimeFormat, TimePickerOptions,
} from '../../const'

export default {
  name: 'CustomRepeat',
  props: ['event'],
  mixins: [formatMixin],
  data: (vm) => ({
    timePickerOptions: TimePickerOptions,
    configs: {
      weeks: [vm.$moment().format('dd').toUpperCase()],
      now: {
        date: vm.$moment(`${vm.event.fromDate} ${vm.event.fromTime}`).add(1, 'day').set('hour', 0).set('minute', 0)
          .format(DateFormat),
        time: vm.$moment(`${vm.event.fromDate} ${vm.event.fromTime}`).add(1, 'day').set('hour', 0).set('minute', 0)
          .format(TimeFormat),
      },
      after: 1,
    },
    ends: 0,
  }),
  watch: {
    configs: {
      handler() {
        if (this.configs.weeks.length < 1) this.configs.weeks = [this.$moment().format('dd').toUpperCase()]
        this.updateRRuleCode()
      },
      deep: true,
    },
    event: {
      handler() {
        this.setConfigs()
      },
      deep: true,
    },
  },
  mounted() {
    this.setConfigs()
  },
  methods: {
    setConfigs() {
      if (this.event.data && this.event.data.repeatCode) {
        const repeatValue = JSON.parse(this.event.data.repeatCode)
        this.configs = {
          weeks: repeatValue.BYDAY || [this.$moment().format('dd').toUpperCase()],
          now: {
            date: repeatValue.UNTIL
              ? this.$moment(repeatValue.UNTIL).format(DateFormat)
              : this.$moment(`${this.event.fromDate} ${this.event.fromTime}`).add(1, 'day').set('hour', 0).set('minute', 0)
                .format(DateFormat),
            time: repeatValue.UNTIL
              ? this.$moment(repeatValue.UNTIL).format(TimeFormat)
              : this.$moment(`${this.event.fromDate} ${this.event.fromTime}`).add(1, 'day').set('hour', 0).set('minute', 0)
                .format(TimeFormat),
          },
          after: repeatValue.COUNT || 1,
        }

        this.ends = repeatValue.UNTIL ? 1 : repeatValue.COUNT ? 2 : 0
      } else {
        this.updateRRuleCode()
      }
    },
    updateRRuleCode() {
      const rRules = {
        FREQ: 'WEEKLY',
        BYDAY: this.configs.weeks,
      }
      if (this.ends === 1) {
        rRules.until = this.$moment(`${this.configs.now.date} ${this.configs.now.time}`, DateTimeFormatByAMPM).utc().format()
      } else if (this.ends === 2) {
        rRules.count = this.configs.after
      }
      this.$emit('changed', rRules)
    },
  },
}
</script>

<style>
.custom-rrule .theme--light.v-btn.v-btn--disabled.v-btn--active {
  background-color: #2699fb !important;
  border-color: #2699fb !important;
}
</style>

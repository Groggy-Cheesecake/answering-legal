<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center ml-6">
        Status Details
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon text small class="mx-0" @click="close">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0 pt-5 default_schedule_form">
      <v-row>
        <v-col>
          <v-select v-model="item.data.dispatchStatusID" :items="allStatus" item-text="statusName" item-value="dsid" label="Status" hide-details class="pa-0" readonly>
            <template v-slot:selection="{item}">
              <v-avatar size="26" class="mr-2">
                <v-img :src="statusImage(item.takingCalls)" />
              </v-avatar>
              {{ item.statusName }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-textarea v-model="item.data.message" label="Message To Callers:" rows="2" readonly />
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-textarea :value="getCallbackMessage" label="When you will return the call:" rows="2" readonly />
        </v-col>
      </v-row>

      <v-row align="center" class="pb-4">
        <v-col class="py-0">
          <label>Start Date</label>
          <DatePicker v-model="item.fromDate" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" disabled class="primaryText" />
        </v-col>
        <v-col class="py-0">
          <label>Start Time</label>
          <DatePicker v-model="item.fromTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false" :editable="false"
                      disabled />
        </v-col>
        <v-col cols="auto" class="pa-0 h-25p">
          <v-icon color="primary" size="36">mdi-arrow-right-bold</v-icon>
        </v-col>
        <v-col class="py-0">
          <label>End Date</label>
          <DatePicker v-model="item.toDate" :valueType="'YYYY-MM-DD'" format="MM/DD/YYYY" :clearable="false" :editable="false" disabled />
        </v-col>
        <v-col class="py-0">
          <label>End Time</label>
          <DatePicker v-model="item.toTime" :time-picker-options="timePickerOptions" format="hh:mm A" :valueType="'HH:mm:ss'" type="time" :clearable="false" :editable="false"
                      disabled />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-0" />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" @click="close">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { TimePickerOptions } from '../../const'

export default {
  name: 'DefaultScheduleForm',
  props: ['item'],
  data: () => ({
    timePickerOptions: TimePickerOptions,
  }),
  computed: {
    ...mapGetters(['auth', 'allStatus', 'allStatusMessages', 'allStatusCallbackMessages']),
    getCallbackMessage() {
      return (this.allStatusCallbackMessages.filter((d) => d.cbid === this.item.data.callBackScriptID))[0].callBackMessage
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    statusImage(val) {
      const icon = this.$statusIconList.filter((d) => d.id === val)
      return this.$imgLink + icon[0].iconURL
    },
  },
}
</script>

<style lang="scss">
@import "../../assets/scss/_variables.scss";

.default_schedule_form .mx-input:disabled, .mx-input.disabled {
  color: $DarkBlue;
  font-weight: 500;
}
</style>

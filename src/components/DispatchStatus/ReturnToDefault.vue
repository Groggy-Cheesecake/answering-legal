<template>
  <v-dialog v-model="isShow" persistent max-width="620">
    <v-card v-if="defaultStatus">
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          Confirm Return To Default Status
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pb-0 pt-5">
        <h4 class="red--text text-center mb-6">
          {{ isUpdate ? 'Update my status to the default status' : 'Your status is already the default status' }}</h4>
        <v-row>
          <v-col class="pr-1 py-0">
            <h6 class="mb-2 primaryText">Current Status</h6>
            <v-divider class="ma-0" />
          </v-col>
          <v-col cols="auto" class="pa-0 h-25p">
            <v-icon color="white" size="48">mdi-arrow-right-bold</v-icon>
          </v-col>
          <v-col class="pl-1 py-0">
            <h6 class="mb-2 primaryText">Default Status</h6>
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
          <v-col class="pl-1 py-0">
            <v-img class="d-sm-flex d-md-none" width="56" height="56" contain :src="defaultStatusIcon" />
            <v-list class="transparent pa-0">
              <v-list-item class="d-md-flex d-none">
                <v-list-item-avatar width="48" height="48">
                  <v-img :src="defaultStatusIcon" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="text-wrap">
                    <h4 class="mb-0">{{ defaultStatus.statusName }}</h4>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    <h6 class="mb-0 mt-1">
                      <v-icon x-small color="red" v-if="defaultStatus.takingCalls === 0">mdi-circle</v-icon>
                      <v-icon x-small color="green" v-else>mdi-circle</v-icon>
                      {{ defaultStatus.takingCalls === 0 ? 'Not' : '' }}
                      taking Calls
                    </h6>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p class="mb-0 px-4">{{ defaultStatus.message }}</p>
            <p class="px-4">{{ defaultStatus.callBackMessage }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" v-if="isUpdate">Cancel</v-btn>
        <v-btn color="secondary" @click="update" :loading="loading" :disabled="loading" v-if="isUpdate">
          <v-icon left>mdi-content-save</v-icon>
          Update
        </v-btn>
        <v-btn color="secondary" @click="close" v-else>OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Service from '../../service'

export default {
  name: 'ReturnToDefault',
  props: ['isShow', 'isUpdate'],
  data: () => ({
    loading: false,
    disable: true,
  }),
  computed: {
    ...mapGetters(['auth', 'currentStatus', 'defaultStatus']),
    statusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.currentStatus.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
    defaultStatusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.defaultStatus.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
  },
  methods: {
    ...mapActions(['getCurrentStatus', 'getSchedules']),
    update() {
      this.loading = true
      Service.returnToDefaultScheduleEvent(this.auth.userID, this.currentStatus.id).then((res) => {
        if (res.status === 200) {
          this.getCurrentStatus(this.auth.userID)
          this.getSchedules(this.auth.userID)
          this.close()
          this.$root.$emit('snackbar', 'success', 'Updated my status to the default status!')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>

</style>

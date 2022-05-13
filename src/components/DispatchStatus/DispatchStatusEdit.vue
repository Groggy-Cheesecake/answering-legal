<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center ml-6">
        {{ isEdit ? 'Edit' : 'Create' }} Status Template
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon text small class="mx-0" @click="close">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="py-4">
      <v-form ref="form">
        <v-row align="center">
          <v-col cols="auto" class="position-relative py-0">
            <v-avatar size="84" class="border-white avatar">
              <v-img :src="statusIcon" />
            </v-avatar>
          </v-col>
          <v-col>
            <v-select v-model="takingCalls" :items="$statusIconList" item-text="name" item-value="id" class="mw-175p" label="Availability" />
          </v-col>
          <v-col>
            <v-text-field v-model="statusName" label="Status Name" placeholder="Enter status name" :rules="required" />
          </v-col>
          <v-col cols="12" class="pb-0">
            <v-select v-model="statusMessageID" :items="allStatusMessages" item-text="message" item-value="gsid" label="Message To Callers:" />
          </v-col>
          <v-col cols="12" class="pb-0">
            <v-select v-model="statusCallbackMessageID" :items="allStatusCallbackMessages" item-text="callBackMessage" item-value="cbid" label="When you will return the call:" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider class="my-0" />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="close">Cancel</v-btn>
      <v-btn color="secondary" @click="update" :loading="loading" :disabled="loading" v-if="isEdit">
        <v-icon left>mdi-content-save</v-icon>
        Save
      </v-btn>
      <v-btn color="secondary" @click="create" :loading="loading" :disabled="loading" v-else>
        <v-icon left>mdi-content-save</v-icon>
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Service from '../../service'

export default {
  name: 'DispatchStatusEdit',
  props: ['isEdit', 'status'],
  data: () => ({
    loading: false,
    takingCalls: 0,
    statusName: null,
    statusMessageID: 1,
    statusCallbackMessageID: 1,
    required: [(v) => !!v || 'This field is required'],
  }),
  computed: {
    ...mapGetters(['auth', 'allStatus', 'allStatusMessages', 'allStatusCallbackMessages']),
    statusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
  },
  mounted() {
    if (this.status) {
      this.takingCalls = this.status.takingCalls
      this.allStatus.map((d) => {
        if (d.statusName === this.status.statusName) {
          this.statusName = d.statusName
          this.statusMessageID = d.gsid
          this.statusCallbackMessageID = d.cbid
          this.takingCalls = d.takingCalls
        }
        return false
      })
    }
  },
  methods: {
    ...mapActions(['getAllStatus']),
    statusImage(val) {
      return this.$imgLink + val
    },
    reset() {
      this.takingCalls = 0
      this.statusName = null
      this.statusMessageID = 1
      this.statusCallbackMessageID = 1
    },
    close() {
      this.reset()
      this.$emit('close')
    },
    update() {
      if (!this.$refs.form.validate()) return
      const data = {
        dispatchStatusID: this.status.dsid,
        statusName: this.statusName || this.status.statusName,
        greetingScriptID: this.statusMessageID,
        takingCalls: this.takingCalls,
        isDefault: false,
        callBackScriptID: this.statusCallbackMessageID,
      }

      this.loading = true
      Service.updateDispatchStatus(this.auth.userID, data).then((res) => {
        if (res.status === 200) {
          this.getAllStatus(this.auth.userID)
          this.$root.$emit('snackbar', 'success', 'Updated the Dispatch Status!')
        }
      }).finally(() => {
        this.loading = false
        this.reset()
        this.$emit('done')
      })
    },
    create() {
      if (!this.$refs.form.validate()) return
      const data = {
        usersID: this.auth.userID,
        statusName: this.statusName,
        greetingScriptID: this.statusMessageID,
        takingCalls: this.takingCalls,
        isDefault: false,
        createdByUsersID: this.auth.userID,
        callBackScriptID: this.statusCallbackMessageID,
      }

      this.loading = true
      Service.createDispatchStatus(data).then((res) => {
        if (res.status === 200) {
          this.getAllStatus(this.auth.userID)
          this.$root.$emit('snackbar', 'success', `Created the ${data.statusName} Dispatch Status!`)
        }
      }).finally(() => {
        this.loading = false
        this.reset()
        this.$emit('done')
      })
    },
  },
}
</script>

<style scoped>

</style>

<style>
.statusTab .card-header-pills {
  padding: 0;
}
</style>

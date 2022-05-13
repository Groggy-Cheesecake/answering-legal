<template>
  <v-dialog v-model="isShow" persistent max-width="540" v-if="auth">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          <v-icon left color="white">mdi-help-circle</v-icon>
          Create New Ticket
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <h6 class="mt-1 primaryText">
          <v-icon color="primary">mdi-account</v-icon>
          {{ message.firstName }} {{ message.lastName }}
        </h6>
        <h6 class="primaryText mb-7">
          <v-icon color="primary">mdi-email</v-icon>
          {{ message.email }}
        </h6>
        <v-text-field label="Subject" :value="`Issue regarding message ID# ${message.ctiMessageID || message.id}`" disabled readonly dense />
        <v-textarea v-model="describe" label="Please describe your issue" rows="6" dense hide-details />
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="secondary" @click="submit" :loading="loading" :disabled="loading">
          <v-icon left>mdi-send</v-icon>
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'

export default {
  name: 'CreateTicket',
  props: ['isShow', 'message'],
  data: () => ({
    loading: false,
    describe: '',
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.loading = true
      const data = {
        messageID: this.message.ctiMessageID || this.message.id,
        message: this.describe,
        subject: `Issue regarding message ID# ${this.message.id}`,
        usersID: this.auth.userID,
      }
      Service.sendTicket(data).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Ticket Created!')
          this.$emit('sent')
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>
.folderItem {
  cursor: pointer;
  margin-bottom: 4px;
  border-radius: 32px !important;
}

.folderItem:before {
  background-color: rgba(0, 0, 0, 0.87) !important;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: .3s cubic-bezier(.25, .8, .5, 1);
  transition: .3s cubic-bezier(.25, .8, .5, 1);
}

.selected:before {
  opacity: 0.2 !important;
  background-color: rgba(45, 155, 250, 0.87) !important;
}
</style>

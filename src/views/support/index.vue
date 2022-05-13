<template>
  <v-card class="support">
    <SupportToolbar />
    <v-card-text class="text-center">
      <h2 class="primaryText text-uppercase">Create New Ticket</h2>
    </v-card-text>
    <v-card-text>
      <h6 class="mb-0 mt-1 primaryText">
        <v-icon color="primary">mdi-account</v-icon>
        {{user.firstName}} {{user.lastName}}
      </h6>
      <h6 class="primaryText mb-6">
        <v-icon color="primary">mdi-email</v-icon>
        {{user.email}}
      </h6>

      <v-select v-model="subject" label="What can we help you with?"  :items="subjectList" dense hide-details />
      <v-textarea v-model="describe" label="Please describe your issue" rows="6" />
    </v-card-text>
    <v-divider class="my-0" />
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" @click="submit" :loading="loading" :disabled="loading || isSent">
        <v-icon left>mdi-send</v-icon>
        {{isSent ? 'Sent' : 'Submit ticket'}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import SupportToolbar from './SupportToolbar.vue'
import Service from '../../service'

export default {
  components: { SupportToolbar },
  data: () => ({
    loading: false,
    subject: 'Billing',
    subjectList: ['Billing', 'Call Forwarding', 'Account Set Up', 'Mobile App', 'Request Cancellation', 'General Inquiry'],
    describe: '',
    isSent: false,
  }),
  computed: {
    ...mapGetters(['auth', 'user']),
  },
  methods: {
    submit() {
      this.loading = true
      const data = {
        messageID: null,
        message: this.describe,
        subject: this.subject,
        usersID: this.auth.userID,
      }
      Service.sendTicket(data).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Ticket Created!')
          this.isSent = true
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

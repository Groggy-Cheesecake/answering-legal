<template>
  <v-card v-if="userInfo">
    <v-card-actions>
      <v-spacer />
      <template v-if="!isEdit">
        <v-btn color="primary" @click="close">
          <v-icon left>mdi-account-edit</v-icon>
          Edit
        </v-btn>
      </template>
      <template v-else>
        <v-btn @click="close" class="mr-2" :disabled="loading">Cancel</v-btn>
        <v-btn :disabled="user.isPending === 1" v-if="user.isPending === 1">
          <v-icon left>mdi-send</v-icon>
          Requested Sent
        </v-btn>
        <v-btn :loading="loading" :disabled="loading" @click="confirm" color="primary" v-else>
          <v-icon left>mdi-send</v-icon>
          Request Update
        </v-btn>
      </template>
    </v-card-actions>
    <v-divider class="ma-0" />
    <v-card-text>
      <v-overlay :value="loading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-row>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.firstName" prepend-inner-icon="mdi-account" hide-details dense label="First Name" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.lastName" prepend-inner-icon="mdi-account" hide-details dense label="Last Name" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="3" cols="12">
          <v-text-field v-model="userInfo.address1" prepend-inner-icon="mdi-earth" hide-details dense label="Address" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="3" cols="12">
          <v-text-field v-model="userInfo.address2" hide-details dense :disabled="!isEdit" />
        </v-col>
        <v-col md="4" lg="2" cols="12">
          <v-text-field v-model="userInfo.city" prepend-inner-icon="mdi-city-variant" hide-details dense label="City" :disabled="!isEdit" />
        </v-col>
        <v-col md="4" lg="2" cols="12">
          <v-select v-model="userInfo.state" prepend-inner-icon="mdi-city-variant" :items="items" item-text="name" item-value="abbreviation" hide-details dense label="State"
                    :disabled="!isEdit" />
        </v-col>
        <v-col md="4" lg="2" cols="12">
          <v-text-field v-model="userInfo.zip" prepend-inner-icon="mdi-postage-stamp" hide-details dense label="Zip" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.email" prepend-inner-icon="mdi-email" hide-details dense label="Email" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.companyName" prepend-inner-icon="mdi-domain" hide-details dense label="Company Name" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.cellPhone" prepend-inner-icon="mdi-cellphone-iphone" hide-details dense label="Cell Phone Number" :disabled="!isEdit" />
        </v-col>
        <v-col md="6" lg="6" cols="12">
          <v-text-field v-model="userInfo.mainPhone" prepend-inner-icon="mdi-phone-classic" hide-details dense label="Business Phone Number" :disabled="!isEdit" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { State } from '@/const'
import Service from '@/service'

export default {
  name: 'EditProfileForm',
  props: ['isEdit'],
  data: () => ({
    userInfo: null,
    loading: false,
    items: State,
  }),
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.userInfo = { ...this.user }
  },
  methods: {
    close() {
      this.userInfo = { ...this.user }
      this.$emit('cancel')
    },
    confirm() {
      this.loading = true
      Service.updateUser(this.userInfo).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setUser', {
            ...this.userInfo,
            isPending: 1,
          })
          this.$root.$emit('snackbar', 'success', 'User Info Updated!')
        } else {
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      }).finally(() => {
        this.loading = false
        this.close()
      })
    },
  },
}
</script>

<style scoped>

</style>

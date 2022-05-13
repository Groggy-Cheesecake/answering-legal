<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
        Integrations
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-divider class="ma-0"></v-divider>
    <v-form class="py-0 px-4" ref="integrationForm">
      <v-row align="center">
        <v-col sm="auto" cols="12">
          <v-img src="@/assets/images/formstackLogo.png" width="250" contain />
        </v-col>
        <v-col>
          <v-text-field v-model="formstackHashKey" label="Shared Secret" :rules="required" :readonly="!isEditable" />
        </v-col>
        <v-col>
          <v-text-field v-model="formstackHmacKey" label="HMAC Key" :rules="required" :readonly="!isEditable" />
        </v-col>
        <v-col sm="auto" cols="12">
          <v-row align="center" justify="center">
            <v-col cols="auto" v-if="!isEdit && (user.formstackHashKey && user.formstackHashKey.length > 0) && (user.formstackHmacKey && user.formstackHmacKey.length > 0)">
              <v-btn icon color="secondary" @click="isEdit = true; isEditable = true">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteKey" :loading="loading" :disabled="loading">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col sm="auto" cols="6" class="text-center" v-if="user.formstackHashKey === null && user.formstackHmacKey === null">
              <v-btn color="secondary" @click="save" :loading="loading" :disabled="loading">
                <v-icon left>mdi-content-save</v-icon>
                Save
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="isEdit">
              <v-btn color="secondary" @click="editKey" class="mr-4" :loading="isEditLoading" :disabled="isEditLoading">
                <v-icon left>mdi-content-save</v-icon>
                Update
              </v-btn>
              <v-btn color="red" @click="cancel" class="white--text" :loading="loading" :disabled="loading">
                <v-icon left>mdi-close</v-icon>
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import Service from '@/service'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Integrations',
  data: () => ({
    loading: false,
    formstackHashKey: null,
    formstackHmacKey: null,
    isEdit: false,
    isEditable: true,
    isEditLoading: false,
    required: [(v) => !!v || 'This field is required'],
  }),
  computed: {
    ...mapGetters(['auth', 'user']),
    statusIcon: (vm) => {
      const icon = vm.$statusIconList.filter((d) => d.id === vm.takingCalls)
      return vm.$imgLink + icon[0].iconURL
    },
  },
  mounted() {
    this.formstackHashKey = this.user.formstackHashKey
    this.formstackHmacKey = this.user.formstackHmacKey

    this.isEditable = this.formstackHashKey === null && this.formstackHmacKey === null
  },
  methods: {
    ...mapActions(['getUser']),
    cancel() {
      this.isEdit = false
      this.isEditable = false
      this.formstackHashKey = this.user.formstackHashKey
      this.formstackHmacKey = this.user.formstackHmacKey
    },
    save() {
      if (this.$refs.integrationForm.validate()) {
        this.loading = true
        Service.addUserHashKey(this.auth.userID, this.formstackHashKey, this.formstackHmacKey).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'Add User Hash Key!')
            this.getUser(this.auth.userID)
          } else {
            this.$root.$emit('snackbar', 'error', `${res.status} error`)
          }
        }).catch((err) => {
          this.$root.$emit('snackbar', 'error', err.message)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    editKey() {
      if (this.$refs.integrationForm.validate()) {
        this.isEditLoading = true
        Service.addUserHashKey(this.auth.userID, this.formstackHashKey, this.formstackHmacKey).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'Updated User Hash Key!')
            this.getUser(this.auth.userID)
          } else {
            this.$root.$emit('snackbar', 'error', `${res.status} error`)
          }
        }).catch((err) => {
          this.$root.$emit('snackbar', 'error', err.message)
        }).finally(() => {
          this.isEditLoading = false
          this.isEditable = false
          this.isEdit = false
        })
      }
    },
    deleteKey() {
      this.loading = true
      Service.deleteUserHashKey(this.auth.userID).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Deleted User Hash Key!')
          this.getUser(this.auth.userID)
          this.formstackHashKey = null
          this.formstackHmacKey = null
        } else {
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      }).finally(() => {
        this.loading = false
        this.isEditable = true
        this.isEdit = false
      })
    },
  },
}
</script>

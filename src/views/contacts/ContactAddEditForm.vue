<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <v-card v-if="contactInfo">
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
          <v-icon left color="white">{{ isEdit ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
          {{ isEdit ? 'Edit' : 'Add' }} Contact
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4 pb-2">
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="contactInfo.firstName" prepend-inner-icon="mdi-account" dense label="First Name" :rules="required" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="contactInfo.lastName" prepend-inner-icon="mdi-account" dense label="Last Name" :rules="required" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="contactInfo.email" prepend-inner-icon="mdi-email" dense label="Email" :rules="emailRule" />
            </v-col>
            <v-col sm="6" cols="12">
              <v-text-field v-model="contactInfo.address1" prepend-inner-icon="mdi-earth" hide-details dense label="Address" />
            </v-col>
            <v-col sm="6" cols="12">
              <v-text-field v-model="contactInfo.address2" hide-details dense />
            </v-col>
            <v-col sm="4" cols="12">
              <v-text-field v-model="contactInfo.city" prepend-inner-icon="mdi-city-variant" hide-details dense label="City" />
            </v-col>
            <v-col sm="4" cols="12">
              <v-select v-model="contactInfo.state" prepend-inner-icon="mdi-city-variant" :items="items" item-text="name" item-value="abbreviation" single-line hide-details dense
                        label="State" class="ma-0" />
            </v-col>
            <v-col sm="4" cols="12">
              <v-text-field v-model="contactInfo.zip" prepend-inner-icon="mdi-postage-stamp" hide-details dense label="Zip" />
            </v-col>
            <v-col md="6" lg="6" cols="12">
              <v-text-field v-model="contactInfo.companyName" prepend-inner-icon="mdi-domain" hide-details dense label="Company Name" />
            </v-col>
            <v-col md="6" lg="6" cols="12">
              <v-text-field v-model="contactInfo.cellPhone" prepend-inner-icon="mdi-cellphone-iphone" hide-details dense label="Cell Phone Number" />
            </v-col>
            <v-col md="6" lg="6" cols="12">
              <v-text-field v-model="contactInfo.homePhone" prepend-inner-icon="mdi-phone" hide-details dense label="Business Phone Number" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider class="my-0" v-if="existContacts.length > 0" />
      <v-card-text class="pb-2" v-if="existContacts.length > 0">
        <v-row align="center">
          <v-col>
            <v-select v-model="selectedContact" :items="existContacts" item-value="id" label="Selected Contact" hide-details return-object>
              <template v-slot:selection="{ item }">
                <v-avatar size="26" class="mr-2">
                  <v-img :src="getImageUrl(item.imageURL)" />
                </v-avatar>
                {{ item.firstName }} {{ item.lastName }}
              </template>
              <template v-slot:item="{ item }">
                <v-avatar size="26" class="mr-2">
                  <v-img :src="getImageUrl(item.imageURL)" />
                </v-avatar>
                {{ item.firstName }} {{ item.lastName }}
              </template>
            </v-select>
          </v-col>
          <v-col cols="auto">
            <v-btn color="secondary" class="pb-0" @click="merge" :loading="loadingMerge" :disabled="loadingMerge" v-if="existContacts.length > 0">
              <v-icon left>mdi-content-save</v-icon>
              Merge
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <template v-if="isEdit">
          <v-btn color="red" class="white--text" @click="deleteContact" :loading="loadingDelete" :disabled="loadingDelete">
            <v-icon left>mdi-account-remove</v-icon>
            Delete
          </v-btn>
          <v-btn color="secondary" @click="save" :loading="loading" :disabled="loading">
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="secondary" @click="add" :loading="loading" :disabled="loading">
            <v-icon left>mdi-content-save</v-icon>
            Add
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { State } from '@/const'
import Service from '../../service'

export default {
  name: 'ContactAddEditForm',
  props: ['isShow', 'newContact', 'isMessage', 'isEdit'],
  data: () => ({
    loading: false,
    loadingMerge: false,
    items: State,
    contactInfo: null,
    existContacts: null,
    selectedContact: null,
    loadingDelete: false,
    required: [(v) => !!v || 'This field is required'],
    emailRule: [
      (v) => !!v || 'This field is required',
      (v) => /\S+@\S+\.\S+/.test(v) || 'This is email field',
    ],
  }),
  watch: {
    isShow(val) {
      if (val) {
        this.contactInfo = this.isEdit ? { ...this.contact } : { ...this.newContact }
        this.isCheckMerge()
      }
    },
  },
  computed: {
    ...mapGetters(['auth', 'contact', 'contacts']),
    userAvatar: (vm) => `${vm.$imgLink}${vm.info.iconURL || vm.$avatar}`,
  },
  methods: {
    isCheckMerge() {
      if (this.isMessage || this.isEdit) {
        this.existContacts = this.contacts.filter((item) => item.id === this.contactInfo.id
          || item.firstName === this.contactInfo.firstName
          || item.lastName === this.contactInfo.lastName
          || item.email === this.contactInfo.email
          || (this.contactInfo.cellPhone && item.cellPhone === this.contactInfo.cellPhone))
      } else {
        this.existContacts = [...this.contacts]
      }

      if (this.existContacts.length > 0) this.selectedContact = this.existContacts[0]
    },
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
    close() {
      this.$emit('close')
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        Service.editContact(this.contact.id, this.contactInfo).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('getContacts')
            this.$store.commit('setContact', res.data)
            this.close()
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    deleteContact() {
      this.loadingDelete = true
      Service.deleteContact(this.auth.userID, this.contact.id).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setContact')
          this.$root.$emit('getContacts')
          this.close()
        }
      }).finally(() => {
        this.loadingDelete = false
      })
    },
    add() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          address1: this.contactInfo.address1 || null,
          address2: this.contactInfo.address2 || null,
          callTypesID: this.contactInfo.callTypesID,
          cellPhone: this.contactInfo.cellPhone || null,
          city: this.contactInfo.city || null,
          createdByUsersID: this.auth.userID,
          email: this.contactInfo.email,
          firstName: this.contactInfo.firstName,
          homePhone: this.contactInfo.homePhone || null,
          lastName: this.contactInfo.lastName,
          notes: this.contactInfo.notes || null,
          state: this.contactInfo.state || null,
          usersID: this.contactInfo.usersID,
          workPhone: this.contactInfo.workPhone || null,
          zip: this.contactInfo.zip || null,
        }
        const isMatched = this.contacts.filter((item) => item.firstName === data.firstName
          && item.lastName === data.lastName
          && item.email === data.email
          && item.address1 === data.address1
          && item.address2 === data.address2
          && item.state === data.state
          && item.city === data.city
          && item.homePhone === data.homePhone
          && item.workPhone === data.workPhone
          && (item.cellPhone === data.cellPhone)).length > 0

        if (isMatched) {
          this.$root.$emit('snackbar', 'success', 'You already have this contact!')
          this.close()
          this.$root.$emit('getContacts')
          setTimeout(() => {
            this.$emit('reCreate')
            this.loading = false
          }, 1000)
        } else {
          Service.addContact(data).then((res) => {
            if (res.status === 200) {
              this.close()
              this.$root.$emit('getContacts')
              this.$root.$emit('snackbar', 'success', 'New Contact Added.')
              setTimeout(() => {
                this.$emit('reCreate')
              }, 1000)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      }
    },
    merge() {
      if (this.$refs.form.validate()) {
        this.loadingMerge = true
        const merged = { ...this.selectedContact, ...this.contactInfo, id: this.selectedContact.id }
        Service.editContact(merged.id, merged).then((res) => {
          if (res.status === 200) {
            this.$store.commit('setContact', res.data)
            this.$root.$emit('snackbar', 'success', 'Contact Merged.')
            this.$root.$emit('getContacts')
            this.close()
          }
        }).finally(() => {
          this.loadingMerge = false
        })
      }
    },
  },
}
</script>

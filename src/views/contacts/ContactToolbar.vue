<template>
  <v-toolbar dense class="primary text-white z-index-1 position-relative">
    <template v-if="isSmall">
      <v-toolbar-title class="m-auto d-flex justify-center">
        <v-icon left color="white">mdi-account</v-icon>
        Contacts
      </v-toolbar-title>
    </template>
    <template v-else>
      <v-toolbar-title class="m-auto d-flex justify-center">
        <v-icon left color="white">mdi-account</v-icon>
        Contacts
      </v-toolbar-title>

      <v-spacer />
      <v-spacer />
      <v-text-field v-model="search" dark class="white--text" @click:append="getContacts" @click:clear="getContacts('clear')" color="white" hide-details single-line
                    label="Search" append-icon="mdi-magnify" @keyup.enter.native="getContacts" clearable />
      <v-btn icon small class="mx-0 ml-2" @click="addNewContact">
        <v-icon color="white">mdi-account-plus</v-icon>
      </v-btn>
    </template>

    <ContactAddEditForm :isShow="isShow" @close="isShow = false" :newContact="contactInfo" :isEdit="false" :isMessage="false" @reCreate="addNewContact" />
  </v-toolbar>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ContactAddEditForm from '@/views/contacts/ContactAddEditForm.vue'
import Service from '../../service'

export default {
  name: 'ContactToolbar',
  components: { ContactAddEditForm },
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    search: '',
    isShow: false,
    contactInfo: null,
  }),
  computed: {
    ...mapGetters(['auth', 'contact', 'contacts']),
  },
  mounted() {
    this.getContacts()
    this.$root.$on('getContacts', () => {
      this.getContacts()
    })
  },
  methods: {
    getContacts(val) {
      const search = val !== 'clear' ? (this.search && this.search.length > 0 ? this.search : null) : null
      this.$emit('loading', true)
      Service.searchContact(this.auth.userID, search).then((res) => {
        if (res.status === 200) {
          const sortedContacts = _.sortBy(res.data, (contact) => contact.firstName.toLowerCase())
          this.$store.commit('setContacts', sortedContacts)
          this.setContact(sortedContacts)
        } else {
          this.$store.commit('setContacts', null)
        }
      }).catch(() => {
        this.$store.commit('setContacts', null)
      }).finally(() => {
        this.$emit('loading', false)
      })
    },
    setContact(contacts) {
      if (contacts && contacts.length > 0) {
        this.contactList = _.groupBy(contacts, (item) => item.firstName.toLowerCase().charAt(0))
        this.keys = _.keys(this.contactList)

        if (this.contact) {
          const isValid = this.contacts.filter((d) => d.id === this.contact.id)
          if (isValid.length === 0) {
            this.$store.commit('setContact', this.contactList[this.keys[0]][0])
          }
        } else {
          this.$store.commit('setContact', this.contactList[this.keys[0]][0])
        }
      } else {
        this.$store.commit('setContact', null)
      }
    },
    addNewContact() {
      this.isShow = true
      this.contactInfo = {
        usersID: this.auth.userID,
        firstName: null,
        lastName: null,
        email: null,
        homePhone: null,
        cellPhone: null,
        workPhone: null,
        notes: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        callTypesID: 1,
      }
    },
  },
}
</script>

<style scoped>

</style>

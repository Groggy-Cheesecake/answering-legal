<template>
  <v-card v-if="auth">
    <ContactToolbar isSmall @loading="setLoading" />
    <ContactListContent isSmall :loading="loading" />
    <v-divider class="my-0" />
    <v-card-actions>
      <v-btn class="secondary" @click="addNewContact">
        <v-icon left>mdi-account-plus</v-icon>
        ADD CONTACT
      </v-btn>
      <v-spacer />
      <v-btn class="secondary pl-4" to="contacts">
        VIEW CONTACTS
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>

    <ContactAddEditForm :isShow="isShow" @close="isShow = false" :newContact="contactInfo" :isEdit="false" :isMessage="false" @reCreate="addNewContact"/>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ContactAddEditForm from '@/views/contacts/ContactAddEditForm.vue'
import ContactToolbar from './ContactToolbar.vue'
import ContactListContent from './ContactListContent.vue'

export default {
  name: 'ContactList',
  components: {
    ContactAddEditForm,
    ContactListContent,
    ContactToolbar,
  },
  data: () => ({
    isShow: false,
    contactInfo: null,
    loading: false,
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  methods: {
    setLoading(val) {
      this.loading = val
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

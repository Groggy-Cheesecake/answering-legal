<template>
  <v-card class="contacts" v-if="auth">
    <ContactToolbar @loading="setLoading" />
    <v-row class="mx-0 pa-0 contact-body">
      <v-col :cols="contacts && contacts.length > 0 ? 6 : 12" class="pa-0 border he-100 d-none d-sm-block">
        <ContactListContent :loading="loading" />
      </v-col>
      <v-col cols="12" class="d-block d-sm-none h-auto">
        <ContactListSelectBox />
      </v-col>
      <v-col cols="12" class="px-0 py-0 he-100" sm="6" v-if="contact">
        <PerfectScrollbar class="mh-100">
          <ContactDetails :info="contact" :loading="loading" class="pb-2" />
          <v-divider class="mb-0" />
          <ContactTask :contactID="contact.id" />
          <v-divider class="mb-0" />
          <ContactComment :contactID="contact.id" />
        </PerfectScrollbar>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEnableMinPanel } from '@/plugins/auth0'
import ContactToolbar from './ContactToolbar.vue'
import ContactListContent from './ContactListContent.vue'
import ContactDetails from './ContactDetails.vue'
import ContactTask from './ContactTask.vue'
import ContactListSelectBox from './ContactListSelectBox.vue'
import ContactComment from './ContactComment.vue'

export default {
  name: 'Contacts',
  components: {
    ContactComment, // CommentForm,
    ContactListSelectBox,
    ContactTask,
    ContactDetails,
    ContactListContent,
    ContactToolbar,
  },
  data: () => ({
    comments: [],
    isShowComment: false,
    loading: true,
  }),
  computed: {
    ...mapGetters(['auth', 'contact', 'contacts']),
  },
  mounted() {
    if (isEnableMinPanel) {
      this.$mixpanel.track('Contacts', { genre: 'hip-hop', 'duration in seconds': 42 })
    }
  },
  methods: {
    setLoading(val) {
      this.loading = val
    },
  },
}
</script>

<style scoped lang="scss">
@media (max-width: 600px) {
  .contacts {
    height: auto !important;
  }

  .contact-body {
    height: auto !important;
    margin-bottom: 1rem;
  }
}

.contacts {
  height: calc(100vh - 17rem);
}

.contact-body {
  height: calc(100% - 48px)
}

.contact-list {
  height: 100%;
}
</style>

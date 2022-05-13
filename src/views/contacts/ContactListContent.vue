<template>
  <v-card-text class="contact-content position-relative pa-0 he-100" v-bind:class="{ small: isSmall }" style="border-right: 1px solid rgba(0,0,0,.12)">
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <PerfectScrollbar class="mh-100 he-100">
      <h1 v-if="!loading && keys && keys.length < 1" class="emptyDesc mb-0">No Contacts</h1>
      <v-list two-line class="py-0">
        <template v-for="(key, k) in keys">
          <p :key="k" class="contact-char mb-0 py-1 px-4 text-uppercase">{{ key }}</p>
          <template v-for="(ctact, index) in contactList[key]">
            <v-list-item class="contact-item" @click="goToContact(ctact)" :key="`${key}-${index}`"
                         v-bind:class="{ selected: contact && (ctact.id === contact.id) && !isSmall }">
              <v-list-item-avatar class="mr-2">
                <v-img :src="getImageUrl(ctact.imageURL)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-bold contact-title mb-2">{{ ctact.firstName }} {{ ctact.lastName }}</v-list-item-title>
                <v-list-item-subtitle class="text--primary">{{ ctact.address1 }} {{ ctact.address2 }} {{ ctact.city }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="`line-${key}${index}`" class="my-0" />
          </template>
        </template>
      </v-list>
    </PerfectScrollbar>
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ContactListContent',
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    contactList: null,
    keys: [],
  }),
  computed: {
    ...mapGetters(['auth', 'contact', 'contacts']),
  },
  watch: {
    contacts: {
      handler() {
        this.setContactListData()
      },
      deep: true,
    },
  },
  methods: {
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
    setContactListData() {
      this.contactList = _.groupBy(this.contacts, (item) => item.firstName.toLowerCase().charAt(0))
      this.keys = _.keys(this.contactList)
    },
    goToContact(item) {
      this.$store.commit('setContact', item)
      if (this.$route.name !== 'contacts') {
        this.$router.push('/contacts')
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.small.contact-content {
  min-height: 15rem;
  height: calc(50vh - 17.5rem);
}

.contact-char {
  color: $DarkBlue;
  background-color: $LightGray;
}

.selected:before {
  opacity: 0.1;
}
</style>

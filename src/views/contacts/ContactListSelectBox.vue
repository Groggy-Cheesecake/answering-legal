<template>
  <div v-if="contacts">
    <v-select :value="contact" :items="contacts" chips item-value="id" return-object @change="change" hide-details>
      <template v-slot:selection="data">
        <v-chip v-bind="data.attrs" :input-value="data.selected">
          <v-avatar left>
            <v-img :src="getImageUrl(data.item.imageURL)"></v-img>
          </v-avatar>
          {{ data.item.firstName }} {{ data.item.lastName }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-subheader>{{ data.item.key }}</v-subheader>
        </template>
        <template v-else>
          <v-list-item-avatar>
            <v-img :src="getImageUrl(data.item.imageURL)" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ data.item.firstName }} {{ data.item.lastName }}</v-list-item-title>
            <v-list-item-subtitle class="text--primary">{{ data.item.address1 }} {{ data.item.address2 }} {{ data.item.city }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ContactListSelectBox',
  data: () => ({
    loading: false,
    keys: [],
    selected: null,
  }),
  computed: {
    ...mapGetters(['auth', 'contact', 'contacts']),
  },
  mounted() {
    this.setContactListData()
  },
  methods: {
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
    setContactListData() {
      this.contactList = _.groupBy(this.contacts, (item) => item.firstName.charAt(0))
      this.keys = _.keys(this.contactList)
    },
    change(val) {
      this.$store.commit('setContact', val)
    },
  },
}
</script>

<style scoped>

</style>

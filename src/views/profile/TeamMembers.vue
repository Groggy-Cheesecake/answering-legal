<template>
  <v-card class="mt-4">
    <v-card-title>
      Team Members
    </v-card-title>
    <v-divider class="ma-0"></v-divider>
    <v-card-text class="pa-0">
      <v-list dense two-line>
        <v-list-item v-for="item in allTeamMembers" :key="item.title" class="widget-content">
          <v-list-item-avatar>
            <v-img :src="getImageUrl(item.usersImageURL)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="contact-title text-capitalize">
              <h6 class="font-weight-bold">{{ item.firstName }} {{ item.lastName }}</h6>
            </v-list-item-title>
            <v-list-item-subtitle class="text--secondary">
              <p class="mb-1"><strong>Email:</strong> {{ item.email }}</p>
              <p class="mb-1"><strong>Main Phone:</strong> {{ item.mainPhone }}</p>
              <p class="mb-1"><strong>Cell Phone:</strong> {{ item.cellPhone }}</p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TeamMembers',
  data: () => ({
    showTeamMember: true,
  }),
  computed: {
    ...mapGetters(['user', 'allTeamMembers']),
  },
  methods: {
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
  },
}
</script>

<style scoped>
</style>

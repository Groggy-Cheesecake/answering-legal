<template>
  <v-toolbar dense class="primary text-white z-index-1 position-relative">
    <template v-if="isSmall">
      <v-btn icon small class="mx-0" to="/messages" v-if="isBack">
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center">
        <v-icon left color="white">mdi-email</v-icon>
        Messages
      </v-toolbar-title>
      <v-spacer />
    </template>
    <template v-else>
      <v-toolbar-title class="m-auto d-flex justify-center">
        <v-icon left color="white">mdi-email</v-icon>
      </v-toolbar-title>
      <v-spacer />
      <v-spacer />
      <v-btn icon small class="mr-2 ml-0" @click="isFilterShow = true">
        <v-icon small color="white">mdi-filter</v-icon>
      </v-btn>
      <v-text-field v-model="search" dark class="white--text" @click:append="searchFunc" @click:clear="searchClearFunc" color="white" hide-details single-line label="Search"
                    append-icon="mdi-magnify" @keyup.enter.native="searchFunc" clearable />
      <v-btn icon small class="mx-0 ml-2" @click="isShow = true">
        <v-icon small color="white">mdi-folder</v-icon>
      </v-btn>
      <v-divider vertical inset dark class="ml-2 mr-2" />
      <v-btn icon small class="mx-0 mr-2" @click="backToInbox" v-if="isBackToInbox">
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-btn>
      <v-select v-model="selectedFolder" :items="folderList" @change="changeFolder" class="message-folder ml-2" item-text="folderName" item-value="id" return-object
                small dense hide-details single-line style="min-width: 120px; max-width: 120px;" flat solo />
    </template>

    <Folders :isShow="isShow" :userID="auth.userID" @close="close" @save="close" :isCreateFolder="true"></Folders>
    <FilterForm :isShow="isFilterShow" :searchWord="search" @close="close" @save="saveFilter"></FilterForm>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import Folders from '../../components/Folders.vue'
import FilterForm from './FilterForm.vue'

export default {
  name: 'MessageToolbar',
  components: {
    FilterForm,
    Folders,
  },
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
    isBack: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    search: null,
    isShow: false,
    folderList: [
      {
        id: 0,
        folderName: 'Inbox',
      },
      {
        id: 1,
        folderName: 'Favorite',
      },
      {
        id: 2,
        folderName: 'Trash',
      }],
    selectedFolder: {
      id: 0,
      folderName: 'Inbox',
    },
    isBackToInbox: false,
    isFilterShow: false,
    searchFilter: {
      searchWords: null,
      endDate: null,
      startDate: null,
      sortBy: 'dateReceived',
      searchFields: [],
      searchTags: [],
      folderID: 0,
    },
  }),
  watch: {
    folders(val) {
      this.folderList = [...val]
      this.folderList.unshift({
        id: 0,
        folderName: 'Inbox',
      }, {
        id: 1,
        folderName: 'Favorite',
      })
      this.folderList.push({
        id: 2,
        folderName: 'Trash',
      })

      this.selectedFolder = this.folderList.filter((i) => i.id === this.messageSearchFilter.folderID)[0]
    },
    selectedFolder(val) {
      this.isBackToInbox = val.id !== 0
    },
  },
  computed: {
    ...mapGetters(['auth', 'folders', 'messageSearchFilter']),
  },
  methods: {
    searchFunc() {
      const searchFilter = {
        ...this.messageSearchFilter,
        searchWords: this.search,
      }
      this.$store.commit('setMessageSearchFilter', searchFilter)
    },
    searchClearFunc() {
      const searchFilter = {
        ...this.messageSearchFilter,
        searchWords: null,
      }
      this.$store.commit('setMessageSearchFilter', searchFilter)
    },
    changeFolder(val) {
      const searchFilter = {
        ...this.messageSearchFilter,
        folderID: val.id,
      }
      this.$store.commit('setMessageSearchFilter', searchFilter)
    },
    saveFilter() {
      this.search = this.messageSearchFilter.searchWords
      this.close()
    },
    close() {
      this.isShow = false
      this.isFilterShow = false
    },
    backToInbox() {
      this.selectedFolder = {
        id: 0,
        folderName: 'Inbox',
      }

      const searchFilter = {
        ...this.messageSearchFilter,
        folderID: 0,
      }
      this.$store.commit('setMessageSearchFilter', searchFilter)
    },
  },
}
</script>

<style>
.message-folder .v-input__control {
  min-height: 32px !important;
}
</style>

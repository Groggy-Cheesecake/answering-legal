<template>
  <v-card v-bind:class="{ small: isSmall }" v-if="auth">
    <MessageToolbar :isSmall="isSmall" />
    <MultiSelectMenu v-if="isShowOverlay" :data="selected" @reload="getMessages(true)" @deleteMSG="deleteMSGSignal" />
    <v-card-text class="message-content position-relative pa-0">
      <v-overlay :value="loading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <div class="filterContent py-2 px-6" v-if="isFilter && !isSmall">
        <v-row class="align-center primary text-white" no-gutters>
          <v-col class="pa-0 font-size-lg px-4">
            <span v-if="messageSearchFilter.sortBy">Sort By: {{ messageSearchFilter.sortBy === 'dateReceived' ? 'Date' : 'Type of Call' }} | </span>
            <span v-if="messageSearchFilter.searchFields.length > 0">Search: {{ messageSearchFilter.searchFields.join().replace(',', ', ') }} | </span>
            <span v-if="messageSearchFilter.searchTags.length > 0">Tags: {{ messageSearchFilter.searchTags.join().replace(',', ', ') }}</span>
          </v-col>
          <v-col cols="auto" class="pa-0">
            <v-card-text class="pr-2 pa-0">
              <v-btn icon @click="clearFilter()">
                <v-icon small color="red">mdi-close</v-icon>
              </v-btn>
            </v-card-text>
          </v-col>
        </v-row>
      </div>
      <PerfectScrollbar class="scroll" v-bind:class="{'hasFilter': isFilter}">
        <h1 v-if="!loading && messages && messages.length < 1" class="emptyDesc mb-0">No Messages</h1>
        <v-list two-line class="py-0" v-if="!loading">
          <template v-for="(message, index) in messages">
            <v-list-item :key="index" class="message-item">
              <v-list-item-action class="m-auto mr-4">
                <v-checkbox @change="change(message)"></v-checkbox>
              </v-list-item-action>
              <v-list-item-icon class="m-auto mr-2 mb-4 align-self-center">
                <v-btn icon x-small v-if="message.read !== 1" @click="setMarkRead(message)">
                  <v-icon color="secondary">mdi-checkbox-blank-circle</v-icon>
                </v-btn>
              </v-list-item-icon>

              <v-list-item-avatar class="mr-2" @click="$router.push(`messages/${message.id}`)">
                <v-img :src="getImageUrl(message.iconURL)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content @click="$router.push(`messages/${message.id}`)">
                <v-list-item-title class="font-weight-bold message-title mb-2">{{ message.firstName }} {{ message.lastName }}</v-list-item-title>
                <v-list-item-subtitle class="text--primary" v-text="message.message"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text v-if="isLessOneDay">{{ message.dateReceived | moment('MM/DD/YYYY hh:mm A') }}</v-list-item-action-text>
                <v-list-item-action-text v-else>{{ message.dateReceived | moment('hh:mm A') }}</v-list-item-action-text>
                <v-row>
                  <v-col class="pa-0">
                    <v-btn small icon @click="deleteMessage([message.id])" v-if="messageSearchFilter.folderID !== 2">
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="py-0 pl-0">
                    <v-btn icon small @click="setFavorite(message)">
                      <v-icon small v-if="message.favorite !== 1">mdi-star-outline</v-icon>
                      <v-icon small v-else color="secondary">mdi-star</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="`line-${index}`" v-if="index < messages.length - 1 " class="my-0" />
          </template>
        </v-list>
      </PerfectScrollbar>
    </v-card-text>
    <v-divider class="my-0"></v-divider>
    <v-card-actions v-if="isSmall">
      <v-spacer />
      <v-btn class="secondary pl-4" to="messages">
        VIEW MESSAGES
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'
import MessageToolbar from './MessageToolbar.vue'
import MultiSelectMenu from './MultiSelectMenu.vue'

export default {
  name: 'MessageList',
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MultiSelectMenu,
    MessageToolbar,
  },
  data: () => ({
    loading: false,
    selected: [],
    isShowOverlay: false,
    deleteMsg: null,
  }),
  computed: {
    ...mapGetters(['user', 'auth', 'messages', 'messageSearchFilter']),
    isFilter() {
      return !(this.messageSearchFilter.searchFields.join() === ''
        && this.messageSearchFilter.searchTags.join() === ''
        && this.messageSearchFilter.sortBy === 'dateReceived'
        && this.messageSearchFilter.endDate === null
        && this.messageSearchFilter.startDate === null
        && this.messageSearchFilter.isFavorite === null)
    },
  },
  watch: {
    selected(val) {
      this.isShowOverlay = val.length > 0
    },
    messageSearchFilter: {
      handler() {
        this.getMessages(true)
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.commit('setMessageSearchFilter', {
      searchWords: null,
      endDate: null,
      startDate: null,
      sortBy: 'dateReceived',
      searchFields: [],
      searchTags: [],
      folderID: 0,
      isFavorite: null,
    })
    this.getMessages(true)

    const self = this
    this.$root.$on('getMessages', () => {
      self.getMessages(true)
    })
  },
  methods: {
    clearFilter() {
      this.$store.commit('setMessageSearchFilter', {
        searchWords: this.messageSearchFilter.searchWords,
        endDate: null,
        startDate: null,
        sortBy: 'dateReceived',
        searchFields: [],
        searchTags: [],
        folderID: 0,
        isFavorite: null,
      })
    },
    getMessages(isLoading = false) {
      this.selected = []
      this.isShowOverlay = false
      if (isLoading) this.loading = true
      const data = {
        searchWords: this.messageSearchFilter.searchWords || null,
        startDate: this.messageSearchFilter.startDate || null,
        endDate: this.messageSearchFilter.endDate || null,
        sortBy: this.messageSearchFilter.sortBy || null,
        searchFields: this.messageSearchFilter.searchFields.join() === '' ? null : this.messageSearchFilter.searchFields.join(),
        tags: this.messageSearchFilter.searchTags.join() || null,
        folderID: this.messageSearchFilter.folderID,
        isFavorite: this.messageSearchFilter.folderID === 1 ? 1 : this.messageSearchFilter.isFavorite,
      }

      Service.searchMessage(this.auth.userID, data).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setMessages', res.data)
        } else {
          this.$store.commit('setMessages', null)
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).finally(() => {
        if (isLoading) this.loading = false
      })
    },
    getImageUrl(link) {
      return `${this.$imgLink}${link || this.$avatar}`
    },
    setFavorite(message) {
      if (message.favorite === 1) {
        Service.setUnFavorite(this.user.id, message.id.toString()).then((res) => {
          if (res.status === 200) {
            this.getMessages()
          }
        })
      } else {
        Service.setFavorite(this.user.id, message.id.toString()).then((res) => {
          if (res.status === 200) {
            this.getMessages()
          }
        }).finally(() => {
          // moveTo Favorite folder
          Service.moveToFolder(this.auth.userID, {
            messageID: message.id.toString(),
            messageFolderID: 1,
          })
        })
      }
    },
    setMarkRead(message) {
      Service.setMarkRead(this.user.id, message.id.toString()).then((res) => {
        if (res.status === 200) {
          this.getMessages()
        }
      })
    },
    deleteMSGSignal() {
      this.deleteMessage(this.selected)
    },
    deleteMessage(messages) {
      Service.moveToFolder(this.auth.userID, {
        messageID: messages.join(),
        messageFolderID: 2,
      }).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Moved to Trash!')
          this.getMessages(true)
        }
      })
    },
    isLessOneDay(time) {
      return this.$moment().diff(this.$moment(time), 'days') < 1
    },
    change(message) {
      const unique = this.selected.filter((d) => d !== message.id)
      if (unique.length < this.selected.length) {
        this.selected = unique
      } else {
        this.selected.push(message.id)
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.message-content {
  min-height: 15rem;
  height: calc(100vh - 22rem)
}

.small .message-content {
  min-height: 15rem;
  height: calc(50vh - 17.5rem);
}

.filterContent .row {
  border-radius: 4px;
}

.scroll {
  height: 100%;
  overflow: hidden;
}

.hasFilter {
  height: calc(100% - 52px);
  overflow: hidden;
}

.message-title {
  color: $DarkBlue
}

.message-item:hover {
  background: #EFEFEF;
  cursor: pointer;
  z-index: 0;
}
</style>

<style>
.ps--active-x > .ps__rail-x, .ps--active-y > .ps__rail-y {
  z-index: 10;
}
</style>

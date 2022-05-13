<template>
  <v-card class="multiMenu position-absolute">
    <v-card-text class="text-center ma-auto py-1 px-1">
      <v-btn depressed class="white text-secondary text-center px-0" @click="moveTo" :loadingRead="loadingMoveTo" :disabled="loadingMoveTo">
        <v-icon color="secondary">mdi-folder</v-icon>
        Move To
      </v-btn>
      <v-btn depressed class="white text-secondary text-center px-0" @click="setMultiMarkRead" :loadingRead="loadingRead" :disabled="loadingRead">
        <v-icon color="secondary">mdi-email-open</v-icon>
        Mark Read
      </v-btn>
      <v-btn depressed class="white text-secondary text-center px-0" @click="setMultiMarkUnRead" :loadingRead="loadingUnRead" :disabled="loadingUnRead">
        <v-icon color="secondary">mdi-email</v-icon>
        Mark Unread
      </v-btn>
      <v-btn depressed class="white text-secondary text-center px-0" @click="addTags" :loadingRead="loadingTags" :disabled="loadingTags">
        <v-icon color="secondary">mdi-tag-plus</v-icon>
        Add Tags
      </v-btn>
      <v-btn depressed class="white text-secondary text-center px-0" @click="deleteMessages" :loadingRead="loadingDelete" :disabled="loadingDelete">
        <v-icon color="secondary">mdi-delete</v-icon>
        Trash
      </v-btn>
    </v-card-text>

    <Folders :isShow="isShow" :userID="auth.userID" :messageID="data" @close="close" @save="save" :isCreateFolder="false"></Folders>
    <Tags :isShow="isShowTag" :userID="auth.userID" :messageID="data" @close="close" @save="save"></Tags>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'
import Folders from '../../components/Folders.vue'
import Tags from '../../components/Tags.vue'

export default {
  name: 'MultiSelectMenu',
  components: {
    Tags,
    Folders,
  },
  props: ['data'],
  data: () => ({
    loadingMoveTo: false,
    loadingRead: false,
    loadingUnRead: false,
    loadingArchive: false,
    loadingTags: false,
    loadingDelete: false,
    isShow: false,
    isShowTag: false,
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  methods: {
    moveTo() {
      this.isShow = true
    },
    setMultiMarkRead() {
      this.loadingRead = true
      Service.setMarkRead(this.auth.userID, this.data.join()).then((res) => {
        if (res.status === 200) {
          this.loadingRead = false
          this.$root.$emit('snackbar', 'success', 'Set Mark Read!')
          this.$emit('reload')
        }
      })
    },
    setMultiMarkUnRead() {
      this.loadingUnRead = true
      Service.setMarkUnRead(this.auth.userID, this.data.join()).then((res) => {
        if (res.status === 200) {
          this.loadingUnRead = false
          this.$root.$emit('snackbar', 'success', 'Set Mark UnRead!')
          this.$emit('reload')
        }
      })
    },
    deleteMessages() {
      this.$emit('deleteMSG')
    },
    addTags() {
      this.isShowTag = true
    },
    close() {
      this.isShowTag = false
      this.isShow = false
    },
    save() {
      this.close()
      this.$emit('reload')
    },
  },
}
</script>

<style scoped>
.multiMenu {
  width: auto;
  height: auto;
  z-index: 2;
  top: 40px;
  left: calc(50% - 198px);
}
</style>

<style>
.multiMenu .v-btn {
  height: auto !important;
  font-size: 0.6rem !important;
}

.multiMenu .v-btn__content, .multiMenu .v-icon {
  display: block !important;
  margin-bottom: 0.2rem;
  color: #848484;
}

@media (max-width: 460px) {
  .multiMenu {
    width: 330px !important;
    left: calc(50% - 165px) !important;
  }
}

</style>

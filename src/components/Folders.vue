<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
          <v-icon left color="white">mdi-folder</v-icon>
          {{ isCreateFolder ? 'Manage Folders' : 'Move To' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <h6 class="font-weight-bold text-secondary">Create New Folder</h6>
        <v-row>
          <v-col md="9">
            <v-text-field v-model="createFolderName" prepend-inner-icon="mdi-folder" hide-details single-line dense label="Folder Name" />
          </v-col>
          <v-col md="3" class="text-right">
            <v-btn color="secondary" @click="createFolder" :loading="isCreate" :disabled="isCreateDisable">
              <v-icon left>mdi-folder-plus</v-icon>
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="ma-0" />
      <v-list rounded>
        <v-subheader class="font-weight-bold text-secondary mb-0">Folders</v-subheader>
        <v-list-item v-bind:class="{ selected: selected === 0 }" dense class="folderItem">
          <v-list-item-avatar @click="select({id: 0})">
            <v-avatar>
              <v-icon>mdi-folder</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content @click="select({id: 0})">
            <v-list-item-title>Inbox</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-bind:class="{ selected: selected === 1 }" dense class="folderItem">
          <v-list-item-avatar @click="select({id: 1})">
            <v-avatar>
              <v-icon>mdi-folder</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content @click="select({id: 1})">
            <v-list-item-title>Favorite</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <Draggable v-model="folders" ghost-class="ghost">
          <v-list-item v-for="(folder, i) in folders" :key="i" dense v-bind:class="{ selected: selected === folder.id }" class="folderItem">
            <v-list-item-avatar @click="select(folder)">
              <v-avatar>
                <v-icon>mdi-folder</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content @click="select(folder)">
              <v-list-item-title>{{ folder.folderName }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="folder.folderName !== 'archive'">
              <v-btn icon @click="deleteFolder(folder)" small>
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </Draggable>
        <v-divider />
        <v-list-item v-bind:class="{ selected: selected === 2 }" dense class="folderItem">
          <v-list-item-avatar @click="select({id: 2})">
            <v-avatar>
              <v-icon>mdi-folder</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content @click="select({id: 2})">
            <v-list-item-title>Trash</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="ma-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">{{ isCreateFolder ? 'Close' : 'Cancel' }}</v-btn>
        <v-btn color="secondary" @click="moveTo" :loading="loading" :disabled="disable" v-if="!isCreateFolder">
          Move To
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import Service from '../service'

export default {
  name: 'Folders',
  props: ['isShow', 'userID', 'messageID', 'isCreateFolder'],
  components: { Draggable },
  data: () => ({
    loading: false,
    disable: true,
    isCreate: false,
    isCreateDisable: true,
    selected: null,
    createFolderName: '',
    folders: null,
    list: null,
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  watch: {
    selected(val) {
      this.disable = val === null
    },
    createFolderName(val) {
      this.isCreateDisable = !val.length > 0
    },
    isShow(val) {
      if (val) this.getFolders()
    },
  },
  mounted() {
    this.getFolders()
  },
  methods: {
    getFolders() {
      Service.getFolders(this.auth.userID).then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            if (res.data[0].folderOrder) {
              const folderOrder = res.data[0].folderOrder.split(',')
              this.folders = _.sortBy(res.data, (item) => folderOrder.indexOf(item.id.toString()))
            } else {
              this.folders = res.data
            }
            this.$store.commit('setFolders', this.folders)
          } else {
            this.folders = []
            this.$store.commit('setFolders', this.folders)
          }
        }
      })
    },
    moveTo() {
      this.loading = true
      this.disable = true
      Service.moveToFolder(this.userID, {
        messageID: this.messageID.join(),
        messageFolderID: this.selected,
      }).then((res) => {
        if (res.status === 200) {
          this.loading = false
          this.disable = false
          this.$emit('save')
          this.$root.$emit('snackbar', 'success', 'Moved!')
        }
      })

      this.setFolderOrder()
    },
    select(folder) {
      if (folder.id === this.selected) {
        this.selected = null
      } else {
        this.selected = folder.id
      }
    },
    createFolder() {
      this.isCreate = true
      this.isCreateDisable = true
      Service.createFolder({
        usersID: this.userID,
        folderName: this.createFolderName,
      }).then((res) => {
        if (res.status === 200) {
          this.isCreate = false
          this.isCreateDisable = false
          this.createFolderName = ''
          this.$root.$emit('snackbar', 'success', `Create ${this.createFolderName} folder!`)
          this.getFolders()
        }
      })
    },
    deleteFolder(folder) {
      Service.deleteFolder(this.userID, folder.id.toString()).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', `Deleted ${folder.folderName} folder!`)
          this.getFolders()
        }
      })
    },
    setFolderOrder() {
      if (this.folders) {
        const folderIDs = (this.folders.map((d) => d.id)).join()
        Service.setFoldersOrder(this.auth.userID, { folderOrder: folderIDs })
      }
    },
    close() {
      this.setFolderOrder()
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.folderItem {
  cursor: pointer;
  margin-bottom: 4px;
  border-radius: 32px !important;
}

.folderItem:before {
  background-color: rgba(0, 0, 0, 0.87) !important;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: .3s cubic-bezier(.25, .8, .5, 1);
  transition: .3s cubic-bezier(.25, .8, .5, 1);
}

.selected:before {
  opacity: 0.2 !important;
  background-color: rgba(45, 155, 250, 0.87) !important;
}

.ghost {
  opacity: 0;
  background: #c8ebfb;
}
</style>

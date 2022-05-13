<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          <v-icon left color="white">mdi-tag-plus</v-icon>
          Add Tags
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <h6 class="font-weight-bold text-secondary">Add Tags</h6>
        <v-combobox v-model="tags" :items="showInTagsList" item-text="tags" hide-selected hint="Hit Enter to Create a Tag (Maximum of 5 tags)" multiple persistent-hint
                    :return-object="false">
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
              <v-icon left>mdi-tag</v-icon>
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
          <template v-slot:item="{ index, item }">
            {{ item.tags }}
            <v-spacer></v-spacer>
            <v-list-item-action @click.stop>
              <v-btn icon text small class="mx-0" @click.stop.prevent="deleteTag(item.tagID)">
                <v-icon small color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="secondary" @click="addTag" :loading="loading" :disabled="disable">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Service from '../service'

export default {
  name: 'Tags',
  props: ['isShow', 'userID', 'messageID', 'items'],
  data: () => ({
    loading: false,
    disable: true,
    tags: null,
  }),
  computed: {
    ...mapGetters(['auth', 'allTags']),
    showInTagsList() {
      return this.allTags.filter((d) => d.showInTagsList === 1)
    },
  },
  watch: {
    tags(val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.tags.pop())
        this.disable = true
      } else {
        this.disable = false
      }
    },
  },
  methods: {
    ...mapActions(['getAllTags']),
    addTag() {
      this.loading = true
      this.disable = true
      Service.addTag(this.auth.userID, this.messageID.join(), this.tags.join()).then((res) => {
        if (res.status === 200) {
          this.loading = false
          this.disable = false
          this.getAllTags(this.auth.userID)
          this.$emit('reloadTags')
          this.close()
        }
      })
    },
    remove(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.tags = [...this.tags]
    },
    close() {
      this.tags = null
      this.$emit('close')
    },
    deleteTag(tagID) {
      Service.deleteTagsFromShowInList(this.auth.userID, tagID).then((res) => {
        if (res.status === 200) {
          this.getAllTags(this.auth.userID)
        }
      })
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
</style>

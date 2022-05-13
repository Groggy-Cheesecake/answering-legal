<template>
  <v-dialog v-model="isShow" persistent max-width="540">
    <v-card>
      <v-toolbar dense class="primary text-white z-index-1 position-relative">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center ml-6">
          {{ isEdit ? 'Edit' : 'Add' }} Comment
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon text small class="mx-0" @click="close">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="py-4">
        <h6>Comment</h6>
        <v-textarea v-model="comment" color="secondary" rows="2" hide-details dense @keyup="updateComment" />
      </v-card-text>
      <v-divider class="my-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="secondary" @click="editComment" :loading="loading" :disabled="disable" v-if="isEdit">
          <v-icon left>mdi-content-save</v-icon>
          Update
        </v-btn>
        <v-btn color="secondary" @click="addComment" :loading="loading" :disabled="disable" v-else>
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../service'

export default {
  name: 'CommentForm',
  props: ['isShow', 'isEdit', 'messageID', 'contactID', 'content'],
  data: () => ({
    loading: false,
    disable: true,
    comment: '',
  }),
  computed: {
    ...mapGetters(['auth', 'user', 'allTeamMembers']),
  },
  watch: {
    isShow(val) {
      if (val && this.isEdit) {
        this.comment = this.content.comment
      }
    },
  },
  methods: {
    updateComment() {
      this.disable = this.comment === ''
    },
    addComment() {
      this.loading = true
      this.disable = true
      const data = {
        comment: this.comment,
        attachedToMessagesID: this.messageID || null,
        attachedToContactsID: this.contactID || null,
      }

      Service.addComment(this.auth.userID, data).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'created the comment!')
          this.$emit('reloadComments')
          this.close()
        }
      })
    },
    editComment() {
      this.loading = true
      this.disable = true
      const data = {
        id: this.content.cmtid,
        comment: this.comment,
        attachedToMessagesID: this.messageID || null,
        attachedToContactsID: this.contactID || null,
      }
      Service.updateComment(this.auth.userID, data).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'updated the comment')
          this.$emit('reloadComments')
          this.close()
        }
      })
    },
    close() {
      this.comment = ''
      this.loading = false
      this.disable = true
      this.$emit('close')
    },
  },
}
</script>

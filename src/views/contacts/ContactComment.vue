<template>
  <v-card-text class="px-3 py-0">
    <v-card-actions>
      <p class="mb-0 primaryText">Comments</p>
      <v-spacer />
      <v-btn small class="secondary" @click="addComment">
        <v-icon small left>mdi-comment-plus-outline</v-icon>
        Add Comment
      </v-btn>
    </v-card-actions>
    <v-divider class="mb-1 mt-0" />
    <div class="scroll position-relative">
      <v-overlay :value="loading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card-text class="pa-0" v-for="(comment, index) in comments" :key="index">
        <p class="contact-date text-right px-6 ma-0">{{ comment.dateCreated | moment('MMM DD, YYYY hh:mm A') }}</p>
        <v-row class="ma-0">
          <v-col class="pa-1 align-center d-flex">
            {{ comment.comment }}
          </v-col>
          <v-col cols="auto" class="pa-1 text-right">
            <v-btn icon flab small @click="editComment(comment)">
              <v-icon small color="secondary">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon flab small @click="deleteComment(comment)">
              <v-icon small color="red">mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <CommentForm :isShow="isShowComment" :isEdit="isEdit" :content="selectComment" :contactID="contactID" @close="isShowComment = false" @reloadComments="getComments" />
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentForm from '../../components/CommentForm.vue'
import Service from '../../service'

export default {
  name: 'ContactComment',
  components: { CommentForm },
  props: ['contactID'],
  data: () => ({
    isShowComment: false,
    isEdit: false,
    selectComment: null,
    comments: '',
    loading: true,
  }),
  computed: {
    ...mapGetters(['auth']),
  },
  watch: {
    contactID() {
      this.getComments()
    },
  },
  mounted() {
    this.getComments()
  },
  methods: {
    getComments() {
      this.loading = true
      Service.getContactComments(this.auth.userID, this.contactID).then((res) => {
        if (res.status === 200) {
          this.loading = false
          this.comments = res.data
        }
      })
    },
    addComment() {
      this.isEdit = false
      this.isShowComment = true
    },
    editComment(comment) {
      this.isEdit = true
      this.isShowComment = true
      this.selectComment = comment
    },
    deleteComment(comment) {
      Service.deleteComment(this.auth.userID, comment.cmtid).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', `"${comment.comment} "comment deleted!`)
          this.getComments()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.contact-date {
  color: $DarkBlue;
  background-color: $LightGray;
}
</style>

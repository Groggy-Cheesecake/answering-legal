<template>
  <v-card class="messageContent" v-if="message">
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-btn icon small class="mx-0" to="/messages">
        <v-icon color="white">mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center">
        {{ message.firstName }} {{ message.lastName }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon small class="mx-0" @click="prevMsg()">
        <v-icon color="white">mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon small class="mx-0" @click="nextMsg()">
        <v-icon color="white">mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>
    <PerfectScrollbar class="message-body">
      <v-row class="mx-0" style="height: 30%">
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Caller Information</h5>
            <v-spacer />
            <v-btn class="secondary" @click="addContact" :disabled="isDisableAddContactButton">
              <v-icon left>mdi-account-plus</v-icon>
              Add Contact
            </v-btn>
            <v-btn class="secondary" @click="isCreateTicket = true" :disabled="isTicketSent">
              <v-icon left>mdi-ticket</v-icon>
              {{ isTicketSent ? 'Ticket Created' : 'Create Ticket' }}
            </v-btn>
            <v-btn class="secondary" @click="setAppointment" :loading="loadingAppointment"
                   :disabled="loadingAppointment">
              <v-icon left>mdi-calendar-account</v-icon>
              {{ message.setAppointment === 1 ? getBtnName(message) : 'Set Appointment' }}
            </v-btn>
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text>
            <v-row>
              <v-col class="pb-0">
                <p><span class="font-weight-bold">DATE RECEIVED: </span>{{ message.dateOfCall | moment('MM/DD/YY hh:mm A') }}</p>
                <p><span class="font-weight-bold">CALLER NAME: </span>{{ message.firstName }} {{ message.lastName }}</p>
                <p><span class="font-weight-bold">PHONE: </span>{{ message.phone }}</p>
                <p><span class="font-weight-bold">EMAIL: </span>{{ message.email }}
                  <v-btn icon flab small v-clipboard:copy="message.email" v-clipboard:success="onCopy">
                    <v-icon small color="secondary">mdi-content-copy</v-icon>
                  </v-btn>
                </p>
                <p><span class="font-weight-bold">NEW CLIENT? : </span>{{ message.newClient === 0 ? 'No' : 'Yes' }}</p>
              </v-col>
              <v-col cols="auto" class="text-center justify-end align-center">
                <v-avatar size="56" class="nav_avatar">
                  <v-img :src="userIcon" />
                </v-avatar>
                <p class="pt-2">{{ message.longName }}</p>
              </v-col>
            </v-row>
            <v-divider class="mt-0" />
            <v-row>
              <v-col cols="6" class="py-0" v-for="(question,index) in message.questions" :key="index">
                <p class="mb-1" :key="index"><span class="font-weight-bold">{{ question.question }}</span>
                  {{ question.answer }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Message</h5>
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text>
            <p>{{ message.message }}</p>
          </v-card-text>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Tasks</h5>
            <v-spacer />
            <v-btn class="secondary" @click="addTask">
              <v-icon left>mdi-file-document-box-plus-outline</v-icon>
              Add Task
            </v-btn>
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text class="position-relative">
            <v-overlay :value="isLoadingTasks" absolute>
              <v-progress-circular indeterminate size="24"></v-progress-circular>
            </v-overlay>
            <template v-for="(task, index) in tasks">
              <v-row :key="index" class="mb-2">
                <v-col class="task-content align-center d-flex px-2 py-2 border position-relative">
                  <v-icon small color="green" class="mr-2" v-if="task.isCompleted === 1">mdi-check-circle-outline
                  </v-icon>
                  <v-icon small color="secondary" class="mr-2" v-else>mdi-progress-clock</v-icon>
                  <span
                    class="task-due-date position-absolute">{{ task.taskDueDate | moment('MMM DD, YYYY  hh:mm A') }}</span>
                  {{ task.taskDescription }}
                </v-col>
                <v-col cols="auto" class="mr-auto pa-2">
                  <v-btn icon flab small @click="deleteTask(task)">
                    <v-icon small color="red">mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon flab small @click="editTask(task)">
                    <v-icon small color="secondary">mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Tags</h5>
            <v-spacer />
            <v-btn class="secondary" @click="isShowTag = true">
              <v-icon left>mdi-tag-plus</v-icon>
              Add Tag
            </v-btn>
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text class="position-relative">
            <v-overlay :value="isLoadingTags" absolute>
              <v-progress-circular indeterminate size="24"></v-progress-circular>
            </v-overlay>
            <template v-for="(tag, index) in tags">
              <v-chip close :key="index" @click:close="deleteTag(tag)" class="mr-2">
                <v-icon left>mdi-tag</v-icon>
                <strong>{{ tag.tags }}</strong>
              </v-chip>
            </template>
          </v-card-text>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Comments</h5>
            <v-spacer />
            <v-btn class="secondary" @click="addComment()">
              <v-icon left>mdi-comment-plus-outline</v-icon>
              Add Comment
            </v-btn>
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text class="position-relative">
            <v-overlay :value="isLoadingComments" absolute>
              <v-progress-circular indeterminate size="24"></v-progress-circular>
            </v-overlay>
            <template v-for="(comment, index) in comments">
              <v-row :key="index" class="mb-2">
                <v-col class="task-content align-center d-flex px-2 py-0 border position-relative">
                  <span class="task-due-date position-absolute">{{ comment.firstName }} {{ comment.lastName }} - {{ comment.dateCreated | moment('MMM DD, YYYY  hh:mm A') }}</span>
                  {{ comment.comment }}
                </v-col>
                <v-col cols="auto" class="mr-auto px-2 py-0">
                  <v-btn icon flab small @click="deleteComment(comment)">
                    <v-icon small color="red">mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon flab small @click="editComment(comment)">
                    <v-icon small color="secondary">mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card-actions>
            <h5 class="mb-0 message-title">Call Details</h5>
            <v-spacer />
          </v-card-actions>
          <v-divider class="ma-0" />
          <v-card-text class="pb-0">Message ID: {{ message.ctiMessageID || message.id }}</v-card-text>
          <v-card-text class="py-0">Caller ID: {{ message.callerID }}</v-card-text>
          <v-card-text class="pt-0">Receptionist ID: {{ message.ctiReceptionistID }}</v-card-text>
        </v-col>
      </v-row>
    </PerfectScrollbar>

    <ContactAddEditForm :isShow="isShowContact" @close="isShowContact = false" :newContact="contactInfo" :isEdit="false" :isMessage="true" />
    <Tags :isShow="isShowTag" :userID="auth.userID" :messageID="[message.id]" @close="isShowTag = false"
          @reloadTags="getTags"></Tags>
    <TaskForm :usersID="auth.usersID" :isShow="isShowTask" :isEdit="isEditTask" :task="selectTask"
              @close="isShowTask = false" @reloadTasks="getTasks" />
    <CommentForm :isShow="isShowComment" :isEdit="isEditComment" :messageID="message.id" :content="selectComment"
                 @close="isShowComment = false"
                 @reloadComments="getComments" />
    <CreateTicket :isShow="isCreateTicket" :message="message" @sent="sentTicket" @close="isCreateTicket = false" />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ContactAddEditForm from '@/views/contacts/ContactAddEditForm.vue'
import Service from '../../service'
import Tags from '../../components/Tags.vue'
import TaskForm from '../../components/TaskForm.vue'
import CommentForm from '../../components/CommentForm.vue'
import CreateTicket from './CreateTicket.vue'

export default {
  name: 'MessageContent',
  components: {
    ContactAddEditForm,
    CreateTicket,
    CommentForm,
    TaskForm,
    Tags,
  },
  data: () => ({
    loadingAppointment: false,
    message: null,
    tags: null,
    tasks: null,
    isShowTag: false,
    isShowTask: false,
    isEditTask: false,
    selectTask: null,
    isShowContact: false,
    contactInfo: null,
    isDisableAddContactButton: false,
    comments: [],
    selectComment: null,
    isShowComment: false,
    isEditComment: false,
    isCreateTicket: false,
    isTicketSent: false,
    isLoadingTasks: false,
    isLoadingTags: false,
    isLoadingComments: false,
  }),
  computed: {
    ...mapGetters(['auth', 'user', 'messages', 'allTeamMembers']),
    userIcon: (vm) => vm.$imgLink + (vm.message.iconURL || vm.$avatar),
  },
  watch: {
    // eslint-disable-next-line func-names
    '$route.params.id': function () {
      this.getInformation()
    },
  },
  mounted() {
    this.$root.$emit('getCounter')
    const msg = this.messages.filter((d) => d.id === Number(this.$route.params.id))
    if (msg.length > 0) this.message = { ...msg[0] }
    this.isDisableAddContactButton = this.message.isContact === 1
    if (this.message && this.message !== 1) {
      Service.setMarkRead(this.auth.userID, this.message.id.toString())
    }
    this.getTags()
    this.getTasks()
    this.getComments()

    this.$root.$on('addContacts', () => {
      this.isDisableAddContactButton = true
    })
  },
  methods: {
    getBtnName(msg) {
      if (msg.followUp === null && msg.resultAppointment === null) {
        return 'Sent'
      }

      if (msg.resultAppointment === null) {
        const index = msg.followUp.length - 1
        return msg.followUp[`followUp${index}`]
      }

      return this.$moment(msg.resultAppointment).format('MM/DD/YYYY h:mm a')
    },
    getInformation() {
      this.$root.$emit('getCounter')
      const msg = this.messages.filter((d) => d.id === Number(this.$route.params.id))
      if (msg.length > 0) this.message = { ...msg[0] }
      this.isDisableAddContactButton = this.message.isContact === 1
      if (this.message && this.message !== 1) {
        Service.setMarkRead(this.auth.userID, this.message.id.toString())
      }
      this.getTags()
      this.getTasks()
      this.getComments()
    },
    prevMsg() {
      let index = this.messages.findIndex((d) => d.id === Number(this.$route.params.id)) - 1
      if (index === -1) index = this.messages.length - 1
      this.$router.push(`/messages/${this.messages[index].id}`)
    },
    nextMsg() {
      let index = this.messages.findIndex((d) => d.id === Number(this.$route.params.id)) + 1
      if (index === this.messages.length) index = 0
      this.$router.push(`/messages/${this.messages[index].id}`)
    },
    onCopy() {
      this.$root.$emit('snackbar', 'success', 'Copy to Clipboard!')
    },
    addContact() {
      this.isShowContact = true
      this.contactInfo = {
        usersID: this.auth.userID,
        firstName: this.message.firstName || null,
        lastName: this.message.lastName || null,
        email: this.message.email || null,
        homePhone: null,
        cellPhone: this.message.phone || null,
        workPhone: null,
        notes: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        callTypesID: this.message.callTypesID || null,
      }
    },
    setAppointment() {
      this.loadingAppointment = true
      Service.setAppointment(this.auth.userID, this.message.id).then((res) => {
        if (res.status === 200) {
          this.message.setAppointment = 1
          this.loadingAppointment = false
        }
      })
    },
    getTags() {
      this.isLoadingTags = true
      Service.getTags(this.message.id.toString()).then((res) => {
        if (res.status === 200) {
          this.tags = res.data
        }
      }).finally(() => {
        this.isLoadingTags = false
      })
    },
    deleteTag(tag) {
      Service.deleteTag(tag.tagID.toString()).then((res) => {
        if (res.status === 200) {
          this.tags.splice(this.tags.indexOf(tag), 1)
          this.tags = [...this.tags]
        }
      })
    },
    getTasks() {
      this.isLoadingTasks = true
      Service.getTasksByMessage(this.auth.userID, this.message.id.toString()).then((res) => {
        if (res.status === 200) {
          this.tasks = res.data
        }
      }).finally(() => {
        this.isLoadingTasks = false
      })
    },
    editTask(task) {
      this.selectTask = task
      this.isShowTask = true
      this.isEditTask = true
    },
    addTask() {
      this.selectTask = {
        usersID: this.auth.userID,
        description: '',
        taskDescription: '',
        assignedToUsersID: this.user.id,
        attachedToMessageID: this.message.id.toString(),
        taskDueDate: new Date().toISOString(),
        isCompleted: false,
      }
      this.isShowTask = true
      this.isEditTask = false
    },
    deleteTask(task) {
      Service.deleteTask(this.auth.userID, task.tsid)
        .then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'task deleted')
          }
        })
        .finally(() => {
          this.getTasks()
        })
    },
    getComments() {
      this.isLoadingComments = true
      Service.getMessageComments(this.auth.userID, this.message.id).then((res) => {
        if (res.status === 200) {
          this.comments = res.data
        }
      }).finally(() => {
        this.isLoadingComments = false
      })
    },
    addComment() {
      this.isShowComment = true
      this.isEditComment = false
    },
    editComment(comment) {
      this.selectComment = comment
      this.isShowComment = true
      this.isEditComment = true
    },
    deleteComment(comment) {
      Service.deleteComment(this.auth.userID, comment.cmtid).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', `"${comment.comment} "comment deleted!`)
          this.getComments()
        }
      })
    },
    sentTicket() {
      this.isCreateTicket = false
      this.isTicketSent = true
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.message-title {
  color: $DarkBlue
}

.message-body {
  height: calc(100vh - 22rem);
}

.task-due-date {
  right: 4px;
  top: 0;
  color: $DarkGray;
  font-size: .8rem;
}

.task-content {
  background-color: $LightGray;
}

.receptionID {
  font-size: 0.8rem;
}

.pointer {
  cursor: pointer;
}
</style>

<template>
  <v-card-text class="px-3 py-0">
    <v-card-actions>
      <p class="mb-0 primaryText">Tasks</p>
      <v-spacer />
      <v-btn small class="secondary" @click="addTask">
        <v-icon small left>mdi-file-document-box-plus-outline</v-icon>
        Add Task
      </v-btn>
    </v-card-actions>
    <v-divider class="mb-1 mt-0" />
    <div class="scroll position-relative">
      <v-overlay :value="loading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card-text class="pa-0" v-for="(task, index) in tasks" :key="index">
        <p class="task-date text-right px-6 ma-0">{{ task.taskDueDate | moment('MMM DD, YYYY hh:mm A') }}</p>
        <v-row class="ma-0">
          <v-col class="pa-1 align-center d-flex">
            <v-icon small color="green" class="mr-2" v-if="task.isCompleted === 1">mdi-check-circle-outline</v-icon>
            <v-icon small color="secondary" class="mr-2" v-else>mdi-progress-clock</v-icon>
            {{ task.taskDescription }}
          </v-col>
          <v-col cols="auto" class="pa-1 text-right">
            <v-btn icon flab small @click="editTask(task)">
              <v-icon small color="secondary">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon flab small @click="deleteTask(task)">
              <v-icon small color="red">mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <TaskForm :usersID="auth.usersID" :isShow="isShow" :isEdit="isEdit" :task="selectTask" @close="isShow = false" @reloadTasks="getTasks" />
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskForm from '../../components/TaskForm.vue'
import Service from '../../service'

export default {
  name: 'ContactTask',
  components: { TaskForm },
  props: ['contactID'],
  data: () => ({
    isShow: false,
    isEdit: false,
    selectTask: null,
    loading: true,
    tasks: null,
  }),
  computed: {
    ...mapGetters(['auth', 'user', 'allTeamMembers']),
  },
  watch: {
    contactID(val) {
      this.getTasks(val)
    },
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    getTasks() {
      this.loading = true
      Service.getTasksByContact(this.auth.userID, this.contactID).then((res) => {
        if (res.status === 200) {
          this.tasks = res.data
        }
        this.loading = false
      })
    },
    editTask(task) {
      this.selectTask = task
      this.isEdit = true
      this.isShow = true
    },
    addTask() {
      this.selectTask = {
        usersID: this.auth.userID,
        description: '',
        taskDescription: '',
        assignedToUsersID: this.user.id,
        attachedToMessageID: null,
        reminder: false,
        taskDueDate: new Date().toISOString(),
        attachedToContactsID: this.contactID,
      }

      this.isEdit = false
      this.isShow = true
    },
    deleteTask(task) {
      Service.deleteTask(this.auth.userID, task.tsid).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'task deleted')
        }
      }).finally(() => {
        this.getTasks()
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.task-date {
  color: $DarkBlue;
  background-color: $LightGray;
}
</style>

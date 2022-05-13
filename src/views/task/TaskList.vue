<template>
  <v-card v-bind:class="{ small: isSmall }" v-if="auth">
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <template v-if="isSmall">
        <v-spacer />
        <v-toolbar-title class="m-auto d-flex justify-center">
          <v-icon left color="white">mdi-notebook</v-icon>
          Tasks
        </v-toolbar-title>
        <v-spacer />
      </template>
      <template v-else>
        <v-toolbar-title class="m-auto d-flex justify-center">
          <v-icon left color="white">mdi-notebook</v-icon>
          Tasks
        </v-toolbar-title>
        <v-spacer />
        <v-select v-model="selectedFilterTask" :items="filterTaskList" @change="changeFilter" class="task-filter ml-2" item-text="name" item-value="id" return-object
                  small dense hide-details single-line style="min-width: 200px; max-width: 200px;" flat solo />
      </template>
    </v-toolbar>

    <v-card-text class="task-content position-relative pa-0">
      <h1 v-if="!loading && tasks && tasks.length < 1" class="emptyDesc mb-0">No Tasks</h1>
      <v-overlay :value="loading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <PerfectScrollbar class="mh-100">
        <template v-for="(task, index) in tasks">
          <v-card-text :key="index" class="py-0 px-3">
            <v-row class="task-date font-weight-bold">
              <v-col cols="6" class="py-1 px-6">{{ (task.isCompleted === 1 ? task.dateCompleted : task.taskDueDate) | moment('MMM DD, YYYY') }}</v-col>
              <v-col cols="6" class="py-1 px-6 text-right">{{ (task.isCompleted === 1 ? task.dateCompleted : task.taskDueDate) | moment('hh:mm A') }}</v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="auto" class="align-center d-flex">
                <v-icon small color="green" v-if="task.isCompleted === 1">mdi-check-circle-outline</v-icon>
                <v-icon small color="secondary" v-else>mdi-progress-clock</v-icon>
              </v-col>
              <v-col class="px-0 align-center d-flex">{{ task.taskDescription }}</v-col>
              <v-col cols="auto" class="px-0 text-right" v-if="task.isCompleted !== 1 && isCheckAssignedToOthers(task)">
                {{ getAssignedTo(task) }}
              </v-col>
              <v-col cols="auto" class="px-0 text-right" v-if="isCheck(task)">
                Assigned By: {{ task.firstName }} {{ task.lastName }}
                <v-btn small class="mx-2" color="secondary" @click="setAssignToUser(task, 1, index)" :loading="loadingAccept && index === ind"
                       :disabled="loadingAccept && index === ind">Accept
                </v-btn>
                <v-btn small @click="setAssignToUser(task, 0, index)" :loading="loadingDeny && index === ind"
                       :disabled="loadingDeny && index === ind">Deny
                </v-btn>
              </v-col>
              <v-col cols="auto" class="px-0 text-right" v-if="isCompleted(task)">
                <v-btn small class="mx-2" color="secondary" @click="setComplete(task, 1, index)" :loading="loadingComplete && index === ind"
                       :disabled="loadingComplete && index === ind">Complete
                </v-btn>
              </v-col>
              <v-col cols="auto" class="px-0 text-right" v-if="task.isCompleted === 1">
                Completed!
              </v-col>
              <v-col cols="auto" class="pr-6 text-right">
                <v-btn icon flab small @click="editTask(task, isCheck(task))">
                  <v-icon small color="secondary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon flab small @click="deleteTask(task)">
                  <v-icon small color="red">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </template>
      </PerfectScrollbar>
    </v-card-text>
    <v-divider class="my-0"></v-divider>
    <v-card-actions v-if="isSmall">
      <v-btn class="secondary" @click="addTask">
        <v-icon left>mdi-plus</v-icon>
        Add Task
      </v-btn>
      <v-spacer />
      <v-btn class="secondary pl-4" to="tasks">
        VIEW TASKS
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer />
      <v-btn class="secondary" @click="addTask">
        <v-icon left>mdi-plus</v-icon>
        Add Task
      </v-btn>
      <v-spacer />
    </v-card-actions>

    <TaskForm :usersID="auth.usersID" :isShow="isShow" :isEdit="isEdit" :task="selected" @close="isShow = false" @reloadTasks="changeFilter(selectedFilterTask)" />
    <TaskFilterForm :isShow="isFilterShow" @close="close" @save="saveFilter"></TaskFilterForm>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'
import TaskForm from '../../components/TaskForm.vue'
import TaskFilterForm from './TaskFilterForm.vue'

export default {
  name: 'TaskList',
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TaskFilterForm,
    TaskForm,
  },
  data: () => ({
    ind: -1,
    loading: false,
    selected: null,
    isShow: false,
    isEdit: true,
    loadingAccept: false,
    loadingDeny: false,
    loadingComplete: false,
    isFilterShow: false,
    selectedFilterTask: {
      id: '',
      name: 'All Tasks',
    },
    filterTaskList: [
      { name: 'All Tasks', id: '' },
      { name: 'My Tasks', id: 'isAssignedToMyself' },
      { name: 'Completed Tasks', id: 'isCompleted' },
      { name: 'Past Due Tasks', id: 'isPastDueTasks' },
    ],
  }),
  computed: {
    ...mapGetters(['auth', 'tasks', 'allTeamMembers']),
  },
  watch: {
    selectedFolder(val) {
      this.isBackToInbox = val.id !== 0
    },
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    getAssignedTo(task) {
      if (task.assignedToUsersID.toString() !== this.auth.userID.toString()) {
        const user = this.allTeamMembers.filter((item) => item.id === task.assignedToUsersID)
        return `Assigned To: ${user[0].firstName} ${user[0].lastName}`
      }

      return ''
    },
    setComplete(task, flag, index) {
      this.ind = index

      this.loadingComplete = true
      Service.markTaskCompleted(this.auth.userID, task.tsid).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Task Completed!')
          this.changeFilter(this.selectedFilterTask)
        }
      }).finally(() => {
        this.loadingComplete = false
      })
    },
    changeFilter(val) {
      if (val.id !== '') {
        const key = val.id
        const filter = { [key]: 1 }
        this.loading = true
        Service.filterTask(this.auth.userID, filter).then((res) => {
          if (res.status === 200) {
            this.$store.commit('setTasks', res.data)
          } else {
            this.$store.commit('setTasks', null)
            this.$root.$emit('snackbar', 'error', `${res.status} error`)
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.getTasks()
      }
    },
    saveFilter() {
      this.close()
    },
    close() {
      this.isShow = false
      this.isFilterShow = false
    },
    isCheck(task) {
      return task.assignedByUsersID.toString() !== this.auth.userID.toString() && task.assignedTaskAccepted === null
    },
    isCheckAssignedToOthers(task) {
      return task.assignedToUsersID.toString() !== this.auth.userID.toString()
    },
    isCompleted(task) {
      return task.assignedTaskAccepted !== 0 && task.isCompleted !== 1 && task.assignedToUsersID.toString() === this.auth.userID.toString()
    },
    getTasks() {
      this.loading = true
      Service.getTasks(this.auth.userID).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setTasks', res.data)
        } else {
          this.$store.commit('setTasks', null)
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    setAssignToUser(task, isAssignedTaskAccepted, index) {
      this.ind = index
      const data = {
        tasksID: task.tsid,
        assignedTaskAccepted: isAssignedTaskAccepted,
      }

      if (isAssignedTaskAccepted > 0) {
        this.loadingAccept = true
      } else {
        this.loadingDeny = true
      }
      Service.setAcceptTask(task.assignedToUsersID, data).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'Assign Task!')
          this.changeFilter(this.selectedFilterTask)
        }
      }).finally(() => {
        if (isAssignedTaskAccepted > 0) {
          this.loadingAccept = false
        } else {
          this.loadingDeny = false
        }
      })
    },
    editTask(task, isMarkRead) {
      this.selected = task
      this.isShow = true
      this.isEdit = true

      if (isMarkRead) {
        Service.markTaskRead(this.auth.userID, task.tsid).then((res) => {
          if (res.status === 200) {
            this.$root.$emit('snackbar', 'success', 'Read Task!')
          }
        })
      }
    },
    addTask() {
      this.selected = {
        usersID: this.auth.userID,
        description: '',
        taskDescription: '',
        assignedToUsersID: null,
        attachedToMessageID: null,
        reminder: false,
        taskDueDate: new Date().toISOString(),
        attachedToContactsID: null,
      }
      this.isShow = true
      this.isEdit = false
    },
    deleteTask(task) {
      Service.deleteTask(this.auth.userID, task.tsid).then((res) => {
        if (res.status === 200) {
          this.$root.$emit('snackbar', 'success', 'task deleted')
        }
      }).finally(() => {
        this.changeFilter(this.selectedFilterTask)
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/_variables.scss";

.task-content {
  min-height: 15rem;
  height: calc(100vh - 25.5rem)
}

.small .task-content {
  min-height: 15rem;
  height: calc(50vh - 17.5rem);
}

.task-date {
  color: $DarkBlue;
  background-color: $LightGray;
}

.task-item:hover {
  background: #EFEFEF;
  cursor: pointer;
}
</style>

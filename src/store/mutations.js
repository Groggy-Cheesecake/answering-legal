export default {
  setAuth: (state, auth) => {
    state.auth = auth
  },
  setUser: (state, user) => {
    state.user = user || null
  },
  setGroupTextMembers: (state, members) => {
    state.allGroupTextMembers = members || null
  },
  setAllTeamMembers: (state, members) => {
    state.allTeamMembers = members || null
  },
  setAllTags: (state, allTags) => {
    state.allTags = allTags || null
  },
  setCurrentStatus: (state, status) => {
    state.currentStatus = status || null
  },
  setDefaultStatus: (state, status) => {
    state.defaultStatus = status || null
  },
  setMessages: (state, messages) => {
    state.messages = messages || null
  },
  setUnreadMessageCounter: (state, counter) => {
    state.unReadMsgCounter = counter || 0
  },
  setTasks: (state, tasks) => {
    state.tasks = tasks || null
  },
  setContacts: (state, contacts) => {
    state.contacts = contacts || null
  },
  setContact: (state, contact) => {
    state.contact = contact || null
  },
  setFolders: (state, folders) => {
    state.folders = folders || null
  },
  setMessageSearchFilter: (state, messageSearchFilter) => {
    state.messageSearchFilter = messageSearchFilter
  },
  setTaskFilter: (state, taskFilter) => {
    state.taskFilter = taskFilter || null
  },
  setSchedules: (state, schedules) => {
    state.schedules = schedules || null
  },
  setNextStatus: (state, nextStatus) => {
    state.nextStatus = nextStatus || null
  },
  setTodaySchedules: (state, todaySchedules) => {
    state.todaySchedules = todaySchedules || null
  },
  setAllStatus: (state, status) => {
    state.allStatus = status || null
  },
  setAllStatusMessages: (state, messages) => {
    state.allStatusMessages = messages || null
  },
  setAllStatusCallbackMessages: (state, messages) => {
    state.allStatusCallbackMessages = messages || null
  },
  setAllNotificationSetting: (state, setting) => {
    state.allNotificationSetting = setting || null
  },
  setMainTutorial: (state, status) => {
    state.isMainTutorial = status || false
  },
  setMessageTutorial: (state, status) => {
    state.isMessageTutorial = status || false
  },
  clearAll: (state) => {
    state.auth = null
    state.user = null
    state.currentStatus = null
    state.defaultStatus = null
    state.allGroupTextMembers = null
    state.allTeamMembers = null
    state.allTags = null
    state.messages = null
    state.unReadMsgCounter = 0
    state.folders = null
    state.tasks = null
    state.contacts = null
    state.contact = null
    state.schedules = null
    state.nextStatus = null
    state.todaySchedules = null
    state.allStatus = null
    state.allStatusMessages = null
    state.allStatusCallbackMessages = null
    state.messageSearchFilter = {
      searchWords: null,
      endDate: null,
      startDate: null,
      sortBy: 'dateReceived',
      searchFields: [],
      searchTags: [],
      folderID: 0,
      isFavorite: null,
    }
    state.taskFilter = {}
    state.allNotificationSetting = null
  },
}

export default {
  auth: null,
  user: null,
  currentStatus: null,
  defaultStatus: null,
  allGroupTextMembers: null,
  allTeamMembers: null,
  allTags: null,
  messages: null,
  unReadMsgCounter: 0,
  folders: null,
  tasks: null,
  contacts: null,
  contact: null,
  schedules: null,
  nextStatus: null,
  todaySchedules: null,
  allStatus: null,
  allStatusMessages: null,
  allStatusCallbackMessages: null,
  messageSearchFilter: {
    searchWords: null,
    endDate: null,
    startDate: null,
    sortBy: 'dateReceived',
    searchFields: [],
    searchTags: [],
    folderID: 0,
    isFavorite: null,
  },
  taskFilter: {},
  allNotificationSetting: null,

  isMainTutorial: false,
  isMessageTutorial: false,
}
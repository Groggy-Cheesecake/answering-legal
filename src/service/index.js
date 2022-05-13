import Vue from 'vue'

export default {
  // User Profile APIs
  getUser: (userID) => Vue.axios.get(`/user/${userID}`),
  updateUser: (user) => Vue.axios.put(`/user/confirm/profile/${user.id}`, user),
  uploadProfileImage: (userID, image) => {
    const formData = new FormData()
    formData.append('image', image)
    return Vue.axios.post(`/uploads/${userID}/image-upload`, formData)
  },
  uploadCompanyImage: (userID, image) => {
    const formData = new FormData()
    formData.append('image', image)
    return Vue.axios.post(`/uploads/${userID}/company/image-upload`, formData)
  },

  // Greet Scripts
  getAllStatusMessages: (userID) => Vue.axios.get(`/greetingscript/all/${userID}`),
  getAllStatusCallbackMessages: (userID) => Vue.axios.get(`/greetingscript/callbacks/${userID}`),

  // TeamMember APIs
  getAllTeamMembers: (userID) => Vue.axios.get(`/team/all/${userID}`),

  // GroupTextMember APIs
  getAllGroupTextMembers: (userID) => Vue.axios.get(`/grouptext/all/${userID}`),
  addGroupTextMember: (data) => Vue.axios.post('/grouptext', data),
  editGroupTextMember: (userID, data) => Vue.axios.put(`/grouptext/update/${userID}`, data),
  deleteGroupTextMember: (userID, groupTextID) => Vue.axios.delete(`/grouptext/delete/${userID}`, { data: { groupTextID } }),

  // Message APIs
  getAllMessages: (userID) => Vue.axios.get(`message/all/${userID}`),
  getUnreadMessageCounter: (userID) => Vue.axios.get(`message/unread/${userID}`),
  setMarkRead: (userID, messageID) => Vue.axios.put(`/message/markread/${userID}`, { messageID }),
  setMarkUnRead: (userID, messageID) => Vue.axios.put(`/message/markunread/${userID}`, { messageID }),
  setFavorite: (userID, messageID) => Vue.axios.put(`/message/markfavorite/${userID}`, { messageID }),
  setUnFavorite: (userID, messageID) => Vue.axios.put(`/message/markunfavorite/${userID}`, { messageID }),
  setAppointment: (userID, messageID) => Vue.axios.put(`/message/setappointment/${userID}`, { messageID }),
  searchMessage: (userID, search) => Vue.axios.get(`/message/search/${userID}`, { params: search }),
  deleteMessage: (userID, messageID) => Vue.axios.put(`/message/delete/${userID}`, { messageID }),

  // Comments APIs
  getMessageComments: (userID, messagesID) => Vue.axios.get(`message/comments/bymessage/${userID}/${messagesID}`),
  getContactComments: (userID, contactsID) => Vue.axios.get(`message/comments/bycontacts/${userID}/${contactsID}`),
  addComment: (userID, data) => Vue.axios.post(`message/comments/${userID}`, data),
  updateComment: (userID, data) => Vue.axios.put(`message/comments/${userID}`, data),
  deleteComment: (userID, commentID) => Vue.axios.put(`message/comments/delete/${userID}`, { id: commentID }),

  // Task APIs
  getTasks: (userID) => Vue.axios.get(`/tasks/${userID}`),
  getTasksByMessage: (userID, messageID) => Vue.axios.get(`/tasks/${userID}/${messageID}`),
  getTasksByContact: (userID, contactID) => Vue.axios.get(`/tasks/bycontact/${userID}/${contactID}`),
  addTask: (task) => Vue.axios.post('/tasks', task),
  editTask: (taskID, task) => Vue.axios.put(`/tasks/update/${taskID}`, task),
  deleteTask: (userID, tasksID) => Vue.axios.delete(`/tasks/delete/${userID}`, { data: { tasksID } }),
  setAcceptTask: (userID, data) => Vue.axios.put(`/tasks/accepttask/${userID}`, data),
  markTaskRead: (userID, tasksID) => Vue.axios.put(`/tasks/markread/${userID}`, { tasksID }),
  markTaskCompleted: (userID, tasksID) => Vue.axios.put(`/tasks/markcomplete/${userID}`, { tasksID }),
  filterTask: (userID, filter) => Vue.axios.get(`/tasks/filter/${userID}`, { params: filter }),

  // Schedule APIs
  getSchedules: (userID) => Vue.axios.get(`/schedule/all/${userID}`),
  getNextStatus: (userID) => Vue.axios.get(`/status/next/${userID}`),
  getCurrentStatus: (userID, date) => Vue.axios.get(`/status/current/${userID}`, { params: { date } }),
  getDefaultStatus: (userID, date) => Vue.axios.get(`/status/getdefault/${userID}`, { params: { date } }),
  getAllStatus: (userID) => Vue.axios.get(`/status/all/${userID}`),
  getTodayDispatchScheduleEvent: (userID, timeline) => Vue.axios.get(`schedule/day/${userID}`, { params: timeline }),
  createDispatchStatus: (data) => Vue.axios.post('status', data),
  updateDispatchStatus: (userID, data) => Vue.axios.put(`status/update/${userID}`, data),
  deleteDispatchStatus: (userID, dispatchStatusID) => Vue.axios.delete(`status/delete/${userID}`, { data: { dispatchStatusID } }),
  createDispatchScheduleEvent: (data) => Vue.axios.post('schedule', data),
  updateDispatchScheduleEvent: (userID, data) => Vue.axios.put(`schedule/update/${userID}`, data),
  deleteDispatchScheduleEvent: (userID, eventID) => Vue.axios.delete(`schedule/delete/${userID}`, { data: { dispatchScheduleID: eventID } }),
  returnToDefaultScheduleEvent: (userID, eventID) => Vue.axios.post(`schedule/returntodefault/${userID}`, { dispatchScheduleID: eventID }),

  // Contact APIs
  getContacts: (userID) => Vue.axios.get(`/contacts/all/${userID}`),
  addContact: (contact) => Vue.axios.post('/contacts', contact),
  editContact: (contactID, contact) => Vue.axios.put(`/contacts/update/${contactID}`, contact),
  deleteContact: (userID, contactsID) => Vue.axios.delete(`contacts/delete/${userID}`, { data: { contactsID } }),
  uploadContactAvatarImage: (userID, contactID, image) => {
    const formData = new FormData()
    formData.append('image', image)
    return Vue.axios.post(`uploads/contacts/${userID}/${contactID}/image-upload`, formData)
  },
  searchContact: (userID, searchWords) => Vue.axios.get(`/contacts/search/${userID}/${searchWords}`),

  // Folder APIs
  getFolders: (userID) => Vue.axios.get(`/message/getfolders/${userID}`),
  createFolder: (data) => Vue.axios.post('/message/createfolder', data),
  deleteFolder: (userID, messageFolderID) => Vue.axios.delete(`/message/deletefolder/${userID}`, { data: { messageFolderID } }),
  setFoldersOrder: (userID, data) => Vue.axios.put(`/message/updatefolderorder/${userID}`, data),

  // Tag APIs
  getAllTags: (userID) => Vue.axios.get(`/message/alltags/${userID}`),
  addTag: (userID, messageID, tags) => Vue.axios.post(`/message/tags/${userID}`, {
    messageID,
    tags,
  }),
  getTags: (messageID) => Vue.axios.get(`/message/tags/${messageID}`),
  deleteTag: (tagID) => Vue.axios.delete('/message/tags', { data: { tagID } }),
  deleteTagsFromShowInList: (userID, tagID) => Vue.axios.put(`/message/tags/${userID}`, { tagID }),
  moveToFolder: (userID, messageID) => Vue.axios.put(`/message/movetofolder/${userID}`, messageID),

  // Ticket
  sendTicket: (data) => Vue.axios.post('/notifications/sendsupport', data),

  // Push Notification
  registerPushNotification: (userID, data) => Vue.axios.post(`/notifications/${userID}/register`, data),
  getAllNotificationSetting: (userID) => Vue.axios.get(`/notifications/${userID}`),
  updateNotification: (userID, configure) => Vue.axios.put(`/notifications/${userID}/updateStatusNotificationSetting`, configure),

  // Change logs
  getFilterChangeLogs: (userID, pageNum, pageSize, viewTypes) => Vue.axios.get(`/changelog/view/${userID}`, {
    params: {
      pageNum,
      pageSize,
      viewTypes,
    },
  }),
  getAllChangeLogs: (userID, pageNum, pageSize) => Vue.axios.get(`/changelog/view/${userID}`, {
    params: {
      pageNum,
      pageSize,
    },
  }),

  // FormStack
  addUserHashKey: (usersID, formstackHashKey, formstackHmacKey) => Vue.axios.post('/formstack', { usersID, formstackHashKey, formstackHmacKey }),
  deleteUserHashKey: (userID) => Vue.axios.delete(`formstack/delete/${userID}`),
}

import _ from 'lodash'
import moment from 'moment'
import { DateTimeFormat, DateFormat, TimeFormat } from '@/const'
import Service from '../service'

export default {
  getUser({ commit }, payload) {
    Service.getUser(payload).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        commit('setUser', res.data[0])
      }
    }).catch(() => {
      commit('setUser', null)
    })
  },
  getCurrentStatus({ commit }, payload) {
    const date = moment.utc(moment().toISOString()).format(DateTimeFormat).replace(' ', 'T')

    Service.getCurrentStatus(payload, date).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        const todayDate = moment().format(DateFormat)
        const currentStatus = { ...res.data[0] }
        const start = moment(res.data[0].startDate)
        const end = moment(res.data[0].endDate)
        const startTime = moment(res.data[0].startDate).format(TimeFormat)
        const duration = moment.duration(end.diff(start)).asMinutes()
        currentStatus.startDate = moment(`${todayDate} ${startTime}`).toISOString()
        currentStatus.endDate = moment(`${currentStatus.startDate}`).add(duration, 'minutes').toISOString()
        commit('setCurrentStatus', currentStatus)
      } else {
        commit('setCurrentStatus', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setCurrentStatus', null)
    })
  },

  getDefaultStatus({ commit }, payload) {
    const date = moment.utc(moment().toISOString()).format(DateTimeFormat).replace(' ', 'T')

    Service.getDefaultStatus(payload, date).then((res) => {
      if (res.status === 200 && res.data.length > 0) {
        commit('setDefaultStatus', res.data[0])
      } else {
        commit('setDefaultStatus', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setDefaultStatus', null)
    })
  },
  getAllTags({ commit }, payload) {
    Service.getAllTags(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllTags', res.data)
      } else {
        commit('setAllTags', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllTags', null)
    })
  },
  getAllTeamMembers({ commit }, payload) {
    Service.getAllTeamMembers(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllTeamMembers', _.orderBy(res.data, 'firstName'))
      } else {
        commit('setAllTeamMembers', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllTeamMembers', null)
    })
  },
  getAllGroupTextMembers({ commit }, payload) {
    Service.getAllGroupTextMembers(payload).then((res) => {
      if (res.status === 200) {
        commit('setGroupTextMembers', res.data)
      } else {
        commit('setGroupTextMembers', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setGroupTextMembers', null)
    })
  },
  getMessages({ commit }, payload) {
    Service.getMessages(payload).then((res) => {
      if (res.status === 200) {
        commit('setMessages', res.data)
      } else {
        commit('setMessages', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setMessages', null)
    })
  },
  getTasks({ commit }, payload) {
    Service.getTasks(payload).then((res) => {
      if (res.status === 200) {
        commit('setTasks', res.data)
      } else {
        commit('setTasks', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setTasks', null)
    })
  },
  getContacts({ commit }, payload) {
    const search = payload.search.length > 0 ? payload.search : null
    Service.searchContact(payload.userID, search).then((res) => {
      if (res.status === 200) {
        const sortedContacts = _.orderBy(res.data, ['firstName'], ['asc'])
        commit('setContacts', _.groupBy(sortedContacts, (item) => item.firstName.charAt(0)))
      } else {
        commit('setContacts', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setContacts', null)
    })
  },
  getNextStatus({ commit }, payload) {
    Service.getNextStatus(payload).then((res) => {
      if (res.status === 200) {
        commit('setNextStatus', res.data)
      } else {
        commit('setNextStatus', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setNextStatus', null)
    })
  },
  getSchedules({ commit }, payload) {
    Service.getSchedules(payload).then((res) => {
      if (res.status === 200) {
        const sortedSchedule = res.data.sort((a, b) => new Date(a.scheduledFrom) - new Date(b.scheduledFrom))
        commit('setSchedules', sortedSchedule)
      } else {
        commit('setSchedules', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setSchedules', null)
    })
  },
  getTodayDispatchScheduleEvent({ commit }, payload) {
    const today = moment().set('hour', 0).set('minute', 0).set('second', 0)
      .toISOString()
    const todayDate = moment().format(DateFormat)
    const timeline = {
      startDate: moment.utc(today).format(DateTimeFormat).replace(' ', 'T'),
      endDate: moment.utc(today).add(1, 'day').format(DateTimeFormat).replace(' ', 'T'),
    }

    Service.getTodayDispatchScheduleEvent(payload, timeline).then((res) => {
      if (res.status === 200) {
        const sortedTodaySchedule = res.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        const localTimezoneTodaySchedules = sortedTodaySchedule.map((d) => {
          const event = { ...d }
          const start = moment(d.startDate)
          const end = moment(d.endDate)
          const startTime = moment(d.startDate).format(TimeFormat)
          const duration = moment.duration(end.diff(start)).asMinutes()
          event.startDate = moment(`${todayDate} ${startTime}`).toISOString()
          event.endDate = moment(`${event.startDate}`).add(duration, 'minutes').toISOString()
          return event
        })
        commit('setTodaySchedules', localTimezoneTodaySchedules)
      } else {
        commit('setTodaySchedules', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setTodaySchedules', null)
    })
  },
  getAllStatus({ commit }, payload) {
    Service.getAllStatus(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllStatus', res.data)
      } else {
        commit('setAllStatus', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllStatus', null)
    })
  },
  getAllStatusMessages({ commit }, payload) {
    Service.getAllStatusMessages(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllStatusMessages', res.data)
      } else {
        commit('setAllStatusMessages', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllStatusMessages', null)
    })
  },
  getAllStatusCallbackMessages({ commit }, payload) {
    Service.getAllStatusCallbackMessages(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllStatusCallbackMessages', res.data)
      } else {
        commit('setAllStatusCallbackMessages', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllStatusCallbackMessages', null)
    })
  },

  getAllNotificationSetting({ commit }, payload) {
    Service.getAllNotificationSetting(payload).then((res) => {
      if (res.status === 200) {
        commit('setAllNotificationSetting', res.data)
      } else {
        commit('setAllNotificationSetting', null)
      }
    }).catch((err) => {
      console.log(err.messages)
      commit('setAllNotificationSetting', null)
    })
  },
}

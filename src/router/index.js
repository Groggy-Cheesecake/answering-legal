import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import ErrorPage from '../views/ErrorPage.vue'
import Home from '../views/home/index.vue'
import ScheduleIndex from '../views/schedules/index.vue'
import Schedule from '../views/schedules/Schedule.vue'
import Support from '../views/support/index.vue'
import Contacts from '../views/contacts/Contacts.vue'
import TaskIndex from '../views/task/index.vue'
import MessageIndex from '../views/messages/index.vue'
import MessageList from '../views/messages/MessageList.vue'
import MessageContent from '../views/messages/MessageContent.vue'
import Settings from '../views/settings/index.vue'
import ChangeLogs from '../views/changeLogs/index.vue'
import Profile from '../views/profile/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  }, {
    path: '/',
    component: Main,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Home,
      }, {
        path: 'tasks',
        name: 'tasks',
        component: TaskIndex,
      }, {
        path: 'schedules',
        component: ScheduleIndex,
        children: [
          {
            path: '',
            name: 'schedule',
            component: Schedule,
          }],
      }, {
        path: 'support',
        name: 'support',
        component: Support,
      }, {
        path: 'contacts',
        name: 'contacts',
        component: Contacts,
      }, {
        path: 'messages',
        component: MessageIndex,
        children: [
          {
            path: '',
            name: 'message',
            component: MessageList,
          }, {
            path: ':id',
            name: 'messageContent',
            component: MessageContent,
            props: true,
          }],
      }, {
        path: 'settings',
        name: 'settings',
        component: Settings,
      }, {
        path: 'logs',
        name: 'logs',
        component: ChangeLogs,
      }, {
        path: 'profile',
        name: 'profile',
        component: Profile,
      }, {
        path: '*',
        name: 'error',
        component: ErrorPage,
      }],
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
})

router.beforeEach(async (to, from, next) => {
  if (to.name === 'login') { // check if "to"-route is "callback" and allow access
    next()
  } else if (router.app.$auth.isAuthenticated()) {
    next()
  } else {
    router.app.$auth.login()
  }
})

export default router

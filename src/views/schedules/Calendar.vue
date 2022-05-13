<template>
  <FullCalendar
    class='calendar'
    ref="fullCalendar"
    defaultView="dayGridMonth"
    :header="header"
    :plugins="calendarPlugins"
    :weekends="calendarWeekends"
    :events="calendarEvents"
    :displayEventTime="false"
    :validRange="validRange"
    selectable="true"
    editable="true"
    @select="selectRange"
    @eventClick="clickEvent"
    @eventResize="changeEvent"
    @eventDrop="changeEvent"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import { mapGetters } from 'vuex'
import { DateFormat, DateTimeFormat } from '@/const'

export default {
  name: 'Calendar',
  components: { FullCalendar },
  data: (vm) => ({
    calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, rrulePlugin],
    calendarWeekends: true,
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay',
    },
    calendarEvents: [],
    validRange: {
      start: vm.$moment().format(DateFormat),
    },
    isShowAll: true,
  }),
  computed: {
    ...mapGetters(['auth', 'schedules']),
  },
  watch: {
    schedules: {
      handler() {
        this.setEvents()
      },
      deep: true,
    },
  },
  mounted() {
    this.setEvents()

    this.$root.$on('showAllEvents', (isAll) => {
      this.isShowAll = isAll
      this.setEvents()
    })
  },
  methods: {
    setEvents() {
      let { schedules } = this
      if (!this.isShowAll) {
        schedules = this.schedules.filter((d) => d.isDefaultStatus !== 1)
      }
      this.calendarEvents = schedules.map((d, i) => {
        const schedule = {}
        const rrule = d.repeatCode ? JSON.parse(d.repeatCode) : null
        const start = this.$moment(d.startDate)
        const end = this.$moment(d.endDate)

        schedule.title = `${d.statusName} ${this.$moment(d.startDate).format('hh:mm A')} ~ ${this.$moment(d.endDate).format('hh:mm A')}`
        schedule.groupId = `group ${i + 1}`
        schedule.color = d.isDefaultStatus === 1 ? '#103c65' : (d.dsid === 8 ? '#2699FB' : 'red')
        schedule.textColor = 'white'
        schedule.data = { ...d }
        schedule.editable = d.isDefaultStatus === 0

        if (rrule && rrule.FREQ) {
          const duration = this.$moment.duration(end.diff(start)).asMinutes()
          schedule.duration = `${parseInt(duration / 60, 10) > 10
            ? parseInt(duration / 60, 10)
            : `0${parseInt(duration / 60, 10)}`}:${duration % 60 > 10 ? duration % 60 : `0${duration % 60}`}`
          schedule.rrule = this.setRepeatEvent(rrule, d)
        } else {
          schedule.start = start.format(DateTimeFormat)
          schedule.end = end.format(DateTimeFormat)
        }
        return schedule
      })
    },
    setRepeatEvent(rruleObj, data) {
      return {
        freq: rruleObj.FREQ,
        byweekday: rruleObj.BYDAY || null,
        bysetpos: rruleObj.BYSETPOS || null,
        bymonth: parseInt(rruleObj.BYMONTH, 10) || null,
        bymonthday: parseInt(rruleObj.BYMONTHDAY, 10) || null,
        interval: 1,
        dtstart: this.$moment(data.startDate).format(DateTimeFormat),
        until: rruleObj.UNTIL ? this.$moment(rruleObj.UNTIL).format(DateTimeFormat) : null,
        count: rruleObj.COUNT ? parseInt(rruleObj.COUNT, 10) : null,
      }
    },
    selectRange(arg) {
      this.$emit('selectDate', arg, false)
    },
    clickEvent(arg) {
      if (arg.event.extendedProps.data.isDefaultStatus === 1) {
        this.$emit('selectDate', arg, true, false, true)
      } else {
        this.$emit('selectDate', arg, true)
      }
    },
    changeEvent(arg) {
      this.$emit('selectDate', arg, true, true)
    },
  },
}
</script>

<style lang='scss'>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';

.fc-button .fc-icon:before {
  vertical-align: initial;
}

.fc-button-group > .fc-button, .fc-today-button {
  text-transform: capitalize;
  color: white;
}

.fc-toolbar > * > :not(:first-child) {
  color: white;
}
</style>

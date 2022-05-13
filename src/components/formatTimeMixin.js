const formatMixin = {
  methods: {
    formatTime(time) {
      return this.$moment(time, ['hh:mm']).format('hh:mm A')
    },
  },
}

export default formatMixin

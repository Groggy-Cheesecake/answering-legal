<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <v-snackbar v-model="snackbar" :color="status" right :timeout="timeout" top>
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: (vm) => ({
    snackbar: false,
    text: '',
    status: 'error',
    timeout: 2000,
    newMessage: vm.$pnGetMessage('onMessage'),
  }),
  watch: {
    newMessage() {
      this.$root.$emit('getCounter')
      this.$root.$emit('getMessages')
    },
  },
  mounted() {
    this.$pnSubscribe({ channels: ['onMessage'] })

    this.$root.$on('snackbar', (status, msg) => {
      this.snackbar = true
      this.status = status
      this.text = msg
    })
  },
}
</script>

<style lang="scss">
@import "assets/scss/base.scss";

html {
  font-size: 14px !important;
}

.success .v-snack__content {
  background: $Success;
  border-radius: 4px;
}

.error .v-snack__content {
  background: $Danger;
  border-radius: 4px;
}

.v-snack__wrapper {
  min-height: 10px !important;
  border-radius: 8px;
}
</style>

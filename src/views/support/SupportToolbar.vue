<template>
  <v-toolbar dense class="primary text-white z-index-1 position-relative" extension-height="128">
    <v-toolbar-title class="m-auto d-flex justify-center">
      <v-icon left color="white">mdi-help-circle</v-icon>
      Support
    </v-toolbar-title>
    <template v-slot:extension>
      <v-row>
        <v-col cols="12" class="text-center pa-0">
          <v-divider color="white" class="mt-0" />
          <h6 class="mb-2">Have questions? Our team is here to help.</h6>
          <v-divider color="white" class="white mb-0" />
        </v-col>
        <v-col cols="12" class="text-center px-0 btn">
          <v-btn color="secondary" fab class="mx-4" outlined @click="goToFAQ">
            FAQ
          </v-btn>
          <v-btn color="secondary" class="mx-4" fab outlined @click="goToZendesk">
            <v-icon>mdi-tag-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-toolbar>
</template>

<script>
export default {
  name: 'SupportToolbar',
  methods: {
    goToFAQ() {
      window.open('https://www.answeringlegal.com/answering-legal-faq/', '_blank')
    },
    goToZendesk() {
      window.open('https://answeringlegalhelp.zendesk.com', '_blank')
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/variables";

.support .btn {
  background: $LightGray;
  border-radius: 0;
}

.support .btn button {
  background: white;
  border-color: $LightBlue !important;
}
</style>

<style>
.support .v-toolbar__extension {
  padding-left: 12px;
  padding-right: 12px;
}
</style>

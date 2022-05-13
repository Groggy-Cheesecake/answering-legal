<template>
  <v-form class="pa-0" ref="form">
    <v-row class="align-center" justify="center">
      <v-col cols="4" class="pb-0">
        <v-text-field v-model="member.name" label="Name" />
      </v-col>
      <v-col cols="4" class="pb-0">
        <v-text-field v-model="member.phone" label="Phone Number" :rules="required" />
      </v-col>
      <v-col cols="2" class="pb-0">
        <v-btn small icon :loading="loading" :disabled="loading" @click="update" color="primary" class="mx-1">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn small icon @click="cancel" class="mx-1">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Service from '../../service'

export default {
  name: 'GroupTextEdit',
  props: ['info'],
  data: () => ({
    isEditForm: false,
    loading: false,
    name: null,
    phone: null,
    member: {},
    required: [(v) => !!v || 'Phone Number is required'],
  }),
  watch: {
    info: {
      handler() {
        this.member = { ...this.info }
      },
      deep: true,
    },
  },
  mounted() {
    this.member = { ...this.info }
  },
  computed: {
    ...mapGetters(['auth', 'allGroupTextMembers']),
  },
  methods: {
    ...mapActions(['getAllGroupTextMembers']),
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = {
          name: this.member.name,
          phone: this.member.phone,
          groupTextID: this.member.id,
        }
        Service.editGroupTextMember(this.auth.userID, data).then((res) => {
          if (res.status === 200) {
            this.getAllGroupTextMembers(this.auth.userID)
          }
        }).finally(() => {
          this.loading = false
          this.cancel()
        })
      }
    },
    cancel() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>

</style>

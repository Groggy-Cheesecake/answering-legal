<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="ma-auto d-flex justify-center ml-6">
        Group Text Members
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon text small class="mx-0" @click="addMember">
        <v-icon color="white">mdi-account-multiple-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider class="ma-0"></v-divider>
    <v-card-text class="pa-0">
      <template v-if="isAddForm">
        <v-form ref="addFrom" class="pt-4 px-4">
          <v-row align="center">
            <v-col cols="12" class="pt-0 font-weight-bold text--primary">Create Group Text Member</v-col>
            <v-col cols="4" class="pt-0">
              <v-text-field label="Name" v-model="name" />
            </v-col>
            <v-col cols="4" class="pt-0">
              <v-text-field label="Phone Number" v-model="phone" :rules="required" type="number" maxlength="11" />
            </v-col>
            <v-col cols="4" class="text-right py-0">
              <v-btn @click="closeAddForm" class="mx-1">Cancel</v-btn>
              <v-btn :loading="loading" :disabled="loading" @click="add" color="primary" class="mx-1">
                <v-icon left>mdi-content-save</v-icon>
                Add
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-divider class="ma-0"></v-divider>
      </template>
      <v-list dense>
        <template v-for="(member, i) in allGroupTextMembers">
          <template :visible="!(isEdit && opened === i)">
            <v-list-item :key="`list_${i}`">
              <v-list-item-content>
                <v-list-item-title class="contact-title text-capitalize">
                  <h6>{{member.name}}</h6>
                </v-list-item-title>
                <v-list-item-subtitle class="text--primary">Phone: {{member.phone}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-row>
                  <v-col class="pa-0">
                    <v-btn small icon @click="editMember(member, i)">
                      <v-icon color="primary">mdi-account-edit</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="py-0">
                    <v-btn small icon @click="deleteMember(member)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </template>
          <template :visible="opened === i">
            <GroupTextEdit :key="`form_${i}`" :info="member" @close="closeEdit" v-if="opened === i" />
          </template>
          <v-divider :key="i" class="ma-0" v-if="i+1 < allGroupTextMembers.length"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Service from '../../service'
import GroupTextEdit from '../profile/GroupTextEdit.vue'

export default {
  name: 'GroupText',
  components: { GroupTextEdit },
  data: () => ({
    isAddForm: false,
    isEdit: false,
    loading: false,
    name: null,
    phone: null,
    opened: null,
    required: [(v) => !!v || 'Phone number is required'],
  }),
  computed: {
    ...mapGetters(['auth', 'allGroupTextMembers']),
  },
  methods: {
    ...mapActions(['getAllGroupTextMembers']),
    addMember() {
      this.name = null
      this.phone = null
      this.isAddForm = true
      this.isEdit = false
      this.opened = null
    },
    closeAddForm() {
      this.name = null
      this.phone = null
      this.isAddForm = false
      this.isEdit = false
      this.opened = null
    },
    add() {
      if (this.$refs.addFrom.validate()) {
        this.loading = true
        const data = {
          usersID: this.auth.userID,
          name: this.name,
          phone: this.phone,
        }
        Service.addGroupTextMember(data).then((res) => {
          if (res.status === 200) {
            this.getAllGroupTextMembers(this.auth.userID)
          }
          this.isAddForm = false
          this.loading = false
        })
      }
    },
    editMember(item, i) {
      this.isAddForm = false
      this.isEdit = true
      this.opened = i
    },
    closeEdit() {
      this.isEdit = false
      this.opened = null
    },
    deleteMember(item) {
      Service.deleteGroupTextMember(this.auth.userID, item.id).then((res) => {
        if (res.status === 200) {
          this.getAllGroupTextMembers(this.auth.userID)
        }
      })
    },
  },
}
</script>

<style scoped>
</style>

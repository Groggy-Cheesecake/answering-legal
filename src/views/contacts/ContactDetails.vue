<template>
  <v-card-text v-if="info" class="py-0">
    <v-list class="transparent">
      <v-list-item class="px-0">
        <v-btn x-small icon dark class="upload_contactAvatar primary position-absolute z-index-6" @click="clickAvatar" :loading="isAvatarLoading">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-list-item-avatar size="60" class="mr-3">
          <v-img :src="userAvatar" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ info.firstName }} {{ info.lastName }}</v-list-item-title>
          <v-list-item-subtitle>{{ info.address1 }} {{ info.address2 }} {{ info.city }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn color="secondary" @click="edit">
            <v-icon left>mdi-account-edit</v-icon>
            Edit
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-list class="transparent px-0 py-0">
      <v-list-item>
        <v-icon left large color="secondary">mdi-domain</v-icon>
        <v-list-item-content>
          <v-list-item-title class="primaryText font-weight-bold">{{ info.companyName }}</v-list-item-title>
          <v-list-item-subtitle>Company Name</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-icon left large color="secondary">mdi-cellphone-iphone</v-icon>
        <v-list-item-content>
          <v-list-item-title class="primaryText font-weight-bold">{{ info.cellPhone }}</v-list-item-title>
          <v-list-item-subtitle>Cell Phone</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-icon left large color="secondary">mdi-phone</v-icon>
        <v-list-item-content>
          <v-list-item-title class="primaryText font-weight-bold">{{ info.homePhone }}</v-list-item-title>
          <v-list-item-subtitle>Business Phone</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <ContactAddEditForm :isShow="isShow" @close="isShow = false" :newContact="null" :isEdit="isEdit" :isMessage="false" />
    <input type="file" accept="image/png, image/jpeg, image/bmp" class="d-none" ref="fileInput" @change="select">
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import ContactAddEditForm from '@/views/contacts/ContactAddEditForm.vue'
import Service from '../../service'

export default {
  name: 'ContactDetails',
  components: { ContactAddEditForm },
  props: ['info'],
  data: () => ({
    isShow: false,
    isEdit: true,
    isAvatarLoading: false,
  }),
  computed: {
    ...mapGetters(['auth', 'contact']),
    userAvatar: (vm) => `${vm.$imgLink}${vm.info.imageURL || vm.$avatar}`,
  },
  methods: {
    edit() {
      this.isShow = true
      this.isEdit = true
    },
    clickAvatar() {
      this.$refs.fileInput.click()
    },
    select(e) {
      const { files } = e.target
      if (files[0] !== undefined) {
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.uploadAvatar(files[0])
        })
      }
    },
    uploadAvatar(file) {
      this.isAvatarLoading = true
      Service.uploadContactAvatarImage(this.auth.userID, this.info.id, file).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setContact', Object.assign(this.info, { imageURL: res.data.imageUrl }))
          this.$root.$emit('getContacts')
        }
      }).finally(() => {
        this.isAvatarLoading = false
      })
    },
  },
}
</script>

<style scoped>
.upload_contactAvatar {
  bottom: 5px;
  left: 0;
}
</style>

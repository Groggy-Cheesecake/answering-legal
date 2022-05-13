<template>
  <v-card class="elevation-12 text-center">
    <v-card-text class="company_content position-relative" v-bind:style="{ 'background-image': `url(${companyImage})` }">
      <div class="position-relative py-4">
        <v-avatar size="120" class="border-white avatar">
          <v-img :src="userAvatar" />
        </v-avatar>
        <v-btn x-small fab dark class="upload_avatar" color="primary" @click="clickAvatar" :loading="isAvatarLoading">
          <v-icon>mdi-camera</v-icon>
        </v-btn>
      </div>
      <v-btn x-small fab dark class="upload_company_bg position-absolute" color="primary" @click="clickCompany" :loading="isCompanyLoading">
        <v-icon>mdi-camera</v-icon>
      </v-btn>
      <input type="file" accept="image/png, image/jpeg, image/bmp" class="d-none" ref="fileInput" @change="select">
    </v-card-text>
    <v-card-actions class="primary text-white">
      <v-card-text class="pa-0">
        <h5>{{ user.firstName }} {{ user.lastName }}</h5>
        <h6>{{ user.companyName }}</h6>
      </v-card-text>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'

export default {
  name: 'BannerCard',
  data: () => ({
    isAvatar: false,
    isAvatarLoading: false,
    isCompanyLoading: false,
  }),
  computed: {
    ...mapGetters(['user']),
    userAvatar: (vm) => vm.$imgLink + (vm.user.usersImageURL || vm.$avatar),
    companyImage: (vm) => vm.$imgLink + (vm.user.companyImageURL || vm.$company),
  },
  methods: {
    clickAvatar() {
      this.isAvatar = true
      this.$refs.fileInput.click()
    },
    clickCompany() {
      this.isAvatar = false
      this.$refs.fileInput.click()
    },
    select(e) {
      const { files } = e.target
      if (files[0] !== undefined) {
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          if (this.isAvatar) {
            this.uploadAvatar(files[0])
          } else {
            this.uploadCompany(files[0])
          }
        })
      }
    },
    uploadAvatar(file) {
      const that = this
      this.isAvatarLoading = true
      Service.uploadProfileImage(this.user.id, file).then((res) => {
        if (res.status === 200) {
          that.user.usersImageURL = res.data.imageUrl
          this.$store.commit('setUser', this.user)
          this.$root.$emit('snackbar', 'success', 'User Avatar Uploaded!')
        } else {
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      }).finally(() => {
        this.isAvatarLoading = false
      })
    },
    uploadCompany(file) {
      const that = this
      this.isCompanyLoading = true
      Service.uploadCompanyImage(this.user.id, file).then((res) => {
        if (res.status === 200) {
          that.user.companyImageURL = res.data.imageUrl
          this.$store.commit('setUser', this.user)
          this.$root.$emit('snackbar', 'success', 'User Company Image Uploaded!')
        } else {
          this.$root.$emit('snackbar', 'error', `${res.status} error`)
        }
      }).catch((err) => {
        this.$root.$emit('snackbar', 'error', err.message)
      }).finally(() => {
        this.isCompanyLoading = false
      })
    },
  },
}
</script>

<style scoped>
.avatar {
  border: .2rem solid;
}

.upload_avatar {
  position: absolute;
  bottom: 1rem;
  left: calc(50% + 1rem);
}

.company_content {
  min-height: 12rem;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.upload_company_bg {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>

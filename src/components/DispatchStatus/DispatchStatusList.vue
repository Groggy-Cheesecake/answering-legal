<template>
  <v-card>
    <v-toolbar dense class="primary text-white z-index-1 position-relative">
      <v-spacer />
      <v-toolbar-title class="m-auto d-flex justify-center ml-6">
        Change Current Status
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon text small class="mx-0" @click="close">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="py-4" v-if="allStatus">
      <v-col cols="12" class="pa-0 text-right">
        <v-btn class="secondary" @click="newStatus">
          <v-icon left>mdi-plus</v-icon>
          NEW STATUS TEMPLATE
        </v-btn>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-data-table :headers="headers" :items="allStatus" item-key="dsid" show-expand :expanded.sync="expanded" single-expand :items-per-page="5"
                      class="dispatchStatusTable" @click:row="updateSchedule">
          <template v-slot:item.iconURL="props">
            <v-avatar size="32" class="border-white avatar">
              <v-img :src="`${statusImage(props.item.takingCalls)}`" />
            </v-avatar>
          </template>
          <template v-slot:item.takingCalls="{item}">
            {{ item.takingCalls === 0 ? 'Not' : '' }}
            Taking Calls
          </template>
          <template v-slot:item.action="{item}">
            <v-btn small icon @click="editStatus(item)" v-if="item.dsid > 20">
              <v-icon small color="secondary">mdi-pencil</v-icon>
            </v-btn>
            <v-btn small icon @click="deleteStatus(item, true)" v-if="item.dsid > 20">
              <v-icon small color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers, item }" class="expanded">
            <td :colspan="headers.length">
              <v-card-text>
                <p><span class="font-weight-bold">Message: </span>{{ item.message }}</p>
                <p class="mb-0"><span class="font-weight-bold">Callback Message: </span>{{ item.callBackMessage }}</p>
              </v-card-text>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-card-text>
    <v-divider class="my-0" />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Service from '../../service'

export default {
  name: 'DispatchStatusList',
  props: ['isShow', 'isReload'],
  data: () => ({
    loading: false,
    headers: [
      {
        text: '',
        value: 'data-table-expand',
      }, {
        text: 'Status Name',
        value: 'statusName',
        class: 'text-nowrap',
      }, {
        text: 'Icon',
        value: 'iconURL',
        sortable: false,
        class: 'text-nowrap',
        align: 'center',
      }, {
        text: '',
        value: 'takingCalls',
        class: 'text-nowrap',
        align: 'left',
      }, {
        text: '',
        value: 'action',
        sortable: false,
        align: 'right',
      }],
    expanded: [],
    singleExpand: false,
    isDelete: false,
  }),
  computed: {
    ...mapGetters(['auth', 'allStatus']),
  },
  mounted() {
    if (this.isReload) {
      this.reloadData()
    }
  },
  methods: {
    reloadData() {
      this.loading = true
      Service.getAllStatus(this.auth.userID).then((res) => {
        if (res.status === 200) {
          this.$store.commit('setAllStatus', res.data)
        } else {
          this.$store.commit('setAllStatus', null)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    statusImage(val) {
      const icon = this.$statusIconList.filter((d) => d.id === val)
      return this.$imgLink + icon[0].iconURL
    },
    close() {
      this.$emit('close')
    },
    newStatus() {
      this.$emit('select', null, false)
    },
    editStatus(item) {
      this.$emit('select', item, true)
    },
    deleteStatus(item, isDelete) {
      this.isDelete = isDelete
      Service.deleteDispatchStatus(this.auth.userID, item.dsid.toString()).then((res) => {
        if (res.status === 200) {
          this.reloadData()
          this.$root.$emit('snackbar', 'success', `Deleted the "${item.statusName}"!`)
          this.isDelete = false
        }
      })
    },
    updateSchedule(item) {
      if (!this.isDelete) {
        this.$emit('updateSchedule', item)
      }
    },
  },
}
</script>

<style scoped>
.expanded {
  background: red;

}
</style>

<style>
.statusTab .card-header {
  border-bottom: 0 !important;
}

.statusTab .tab-content {
  display: none;
}

.dispatchStatusTable .v-data-table__expanded__content {
  box-shadow: none !important;
  background: transparent;
}

.dispatchStatusTable tr {
  cursor: pointer;
}
</style>

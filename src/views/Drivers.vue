<template>
  <v-app>
    <v-table>
      <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index" class="text-center">
          {{ header.text }}
        </th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="driver in driverData"
        :key="driver.id"
      >
        <td class="text-center">{{ driver?.profile.name }}</td>
        <td class="text-center">
          <v-img
            class="bg-white"
            height="100"
            :aspect-ratio="1"
            :src="store.getSupabaseStorageUrl('drivers') + driver?.driverPhoto"
          ></v-img>
        </td>
        <td class="text-center">{{ driver?.licenseNumber }}</td>
        <td class="text-center">
          <v-img
            class="bg-white"
            height="100"
            :aspect-ratio="1"
            :src="store.getSupabaseStorageUrl('licenses') + driver?.licensePhoto"
          ></v-img>
        </td>
        <td class="text-center">
          <v-select
            v-model="driver.verifyStatus"
            :items="verifyStatusSelections"
            item-title="text"
            item-value="value"
            :bg-color="getVerifyStatusColor(driver.verifyStatus)"
            @update:model-value="updateDriver(driver)"
          ></v-select>
        </td>
      </tr>
      </tbody>
    </v-table>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { verifyStatusSelections, getVerifyStatusColor } from '@/configs/main-configs'
import socket from '@/services/socket-io'

const store = useAppStore()

const groupBy = [
  {
    key: 'passenger',
    order: 'asc'
  }
]

const headers = [
  { text: 'Driver Name', value: 'user.name' },
  { text: 'Profile Photo', value: 'profile_photo' },
  { text: 'License Number', value: 'license_number' },
  { text: 'License Photo', value: 'license_photo' },
  { text: 'Status', value: 'status' },
  // { text: 'Actions', value: 'action' },
]

const driverData = ref<any[]>([] as any[])

onMounted(() => {
  getDrivers()
})

function getDrivers() {
  socket.emit('adminGetDrivers', null, (data: any) => {
    console.log('adminGetDrivers', data)

    driverData.value = data.drivers
  })
}

function updateDriver(driver: any) {
  console.log(driver)

  socket.emit('adminUpdateDriver', { driver }, (data: any) => {
    console.log('adminUpdateDriver', data)

    driverData.value = data.drivers
  })
}

</script>

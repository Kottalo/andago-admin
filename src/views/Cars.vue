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
        v-for="car in carData"
        :key="car.id"
      >
        <td class="text-center">{{ car.plateNumber }}</td>
        <td class="text-center">{{ car.passenger.profile.name }}</td>
        <td class="text-center">
          <v-img
            class="bg-white"
            height="100"
            :aspect-ratio="1"
            :src="storageUrl + '/vehicles/' + car.carPhoto"
          ></v-img>
        </td>
        <td class="text-center">
          <v-select
            v-model="car.status"
            :items="carStatuses"
            item-title="text"
            item-value="value"
            @update:model-value="updateCar(car)"
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
import socket from '@/services/socket-io';

const store = useAppStore()

const storageUrl = import.meta.env.VITE_STORAGE_URL

const groupBy = [
  {
    key: 'passenger',
    order: 'asc'
  }
]

const headers = [
  { text: 'Car Number', value: 'plate_number' },
  { text: 'Passenger', value: 'passenger.user.name' },
  { text: 'Car Photo', value: 'vehicle_photo' },
  { text: 'Status', value: 'status' },
  // { text: 'Actions', value: 'action' },
]

const carData = ref<any[]>([] as any[])

const carStatuses = [
  {
    text: 'Pending',
    value: 'PENDING',
  },
  {
    text: 'Verified',
    value: 'VERIFIED',
  },
  {
    text: 'Rejected',
    value: 'REJECTED',
  },
]

onMounted(() => {
  getCars()
})

function getCars() {
  socket.emit('adminGetCars', null, (data: any) => {
    console.log(data)

    carData.value = data.cars
  })
}

function updateCar(vehicle: any) {
  
}

</script>

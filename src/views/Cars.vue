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
        <td class="text-center">{{ car.passenger.profile.name }}</td>
        <td class="text-center">{{ car.plateNumber }}</td>
        <td class="text-center">
          <v-img
            class="bg-white"
            height="100"
            :aspect-ratio="1"
            :src="store.getSupabaseStorageUrl(`cars/${car.carPhoto}`)"
          ></v-img>
        </td>
        <td class="text-center">
          <v-select
            v-model="car.verifyStatus"
            :items="verifyStatusSelections"
            item-title="text"
            item-value="value"
            :bg-color="getVerifyStatusColor(car.verifyStatus)"
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
import socket from '@/services/socket-io'
import { supabase } from '@/services/supabase'
import { verifyStatusSelections, getVerifyStatusColor } from '@/configs/main-configs'
import { get } from 'http'

const store = useAppStore()

const headers = [
  { text: 'Passenger' },
  { text: 'Car Number' },
  { text: 'Car Photo' },
  { text: 'Status' },
]

const carData = ref<any[]>([] as any[])

onMounted(() => {
  getCars()
})

function getCars() {
  socket.emit('adminGetCars', null, (data: any) => {
    console.log('adminGetCars', data)

    carData.value = data.cars
  })
}

function updateCar(car: any) {
  console.log(car)

  socket.emit('adminUpdateCar', { car }, (data: any) => {
    console.log('adminUpdateCar', data)

    carData.value = data.cars
  })
}

</script>

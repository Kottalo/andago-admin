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
        v-for="trip in tripData"
        :key="trip.id"
      >
        <td class="text-center pa-3">
          3 Points <v-btn color="primary" @click="store.viewTripPoints(trip?.points)">View</v-btn>
        </td>
        <td class="text-center">{{ trip?.passenger?.profile?.name }}</td>
        <td class="text-center">{{ trip?.driver?.profile?.name }}</td>
        <td class="text-center">{{ trip?.passenger?.selectedVehicle?.plate_number }}</td>
        <td class="text-center">{{ trip?.fareAmountText }}</td>
        <td class="text-center">
          <v-chip :color="trip?.tripStatus == 'COMPLETED' ? 'success' : 'grey'">
            {{ trip?.tripStatus }}
          </v-chip>
        </td>
      </tr>
      </tbody>
    </v-table>

    <TripPointsViewer></TripPointsViewer>
  </v-app>
</template>
  
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useAppStore } from '@/store/app'
  import TripPointsViewer from '@/components/TripPointsViewer.vue';
  import socket from '@/services/socket-io'
  
  const store = useAppStore()
  
  const storageUrl = import.meta.env.VITE_STORAGE_URL
  
  const groupBy = [
    {
      key: 'passenger',
      order: 'asc'
    }
  ]
  
  const headers = [
    { text: 'Points', },
    { text: 'Passenger Name'},
    { text: 'Driver Name'},
    { text: 'Car'},
    { text: 'Fare Amount'},
    { text: 'Status'},
  ]
  
  const tripData = ref<any[]>([] as any[])
  
  onMounted(() => {
    getTrips()
  })
  
  function getTrips() {
    socket.emit('adminGetTripHistory', null, (data: any) => {
      console.log(data)

      tripData.value = data.trips
    })
  }
</script>
  
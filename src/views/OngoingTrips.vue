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
        <td class="text-center">
          {{ statuses[trip?.status] }}
        </td>
        <td class="text-center">
          <v-btn
            color="primary"
            @click="viewTripStatus(trip)"
          >
            <v-chip color="success">
              {{ getTripStatusText(trip?.status) }}
            </v-chip>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>

    <TripProgressMapViewer></TripProgressMapViewer>

    <TripPointsViewer></TripPointsViewer>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store/app'
import TripProgressMapViewer from "@/components/TripProgressMapViewer.vue"
import TripPointsViewer from '@/components/TripPointsViewer.vue'
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
  { text: 'Passenger Name', value: 'passenger.user.name' },
  { text: 'Driver Name', value: 'driver.user.name' },
  { text: 'Car', value: 'passenger.selectedVehicle.plate_number' },
  { text: 'Status', value: 'status' },
]

const tripData = ref<any[]>([] as any[])

const statuses = {
  accepted: 'Heading to Pickup',
  arrived: 'Waiting for Passenger',
  started: 'Heading to Destination',
} as any

onMounted(() => {
  getTrips()
})

function getTrips() {
  socket.emit('getOngoingTrips', null, (data: any) => {
    tripData.value = data.trips
  })
}

function getTripStatusText(status: string) {
  switch (status) {
    case 'ACCEPTED':
      return 'Heading to Pickup'
    case 'ARRIVED':
      return 'Waiting for Passenger'
    case 'STARTED':
      return 'Heading to Destination'
    default:
      return status
  }
}

function viewTripStatus(trip: any) {
  store.viewingTrip = trip
  store.tripProgressMapViewerOpen = true
}
</script>

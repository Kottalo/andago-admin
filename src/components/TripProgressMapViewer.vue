<template>
    <v-dialog
      v-model="store.tripProgressMapViewerOpen"
      fullscreen
    >
      <v-card>
        <v-toolbar
          color="primary"
          title="Ongoing Trips"
        ></v-toolbar>
        <v-card-text>
          <div id="map"></div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            @click="close"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useAppStore } from "@/store/app";
import mapLoader from "@/services/google-maps";
import carImageUrl from "@/assets/flat_icons/car.png";
import socket from '@/services/socket-io';

const store = useAppStore()

const isOpen = ref(store.tripProgressMapViewerOpen)

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

const currentTrip = ref(null as any)
const googleMap = ref(null as any)
const driverMarker = ref(null as any)
const pickupMarker = ref(null as any)
const dropoffMarker = ref(null as any)
const bounds = ref(null as any)

function close()
{
  store.viewingTrip = null
  store.tripProgressMapViewerOpen = false
}

function getTrip()
{
  const data = {
    tripId: store.viewingTrip?.id
  }

  store.axios
    .post(`/adminGetOngoingTrip`, data)
    .then((response) => {
      store.viewingTrip = response.data

      updateMap()

    })
    .catch((error) => {
      console.log(error)
    })

    socket.emit('adminGetOngoingTrip', data, (data: any) => {
      console.log('adminGetOngoingTrip', data)

      store.viewingTrip = data.viewingTrip

      updateMap()
    })
}

function updateMap()
{
  currentTrip.value = store.viewingTrip

  const driver = currentTrip.value?.driver
  const pickupPlace = currentTrip.value?.points[0]?.place
  const dropoffPlace = currentTrip.value?.points[currentTrip.value?.points.length - 1]?.place

  const driverCoordinate =  { lat: driver?.latitude, lng: driver?.longitude}
  const pickupCoordinate = { lat: pickupPlace?.latitude, lng: pickupPlace?.longitude}
  const dropoffCoordinate = { lat: dropoffPlace?.latitude, lng: dropoffPlace?.longitude}

  driverMarker.value.setPosition(driverCoordinate)
  pickupMarker.value.setPosition(pickupCoordinate)
  dropoffMarker.value.setPosition(dropoffCoordinate)

  bounds.value.extend(driverCoordinate);
  bounds.value.extend(pickupCoordinate);
  bounds.value.extend(dropoffCoordinate);

  // Apply the bounds to the map
  googleMap.value.fitBounds(bounds.value);
}

watch(() => store.tripProgressMapViewerOpen, (newVal) => {
  if (newVal) {
    // The dialog has been opened. Initialize the map here.
    loadMap()
  }
})

watch(
  () => currentTrip.value,
  (newVal, oldValue) => {
    if (oldValue == null) {
      loadMap()
    }
  }
)

function loadMap()
{
  mapLoader
    .load()
    .then(async (google: any) => {
      googleMap.value = new google.maps.Map(document.getElementById("map"), mapOptions)

      const driverIcon = {
        url: carImageUrl,
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25)
      }

      const trip = store.viewingTrip

      const driver = trip.value?.driver
      const pickupPlace = trip.value?.points[0]?.place
      const dropoffPlace = trip.value?.points[currentTrip.value?.points.length - 1]?.place

      const driverCoordinate =  { lat: driver?.latitude, lng: driver?.longitude}
      const pickupCoordinate = { lat: pickupPlace?.latitude, lng: pickupPlace?.longitude}
      const dropoffCoordinate = { lat: dropoffPlace?.latitude, lng: dropoffPlace?.longitude}

      
      driverMarker.value = new google.maps.Marker({
        map: googleMap.value,
        icon: driverIcon,
        position: driverCoordinate
      })
      pickupMarker.value = new google.maps.Marker({
        map: googleMap.value,
        position: pickupCoordinate,
      })
      dropoffMarker.value = new google.maps.Marker({
        map: googleMap.value,
        position: dropoffCoordinate,
      })

      bounds.value = new google.maps.LatLngBounds()

      const pickupInfoWindow = new google.maps.InfoWindow({ content: "Pickup" });
      const dropoffInfoWindow = new google.maps.InfoWindow({ content: "Dropoff" });

      // Add click event listeners to each marker to open the info window
      pickupInfoWindow.open(googleMap.value, pickupMarker.value)
      dropoffInfoWindow.open(googleMap.value, dropoffMarker.value)

      updateMap()
    })
    .catch(e => {
      // do something
    })
}

onMounted(async () => {
  setInterval(() => {
    if (store.viewingTrip)
    {
      getTrip()
    }
  }, 5000)
})
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}

.v-dialog {
  min-height: 80% !important;
  max-height: 80% !important;
  min-width: 80% !important;
  max-width: 80% !important;
}
</style>

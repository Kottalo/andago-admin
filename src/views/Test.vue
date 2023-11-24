<template>
  <v-app>
    <v-btn @click="createTrip">
      Create Trip
    </v-btn>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { supabase } from '@/services/supabase'
import socket from '@/services/socket-io';

onMounted(async () => {
  console.log(await supabase.auth.getUser())
})

function createTrip() {
  socket.emit('createTrip', {
    points: [
        {
            place_id: 'ChIJW6IeoW9LzDERRhh2kBCUJaE',
            description: 'IOI Mall Puchong, Jalan Puchong, Bandar Puchong Jaya, Puchong, Selangor, Malaysia',
            lat: 3.0463256,
            lng: 101.6183585,
        },
        {
            place_id: 'ChIJ1WK28udKzDERlczc3oAKZCQ',
            description: 'Pavilion Bukit Jalil, Persiaran Jalil 8, Bukit Jalil, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia',
            lat: 3.0502354,
            lng: 101.670963,
        },
    ]
  })
}
</script>

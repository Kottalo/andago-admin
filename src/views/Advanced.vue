<template>
  <v-app class="pa-8">
    <v-btn @click="processPayrolls" color="primary">
      Process Payrolls
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

function processPayrolls() {
  socket.emit('adminProcessPayrolls', null, (data: any) => {
    if (data.success) {
      alert('Payrolls processed successfully')
    } else {
      alert('Payrolls processing failed')
    }
  })
}
</script>

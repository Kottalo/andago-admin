<template>
  <v-app>
    
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { supabase } from '@/services/supabase'

onMounted(async () => {
  console.log(await supabase.auth.getUser())
})
</script>

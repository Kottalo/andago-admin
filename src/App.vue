<template>
  <router-view />

  <v-snackbar
    v-model="store.snackbar.show"
    :color="store.snackbar.color"
    :timeout="store.snackbar.timeout"
  >
    {{ store.snackbar.message }}

    <template v-slot:actions>
      <v-btn
        color="pink"
        variant="text"
        @click="store.snackbar.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const store = useAppStore()

</script>

<template>
  <v-dialog
    v-model="store.tripPointsViewerOpen"
    max-width="600"
  >
    <v-card>
      <v-toolbar
        color="primary"
        title="Trip Points"
      ></v-toolbar>
      <v-card-text>
        <v-timeline side="end" align="start">
          <v-timeline-item
            v-for="(point, pointIndex) in store.tripPoints"
            :key="pointIndex"
            :dot-color="setDotColor(pointIndex)"
            size="small"
          >
            <v-card
              class="mx-auto"
              max-width="344"
              variant="elevated"
            >
              <v-card-item>
                <div>
                  <div class="text-h6 mb-1">
                    Point {{ pointIndex + 1 }}
                  </div>
                  <div class="text-caption">{{ point?.place?.description }}</div>
                </div>
              </v-card-item>

              <v-card-actions>
                <v-chip
                  class="ma-2"
                  :color="point?.arrivedAt ? 'success' : 'grey'"
                  variant="outlined"
                >
                  <v-icon start :icon="point?.arrivedAt ? 'mdi-car-outline' : 'mdi-car-off'"></v-icon>
                  {{ point?.arrivedAt ? 'Arrived at' : 'Not Arrived' }} {{ point?.arrivedAt ? DateTime.fromISO(point?.arrivedAt).toFormat('yyyy-MM-dd h:mm:ss a') : '' }}
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="text"
          @click="store.tripPointsViewerOpen = false"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app'
import { DateTime } from 'luxon'

const store = useAppStore()

function setDotColor(pointIndex: number) {
  if (pointIndex == 0) {
    return 'teal-lighten-3'
  } else if (pointIndex == store.tripPoints.length - 1) {
    return 'pink'
  } else {
    return 'blue-lighten-3'
  }
}
</script>
<template>
  <v-app>
    <v-container class="d-flex justify-center">
      <div style="width: 300px;">
        <v-form v-model="valid">
          <v-text-field prepend-icon="mdi-account-credit-card" label="Min Topup Amount" v-model="config.minTopupAmount_rm" prefix="RM" validate-on="input"></v-text-field>
          <v-text-field prepend-icon="mdi-car" label="Min Fare"  v-model="config.baseFare_rm" prefix="RM"></v-text-field>
          <v-text-field prepend-icon="mdi-map-marker-distance" label="Per KM Rate (RM)" v-model="config.perKilometerRate_rm" prefix="RM" suffix="per km"></v-text-field>
          <v-text-field prepend-icon="mdi-clock-time-three-outline" label="Per Minute Rate (RM)" v-model="config.perMinuteRate_rm" prefix="RM" suffix="per min"></v-text-field>
          <v-text-field prepend-icon="mdi-alarm" label="Free Wait Time (min)" v-model="config.freeWaitTime_min" suffix="min"></v-text-field>
          <v-text-field prepend-icon="mdi-cash-clock" label="Wait Time Fee (RM)" v-model="config.waitTimeFeePerMinute_rm" prefix="RM" suffix="per min"></v-text-field>
          <v-text-field prepend-icon="mdi-percent" label="Driver Commission (%)" v-model="config.driverCommissionRate" suffix="%"></v-text-field>
        </v-form>
      </div>
    </v-container>
    <v-container v-if="configChanged" class="d-flex align-end flex-column position-fixed pa-5" style="width: 160px;right: 0px">
      <v-btn block prepend-icon="mdi-check-circle" class="ma-2" color="primary" @click="updateConfig">Update</v-btn>
      <v-btn block prepend-icon="mdi-trash-can-outline" class="ma-2" color="secondary" @click="cancelChange">Cancel</v-btn>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive, computed, watch} from 'vue'
import { useAppStore } from "@/store/app"
import socket from '@/services/socket-io';

const store = useAppStore()

const valid = ref(true)

const originalConfig = reactive({})

const config = reactive({
  minTopupAmount_rm: 0,
  baseFare_rm: 0,
  perKilometerRate_rm: 0,
  perMinuteRate_rm: 0,
  freeWaitTime_min: 0,
  waitTimeFeePerMinute_rm: 0,
  driverCommissionRate: 0,
})

const configChanged = computed(() => {
  return JSON.stringify(config) !== JSON.stringify(originalConfig)
})

onMounted(() => {
  copyReactive(originalConfig, config)
  getConfig()
})

function setConfig(configData: any)
{
  for (let key in originalConfig) {
    copyReactive(originalConfig, configData)
    copyReactive(config, configData)
  }
}

function getConfig()
{
  socket.emit('adminGetConfig', null, (data: { config: any }) => {
    const configData = data.config

    console.log(configData)

    setConfig(configData)
  })
}

function updateConfig()
{
  console.log('adminUpdateConfig', config)

  socket.emit('adminUpdateConfig', { config }, (data: { config: any }) => {
    const configData = data.config

    setConfig(configData)
  })
}

function copyReactive(copyTo: any, copyFrom: any)
{
  for (let key in copyFrom) {
    copyTo[key] = copyFrom[key]
  }
}

function cancelChange()
{
  copyReactive(config, originalConfig)
}
</script>

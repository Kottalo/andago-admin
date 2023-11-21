<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from './store/app';
import {onMounted} from "vue";

const store = useAppStore()
</script>

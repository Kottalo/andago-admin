<template>
  <v-dialog
    v-model="store.approvePayrollDialogOpen"
    max-width="600"
  >
    <v-card>
      <v-toolbar
        color="primary"
        title="Approve Payroll"
      ></v-toolbar>
      <v-card-text>
        <v-file-input
          v-model="receiptFile"
          :rules="rules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Upload receipt"
          prepend-icon="mdi-camera"
          label="Receipt"
          @update:model-value="previewImage"
        ></v-file-input>

        <v-img
          v-if="imagePreview"
          :src="imagePreview"
          width="100%"
          height="100%"
          contain
        ></v-img>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          color="pink"
          variant="text"
          @click="submit"
        >
          Submit
        </v-btn>

        <v-btn
          variant="text"
          @click="store.approvePayrollDialogOpen = false"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/store/app'
import axios from 'axios';
const store = useAppStore()

const receiptFile = ref<File[]>()
const imagePreview = ref<string | null>(null)

const rules = [
  (value: any) => {
    return !value || !value.length || ['image/png', 'image/jpeg', 'image/bmp'].includes(value[0].type) || 'File should be an image!'
  },
]

function previewImage(event: any) {
  console.log(event)

  if (receiptFile.value) {
    const reader = new FileReader()

    reader.onload = (loadEvent) => {
      imagePreview.value = loadEvent.target?.result as string
    }

    reader.readAsDataURL(receiptFile.value[0]);
  } else {
    imagePreview.value = null;
  }
}

function submit() {
  console.log('submit', receiptFile.value)

  store.showSnackbar('Test')
  
  if (receiptFile.value) {
    const formData = new FormData()

    formData.append('receiptFile', receiptFile.value[0])
    formData.append('payrollId', store.selectedPayrollId.toString())

    axios.post(`${import.meta.env.VITE_SERVER_URL}/approvePayroll`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      console.log('response', response)

      store.showSnackbar(response.data.message)

      store.approvePayrollDialogOpen = false
    }).catch((error) => {
      console.log('error', error)
    })
  }
}
</script>
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
        v-for="payroll in payrollData"
        :key="payroll.id"
      >
        <td class="text-center">{{ payroll.referenceId }}</td>
        <td class="text-center">{{ payroll.createdAt }}</td>
        <td class="text-center">{{ payroll.driver.profile.name }}</td>
        <td class="text-center">
          <v-chip :color="getPayrollStatusColor(payroll.payrollStatus)">
            {{ payroll.payrollStatus }}
          </v-chip>
        </td>
        <td class="text-center">
          <v-btn color="primary" @click="store.selectedPayrollId = payroll.id;store.approvePayrollDialogOpen = true">
            Approve
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>

    <ApprovePayrollDialog></ApprovePayrollDialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store/app'
import socket from '@/services/socket-io'
import ApprovePayrollDialog from '@/components/ApprovePayrollDialog.vue'

const store = useAppStore()

const headers = [
  { text: 'Reference Number' },
  { text: 'Date' },
  { text: 'Driver Name' },
  { text: 'Status' },
  { text: 'Approve' },
]

const payrollStatuses = [
  {
    text: 'Pending',
    value: 'PENDING',
  },
  {
    text: 'Verified',
    value: 'VERIFIED',
  },
  {
    text: 'Rejected',
    value: 'REJECTED',
  },
]

const payrollData = ref<any[]>([] as any[])

onMounted(() => {
  getPayrolls()
})

function getPayrolls() {
  socket.emit('adminGetPayrolls', null, (data: any) => {
    console.log('adminGetPayrolls', data)

    payrollData.value = data.payrolls
  })
}

function getPayrollStatusColor(verifyStatus: string) {
  switch (verifyStatus) {
    case 'PENDING':
      return 'white'
    case 'REQUESTED':
      return 'grey'
    case 'PAID':
      return 'success'
  }
}

</script>

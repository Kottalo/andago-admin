// Utilities
import { defineStore } from 'pinia'
import axios from "axios"
import { supabase } from '@/services/supabase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL+'/admins',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export const useAppStore = defineStore('app', {
  state: () => ({
    tripProgressMapViewerOpen: false,
    tripPointsViewerOpen: false,
    approvePayrollDialogOpen: false,
    selectedPayrollId: 0,
    viewingTrip: null as any,
    tripPoints: [] as any,
    snackbar: {
      show: false,
      message: '',
      timeout: 1000,
      color: 'dark',
    },
  }),
  getters: {
    async supabaseToken() {
      const session = await supabase.auth.getSession()

      return session.data?.session?.access_token
    },
    async supabaseUser() {
      return await supabase.auth.getUser()
    },
    axios() {
      axiosInstance.defaults.headers['Accept'] = 'application/json'
      // axiosInstance.defaults.headers['Authorization'] = `Bearer ${this.loginState.accessToken}`
      // axiosInstance.defaults.headers['Id-Token'] = this.loginState.idToken

      return axiosInstance;
    }
  },
  actions: {
    viewTripPoints(points: any[]) {
      this.tripPoints = points
      this.tripPointsViewerOpen = true
    },
    getSupabaseStorageUrl(filePath: string) {
      return supabase.storage.from('main-bucket').getPublicUrl(filePath).data.publicUrl
    },
    showSnackbar(message: string, timeout: number = 1000, color: string = 'dark') {
      this.snackbar.message = message
      this.snackbar.timeout = timeout
      this.snackbar.color = color
      this.snackbar.show = true
    }
  },
  persist: {
    enabled: true,
  },
})

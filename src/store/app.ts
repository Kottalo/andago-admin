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
});

export const useAppStore = defineStore('app', {
  state: () => ({
    tripProgressMapViewerOpen: false,
    viewingTrip: null as any,
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

  },
  persist: {
    enabled: true,
  },
})

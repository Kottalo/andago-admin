import io from 'socket.io-client'
import { useAppStore } from '@/store/app'

const store = useAppStore()

const socket = io(import.meta.env.VITE_SERVER_URL)

export default socket
import io from 'socket.io-client'
import { useAppStore } from '@/store/app'

const store = useAppStore()

const socket = io(import.meta.env.VITE_SERVER_URL)

socket.auth = {
    token: await store.supabaseToken,
}

socket.connect()

socket.on('connection', (socket) => console.log(socket.id))

export default socket
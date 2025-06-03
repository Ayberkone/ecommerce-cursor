// /utils/socket.ts
import { io as clientIo } from "socket.io-client"

export const socket = clientIo(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
  withCredentials: true,
  transports: ["websocket"]
})

import Wsocket from "@/utils/Wsocket"
import tool from '@/utils/tool'

class Message {

  ws

  timer = null

  interval = 10 * 1000

  constructor() {
    this.ws = new Wsocket(
      import.meta.env.VITE_APP_WS_URL + '?token=' + tool.local.get('token'), {
        onOpen:  _ => { console.log('已成功连接到消息服务器...') },
        onError: _ => {
          this.ws = undefined
          console.log('未成功连接到消息服务器...')
        },
        onClose: _ => {
          this.ws = undefined
          console.log('与消息服务器断开...')
        },
      }
    )
    
    this.ws.heartbeat.openHeartbeat = false
  }

  getMessage() {
    this.timer = setInterval(() => {
      this.ws && this.ws.send({ event: 'get_unread_message' })
    }, this.interval)
  }

  connection() {
    this.ws.connection()
  }

}

export default Message
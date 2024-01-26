import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  interface msgType {
    id: number
    msg: string
    type: string
    visible: boolean
  }
  const msgs = ref<Array<msgType>>([])
  const counter = ref<number>(0)

  /**
   * This will create a new message, add to the msgs array,
   * show, hide (time can be changed) and destroy
   */
  const openToast = (msg: string, type: string, time = 4000): void => {
    // Create the message
    const id = counter.value
    const newMessage: msgType = { id, msg, type, visible: false }
    msgs.value.push(newMessage)

    // Show the message
    setTimeout(
      (id: number) => {
        msgs.value.forEach((msg) => {
          if (msg.id === id) msg.visible = true
        })
      },
      0,
      counter.value
    )
    // Hide the message
    setTimeout(
      (id: number) => {
        msgs.value.forEach((msg) => {
          if (msg.id === id) msg.visible = false
        })
      },
      time,
      counter.value
    )
    // Remove the message
    setTimeout(
      (id: number) => {
        msgs.value = msgs.value.filter((msg) => msg.id !== id)
      },
      time + 300,
      counter.value
    )

    counter.value++

    toConsole(msg, type)
  }

  /**
   * Keep the change in the browser console too, as this is a demo app and
   * it will help drawing a clear pic if what is happening.
   */
  const toConsole = (msg: string, type: string) => {
    switch (type) {
      case 'success':
        console.log(`%cSUCCESS%c ${msg}`, 'background:lightgreen; padding:5px', 'padding:5px')
        break
      case 'info':
        console.log(`%cINFO%c ${msg}`, 'background:cyan; padding:5px', 'padding:5px')
        break
      case 'warning':
        console.log(`%cWARNING%c ${msg}`, 'background:orange; padding:5px', 'padding:5px')
        break
      case 'error':
        console.log(`%cERROR%c ${msg}`, 'background:red; padding:5px', 'padding:5px')
        break
    }
  }

  return { msgs, openToast }
})

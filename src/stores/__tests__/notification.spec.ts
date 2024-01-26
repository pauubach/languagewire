import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { useNotificationStore } from '../notification'

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

describe('Notification store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Has no messages on first load', () => {
    const store = useNotificationStore()
    const { msgs } = storeToRefs(store)
    expect(msgs.value).not.toBeNull()
    expect(msgs.value).toHaveLength(0)
  })

  it('Messages are created and destroyed', async () => {
    const store = useNotificationStore()
    const { msgs } = storeToRefs(store)
    for (let i = 0; i < 8; i++) {
      store.openToast(`Test ${i}`, i % 2 ? 'success' : 'info', 1000)
    }
    expect(msgs.value).toHaveLength(8)
    await delay(1500)
    expect(msgs.value).toHaveLength(0)
  })
})

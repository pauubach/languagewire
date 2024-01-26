import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { useNotificationStore } from '../notification'

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

describe('Notification store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Notification store first load', () => {
    const store = useNotificationStore()
    const { msgs } = storeToRefs(store)
    expect(msgs.value).not.toBeNull()
    expect(msgs.value).toHaveLength(0)
  })

  it('Notification creation and destruction', async () => {
    const store = useNotificationStore()
    const { msgs } = storeToRefs(store)
    for (let i = 0; i < 4; i++) {
      store.openToast('Test', 'success', 1000)
    }
    expect(msgs.value).toHaveLength(4)
    await delay(1500)
    expect(msgs.value).toHaveLength(0)
  })
})

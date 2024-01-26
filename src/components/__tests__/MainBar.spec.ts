import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import MainBar from '../MainBar.vue'

describe('MainBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('Mounts properly', () => {
    const wrapper = mount(MainBar)
    expect(wrapper).toBeTruthy()
    expect(wrapper.find('img')).toBeTruthy()
    expect(wrapper.find('LanguageSelector')).toBeTruthy()
    expect(wrapper.find('button')).toBeTruthy()
  })
})

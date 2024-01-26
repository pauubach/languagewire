import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import router from '../../router'
import { beforeEach, describe, it, expect } from 'vitest'
import LanguageSelector from '../LanguageSelector.vue'

describe('Selector', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('Mounts properly', () => {
    const wrapper = mount(LanguageSelector)
    expect(wrapper).toBeTruthy()
    expect(wrapper.find('LanguageSelect')).toBeTruthy()
    expect(wrapper.findAll('button')).toHaveLength(2)
  })
})

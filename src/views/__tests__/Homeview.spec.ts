import { beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { useTranslationStore } from '@/stores/translation'
import { useNotificationStore } from '@/stores/notification'

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('Mounts properly', () => {
    const wrapper = mount(HomeView)
    expect(wrapper).toBeTruthy()
  })

  it('No languages loaded at start', () => {
    const store = useTranslationStore()
    const { languages, source, target } = storeToRefs(store)
    expect(languages.value).toHaveLength(0)
    expect(source.value).toBe(null)
    expect(target.value).toBe(null)
  })

  it('No translations loaded at start', () => {
    const store = useTranslationStore()
    const { translations } = storeToRefs(store)
    expect(translations.value).toHaveLength(0)
  })

  it('Load translations and check textareas', () => {
    let wrapper = mount(HomeView)
    let textareas = wrapper.findAll('textarea')
    const store = useTranslationStore()
    const { languages, source, target } = storeToRefs(store)
    expect(textareas).toHaveLength(0)
    store.changeLanguages()
    wrapper = mount(HomeView)
    textareas = wrapper.findAll('textarea')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('en-GB')
    expect(target.value).toBe('es-ES')
    expect(textareas).toHaveLength(16)
  })

  it('Load empty translations and check textareas', () => {
    let wrapper = mount(HomeView)
    let textareas = wrapper.findAll('textarea')
    const translationStore = useTranslationStore()
    const notificationStore = useNotificationStore()
    const { languages, source, target } = storeToRefs(translationStore)
    expect(textareas).toHaveLength(0)
    expect(notificationStore.msgs).toHaveLength(0)
    translationStore.changeLanguages('en-GB', 'pt-PT')
    expect(notificationStore.msgs).toHaveLength(1)
    wrapper = mount(HomeView)
    textareas = wrapper.findAll('textarea')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('en-GB')
    expect(target.value).toBe('pt-PT')
    expect(textareas).toHaveLength(0)
  })
})

import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { useTranslationStore } from '../translation'
import router from '../../router'

describe('Translation store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Languages load', () => {
    const store = useTranslationStore()
    const { languages, source, target } = storeToRefs(store)
    expect(languages.value).toHaveLength(0)
    store.getLanguages()
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('en-GB')
    expect(target.value).toBe('es-ES')
  })

  it('Navigation loads languages and translations', async () => {
    const store = useTranslationStore()
    const { languages, translations, source, target } = storeToRefs(store)

    await router.push('/')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('en-GB')
    expect(target.value).toBe('es-ES')

    expect(translations.value).not.toHaveLength(0)
  })

  it('Custom navigation language load', async () => {
    const store = useTranslationStore()
    const { languages, translations, source, target } = storeToRefs(store)

    // Valid
    await router.push('/en-GB/es-ES')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('en-GB')
    expect(target.value).toBe('es-ES')
    expect(translations.value).not.toHaveLength(0)

    // Empty (Portuguese)
    await router.push('/es-ES/pt-PT')
    expect(languages.value).not.toHaveLength(0)
    expect(source.value).toBe('es-ES')
    expect(target.value).toBe('pt-PT')
    expect(translations.value).toHaveLength(0)

    // Invalid (Same source and target)
    await router.push('/es-ES/es-ES')
    expect(languages.value).not.toHaveLength(0)
    expect(source.value).toBe('es-ES')
    expect(target.value).toBe('es-ES')
    expect(translations.value).toHaveLength(0)

    // Valid
    await router.push('/es-ES/en-GB')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('es-ES')
    expect(target.value).toBe('en-GB')
    expect(translations.value).not.toHaveLength(0)

    // Should keep last language combination (default was en-GB - es-ES)
    await router.push('/')
    expect(languages.value).toHaveLength(3)
    expect(source.value).toBe('es-ES')
    expect(target.value).toBe('en-GB')
    expect(translations.value).not.toHaveLength(0)
  })
})

import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api/api'
import { useNotificationStore } from '@/stores/notification'

export const useTranslationStore = defineStore('translation', () => {
  interface Language {
    tag: string
    name: string
  }

  /**
   * dirty will control if a text has changed to avoid sending EVERYTHING to the server.
   * It would be much better to control if text is different from original, keeping a copy,
   * but I'm not going to split hairs.
   */
  interface Text {
    id: number
    language: string
    text: string
    dirty: boolean
  }

  interface TextCollection {
    id: number
    texts: Array<Text>
  }

  const languages = ref<Array<Language>>([])
  const translations = ref<Array<TextCollection>>([])

  const source = ref<string | null>(null)
  const target = ref<string | null>(null)

  const { openToast } = useNotificationStore()

  /**
   * Changes source and target languages.
   * If languages haven't yet been loaded call getLanguages.
   *
   * If newSource and newTarget are defined, assign to source and target.
   * Otherwise source and target won't be changed.
   *
   * Load translation memories.
   */

  const changeLanguages = (newSource?: string, newTarget?: string): void => {
    if (languages.value.length === 0) {
      getLanguages()
    }

    if (newSource && newTarget) {
      source.value = newSource
      target.value = newTarget
    }

    const result = api.get(`/translation-memories/${source.value}/${target.value}`)

    if (result?.status === 200) {
      translations.value = <Array<TextCollection>>result.data
    } else {
      translations.value = []
      openToast(result?.message ?? 'Error loading the languages', 'error')
    }
  }

  /**
   * Get languages. If there's not source or target, set the first possible combination.
   */
  const getLanguages = (): void => {
    const result = api.get('/languages')
    if (result?.status === 200) {
      languages.value = <Array<Language>>result.data
      if (!source.value || !target.value) {
        if (!source.value) {
          source.value = languages.value?.find((lang) => lang.tag != target.value)?.tag ?? null
        }
        if (!target.value) {
          target.value = languages.value?.find((lang) => lang.tag != source.value)?.tag ?? null
        }
      }
    } else {
      openToast(result?.message ?? 'Error loading the languages', 'error')
    }
  }

  /**
   * Send translations.
   * Create an array with changed texts using dirty property.
   *
   * In a real environment I should have a registry of original and
   * updated texts to compare instead of using dirty.
   *
   * Send the changes (if exist) and get success or error messages.
   */
  const sendTranslations = (): void => {
    if (translations.value) {
      const textsToSend: Array<{
        id: number
        updatedText: string
      }> = []
      translations.value.forEach((page) => {
        page.texts.forEach((text) => {
          if (text.dirty) {
            const textToSend = toRaw(text)
            textsToSend.push({ id: textToSend.id, updatedText: textToSend.text })
          }
        })
      })
      if (textsToSend.length) {
        const result = api.put('/translation-memories/', { texts: textsToSend })

        if (result?.status === 204) {
          openToast('Changes saved', 'success')
        } else {
          openToast(result?.message ?? 'Error saving changes', 'error')
        }
      } else {
        openToast('There are no changes to send', 'warning')
      }
    }
  }

  return {
    source,
    target,
    languages,
    translations,
    getLanguages,
    changeLanguages,
    sendTranslations
  }
})

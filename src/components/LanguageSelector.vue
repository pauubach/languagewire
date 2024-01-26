<script setup lang="ts">
/**
 * Language menu.
 * Instead of having a select with language for source and target, I preferred to pack them in a menu.
 * Languages don't change on selecting. Clicking apply is required. This will normally save a get call
 * to the server, as both languages are sent at same time instead of sending a request each time a
 * language is changed.
 *
 * There's also a switch button to allow a faster change in case we just want to swap target and source.
 */

import { type Ref, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTranslationStore } from '@/stores/translation'
import { useNotificationStore } from '@/stores/notification'
import LanguageSelect from '@/components/LanguageSelect.vue'

const router = useRouter()

const { openToast } = useNotificationStore()

const translationStore = useTranslationStore()
const { source, target, languages } = storeToRefs(translationStore)

/**
 * Control if menu or selectors are opened and language selected values.
 * Selected values for source and target aren't the real ones,
 * those are the values picked in the selects and their value won't override
 * real source and target values until Apply button is clicked.
 */
const selectorOpened = ref<boolean>(false)
const sourceSelectorOpened = ref<boolean>(false)
const sourceSelected = ref<string | null>(source.value)
const targetSelectorOpened = ref<boolean>(false)
const targetSelected = ref<string | null>(target.value)

// Disable buttons if target and source have same language selected.
const btnDisabled = computed(() => {
  return (
    !sourceSelected.value || !targetSelected.value || targetSelected.value == sourceSelected.value
  )
})

// Close menu and selects if there's a click outside.
const listener = (event: Event) => {
  const closer = (opened: Ref<boolean>, opener: string, element: string) => {
    if (opened.value) {
      if (
        !document.getElementById(element)?.contains(event.target as Node) &&
        !document.getElementById(opener)?.contains(event.target as Node)
      ) {
        opened.value = false
      }
    }
  }
  closer(selectorOpened, 'languageSelectorOpener', 'languageSelector')
  closer(sourceSelectorOpened, 'sourceSelectorOpener', 'sourceSelector')
  closer(targetSelectorOpened, 'targetSelectorOpener', 'targetSelector')
}

onMounted(() => {
  window.addEventListener('click', listener)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', listener)
})

// Check languages values
watch(source, () => {
  sourceSelected.value = source.value
})
watch(target, () => {
  targetSelected.value = target.value
})

/**
 * Apply change. Uses router to load the same page with different params.
 * This will change languages automagically.
 */
const changeLanguage = () => {
  if (btnDisabled.value) {
    openToast('Please select different languages.', 'error')
  } else {
    router.push(`/${sourceSelected.value}/${targetSelected.value}`)
  }
  selectorOpened.value = false
}

// Swap languages, the fast way
const switchLanguages = () => {
  const med = targetSelected.value
  targetSelected.value = sourceSelected.value
  sourceSelected.value = med
}
</script>

<template>
  <div class="relative">
    <a
      id="languageSelectorOpener"
      href="#"
      class="flex items-center sm:w-64 m-auto justify-center"
      @click="selectorOpened = !selectorOpened"
    >
      <div class="flex items-center">
        <img class="h-8" :src="`/flags/${source}.png`" />
        <img class="h-4 mx-2" src="/images/right-arrow.svg?url" />
        <img class="h-8" :src="`/flags/${target}.png`" />
      </div>
    </a>
    <div
      id="languageSelector"
      class="absolute px-4 py-2 z-10 font-normal bg-white rounded-lg shadow w-full sm:w-full dark:bg-gray-700"
      :class="{ hidden: !selectorOpened }"
    >
      <LanguageSelect
        :value="sourceSelected"
        :languages="languages"
        id="source"
        :opened="sourceSelectorOpened"
        @open="sourceSelectorOpened = true"
        @close="sourceSelectorOpened = false"
        @changeLanguage="(value: string) => (sourceSelected = value)"
      />
      <LanguageSelect
        :value="targetSelected"
        :languages="languages"
        id="target"
        :opened="targetSelectorOpened"
        @open="targetSelectorOpened = true"
        @close="targetSelectorOpened = false"
        @changeLanguage="(value: string) => (targetSelected = value)"
      />
      <div class="flex justify-between mt-4">
        <button class="btn-outline" :disabled="btnDisabled" @click="switchLanguages">Switch</button>
        <button class="btn-primary" :disabled="btnDisabled" @click="changeLanguage">Apply</button>
      </div>
    </div>
  </div>
</template>

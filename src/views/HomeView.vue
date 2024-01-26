<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTranslationStore } from '@/stores/translation'
import { autoTextarea } from '@/directives/autoTextarea'

const translationStore = useTranslationStore()
const { translations } = storeToRefs(translationStore)

const textRefs = ref<Array<HTMLInputElement>>([])

// Loading the custom directive locally
const vAutoTextarea = autoTextarea

/**
 * True when the element is source, false if target.
 * It's used to show the textarea in the right or left side.
 */
const isFirst = (translation: { id: number; language: string; text: string }) =>
  translationStore.source?.startsWith(translation.language)
</script>

<template>
  <div class="container py-8 h-full overflow-y-auto">
    <div
      :id="`translation-${translation.id}`"
      v-for="translation in translations"
      :key="translation.id"
      class="page-box"
    >
      <textarea
        :id="`text-${translation.texts[0].id}`"
        ref="textRefs"
        class="text-box"
        :class="isFirst(translation.texts[0]) ? 'text-box-first' : 'text-box-last'"
        :readonly="isFirst(translation.texts[0])"
        v-model="translation.texts[0].text"
        @change="translation.texts[0].dirty = true"
        v-auto-textarea
      ></textarea>
      <textarea
        :id="`text-${translation.texts[1].id}`"
        ref="textRefs"
        class="text-box"
        :class="isFirst(translation.texts[1]) ? 'text-box-first' : 'text-box-last'"
        :readonly="isFirst(translation.texts[1])"
        v-model="translation.texts[1].text"
        @change="translation.texts[1].dirty = true"
        v-auto-textarea
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: calc(100vh - 48px);
}
</style>

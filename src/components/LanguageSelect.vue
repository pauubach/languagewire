<script setup lang="ts">
/**
 * Selects are a bit tricky. I didn't want to use the standard ones.
 * I wanted them to have a Search (although we only have 3 languages)
 * I wanted to include the flag in the Search field, when a language has
 * been selected.
 * Options have also flag, language name and the tag.
 */
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['open', 'close', 'changeLanguage'])

const props = defineProps<{
  id: string
  value: string | null
  languages: Array<{
    tag: string
    name: string
  }>
  opened: Boolean
}>()

// Option selected
const selected = ref<string | null>(props.value)
// Input text for filtering
const text = ref<string>('')
// Label contains Target or Source language, or the picture and name of the selected language
const label = computed(() =>
  selected.value && !props.opened && document.activeElement?.id !== `${props.id}SelectorOpener`
    ? props.languages?.find((lang) => lang.tag == selected.value)?.name
    : `${props.id.charAt(0).toUpperCase() + props.id.slice(1)} language`
)

// Filters laguages by tag and name. Case insensitive.
const getLanguages = computed(() =>
  props.languages?.filter(
    (language: { tag: string; name: string }) =>
      language.tag.toLowerCase().includes(text.value.toLowerCase()) ||
      language.name.toLowerCase().includes(text.value.toLowerCase())
  )
)

watch(
  () => props.value,
  () => {
    selected.value = props.value
  }
)

const keynav = (event: KeyboardEvent) => {
  const key = event.code
  if (key == 'Enter') {
    if (getLanguages.value.length == 1) {
      // If filtering results have only one language select this one.
      selected.value = getLanguages.value[0].tag
    }
    ;(document.querySelector(':focus') as HTMLElement)?.blur()
    emit('close')
    emit('changeLanguage', selected.value)
    text.value = ''
    return
  }
  if (key == 'ArrowUp' || key == 'ArrowDown') {
    const increment = key == 'ArrowDown' ? 1 : -1
    let index = getLanguages.value.findIndex((lang) => lang.tag == selected.value)
    if (index !== -1) {
      // If the language selected is found in the results move up or down
      index = (index + increment + getLanguages.value.length) % getLanguages.value.length
      selected.value = getLanguages.value[index].tag
    } else {
      // If the language isn't in the results select the first one
      selected.value = getLanguages.value[0].tag
    }
  }
}
</script>

<template>
  <div class="w-full" @keydown="keynav">
    <div>
      <div class="relative z-0">
        <input
          :id="`${id}SelectorOpener`"
          v-model="text"
          type="text"
          class="input peer truncate dark:text-gray-50"
          placeholder=" "
          autocomplete="off"
          @focus="$emit('open')"
          @focusout="text = ''"
        />
        <label
          :for="`${id}SelectorOpener`"
          :class="{ 'label-with-icon': selected, 'black-label': selected }"
          class="label"
        >
          {{ label }}
        </label>
        <label :for="`${id}SelectorOpener`" class="icon-flag" v-if="selected">
          <img :src="`/flags/${selected}.png`" />
        </label>
      </div>
    </div>
    <div :id="`${id}Selector`" class="flex flex-col items-center relative">
      <Transition>
        <div
          v-if="opened"
          class="absolute shadow bg-white top-100 z-40 w-full lef-0 rounded-b-md overflow-y-auto overflow-x-hidden"
        >
          <div class="flex flex-col w-full">
            <div
              v-for="language in getLanguages"
              :key="language.tag"
              class="cursor-pointer w-full border-gray-100 border-b hover:bg-orange-100 focus:bg-orange-100"
              :class="{ 'bg-orange-100': language.tag == selected }"
              @click="
                (selected = language.tag),
                  $emit('close'),
                  $emit('changeLanguage', selected),
                  (text = '')
              "
            >
              <div class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
                <div class="w-6 flex flex-col items-center">
                  <div class="flex relative w-6 justify-center items-center m-1 mr-2 h-4 mt-1">
                    <img alt="flag" :src="`/flags/${language.tag}.png`" />
                  </div>
                </div>
                <div class="w-11/12 items-center flex">
                  <div class="mx-2 -mt-1 text-sm truncate">
                    {{ language.name }}
                    <div
                      class="text-xs truncate w-full normal-case font-normal -mt-1 text-gray-400"
                    >
                      {{ language.tag }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.2s ease;
  transform-origin: 50% 0 0;
}

.v-enter-from,
.v-leave-to {
  transform: scaleY(0);
}
</style>

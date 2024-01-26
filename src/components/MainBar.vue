<script setup lang="ts">
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useTranslationStore } from '@/stores/translation'

const sendTranslations = useTranslationStore().sendTranslations
</script>

<template>
  <nav class="relative bg-white dark:bg-zinc-500 shadow h-12 items-center">
    <div class="container h-full">
      <div class="flex justify-between sm:grid sm:grid-cols-3 h-full items-center">
        <div class="">
          <img src="/src/assets/logo-large.png" class="h-6 lg:h-8 hidden sm:block" />
          <img src="/src/assets/logo.png" class="h-8 sm:hidden" />
        </div>
        <div class="justify-self-center grow"><LanguageSelector /></div>
        <button class="btn-primary ml-auto" @click="sendTranslations">Update</button>
      </div>
    </div>
  </nav>
</template>

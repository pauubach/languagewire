<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainBar from './components/MainBar.vue'
import NotifyToast from './components/NotifyToast.vue'
</script>

<template>
  <NotifyToast />
  <header class="sticky top-0">
    <MainBar />
  </header>

  <RouterView />
</template>

<style scoped></style>

<script setup lang="ts">
/**
 * Notification component. Shows messages (success/info/warning/error) in notificationStore.
 * Try clicking many times Update to see how messages are stacked.
 */
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import IconSuccess from '@/assets/icons/success.svg'
import IconInfo from '@/assets/icons/info.svg'
import IconWarning from '@/assets/icons/warning.svg'
import IconError from '@/assets/icons/error.svg'

const notificationStore = useNotificationStore()
const { msgs } = storeToRefs(notificationStore)
</script>

<template>
  <div class="fixed right-0 top-10 justify-items-end z-50">
    <div v-for="msg in msgs" :key="msg.id">
      <Transition>
        <div
          v-if="msg.visible"
          class="notification-msg"
          :class="{
            'bg-green-50 border-green-500': msg.type === 'success',
            'bg-blue-50 border-blue-500': msg.type === 'info',
            'bg-amber-50 border-amber-500': msg.type === 'warning',
            'bg-red-50 border-red-500': msg.type === 'error'
          }"
        >
          <div
            class="text-white rounded-full mr-3"
            :class="{
              'bg-green-500': msg.type === 'success',
              'bg-blue-500': msg.type === 'info',
              'bg-amber-500': msg.type === 'warning',
              'bg-red-500': msg.type === 'error'
            }"
          >
            <IconSuccess class="text-white" v-show="msg.type == 'success'"></IconSuccess>
            <IconInfo class="text-white" v-show="msg.type == 'info'"></IconInfo>
            <IconWarning class="text-white" v-show="msg.type == 'warning'"></IconWarning>
            <IconError class="text-white" v-show="msg.type == 'error'"></IconError>
          </div>
          <div class="text-black max-w-xs text-sm" v-html="msg.msg" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: right 1.2s ease;
}

.v-enter-from,
.v-leave-to {
  right: -100vw;
}
</style>

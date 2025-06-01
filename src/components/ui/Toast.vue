<template>
  <Teleport to="body">
    <div 
      :class="[
        'toast',
        toast.type,
        { 'show': toast.show }
      ]"
    >
      {{ toast.message }}
    </div>
  </Teleport>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const uiStore = useUIStore()
const { toast } = storeToRefs(uiStore)
</script> 
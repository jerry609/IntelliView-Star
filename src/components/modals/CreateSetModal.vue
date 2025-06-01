<template>
  <Teleport to="body">
    <div 
      v-if="modals.createSet"
      class="modal-overlay active"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <h3 class="text-xl font-semibold text-primary mb-4">创建新练习集</h3>
        
        <input 
          v-model="setName"
          type="text" 
          class="w-full p-2 input-bg border rounded-md mb-4 placeholder-dynamic" 
          placeholder="请输入练习集名称"
          @keyup.enter="createSet"
          ref="nameInput"
        >
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeModal"
            class="button-secondary py-2 px-4 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="createSet"
            class="button-primary py-2 px-4 rounded-md text-sm"
            :disabled="!setName.trim()"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useQuestionsStore } from '@/stores/questions'
import { storeToRefs } from 'pinia'

const uiStore = useUIStore()
const questionsStore = useQuestionsStore()

const { modals } = storeToRefs(uiStore)
const setName = ref('')
const nameInput = ref(null)

// Focus input when modal opens
watch(() => modals.value.createSet, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      nameInput.value?.focus()
    })
  } else {
    setName.value = ''
  }
})

const closeModal = () => {
  uiStore.closeModal('createSet')
}

const createSet = () => {
  if (!setName.value.trim()) {
    uiStore.showToast('请输入练习集名称。', 'error')
    return
  }
  
  questionsStore.createCustomSet(setName.value.trim())
  uiStore.showToast(`练习集 "${setName.value}" 已创建!`, 'success')
  closeModal()
}
</script> 
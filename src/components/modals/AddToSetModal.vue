<template>
  <Teleport to="body">
    <div 
      v-if="modals.addToSet"
      class="modal-overlay active"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <h3 class="text-xl font-semibold text-primary mb-4">添加到练习集</h3>
        
        <p class="text-sm text-secondary mb-1">选择要添加到的练习集:</p>
        
        <select 
          v-model="selectedSetId"
          class="w-full p-2 input-bg border rounded-md mb-4"
        >
          <option value="">请选择练习集</option>
          <option 
            v-for="set in customPracticeSets" 
            :key="set.id" 
            :value="set.id"
          >
            {{ set.name }} ({{ set.questionIds.length }}题)
          </option>
        </select>
        
        <p class="text-xs text-tertiary mb-3">
          没有合适的练习集？请先在"我的练习集"中创建。
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeModal"
            class="button-secondary py-2 px-4 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="addToSet"
            class="button-primary py-2 px-4 rounded-md text-sm"
            :disabled="!selectedSetId"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useQuestionsStore } from '@/stores/questions'
import { storeToRefs } from 'pinia'

const uiStore = useUIStore()
const questionsStore = useQuestionsStore()

const { modals, questionToAddToSet } = storeToRefs(uiStore)
const { customPracticeSets } = storeToRefs(questionsStore)

const selectedSetId = ref('')

// Reset selection when modal opens
watch(() => modals.value.addToSet, (isOpen) => {
  if (!isOpen) {
    selectedSetId.value = ''
  }
})

const closeModal = () => {
  uiStore.closeAddToSetModal()
}

const addToSet = () => {
  if (!selectedSetId.value || !questionToAddToSet.value) {
    uiStore.showToast('请选择练习集。', 'error')
    return
  }
  
  const success = questionsStore.addQuestionToSet(selectedSetId.value, questionToAddToSet.value)
  const set = customPracticeSets.value.find(s => s.id === selectedSetId.value)
  
  if (success) {
    uiStore.showToast(`题目已添加到练习集 "${set?.name}"。`, 'success')
  } else {
    uiStore.showToast(`题目已存在于练习集 "${set?.name}" 中。`, 'warning')
  }
  
  closeModal()
}
</script> 
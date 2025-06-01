import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Toast state
  const toast = ref({
    show: false,
    message: '',
    type: 'success' // 'success', 'error', 'warning'
  })

  // Modal state
  const modals = ref({
    createSet: false,
    addToSet: false
  })

  const questionToAddToSet = ref(null)

  // Toast actions
  const showToast = (message, type = 'success') => {
    toast.value = {
      show: true,
      message,
      type
    }
    
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  const hideToast = () => {
    toast.value.show = false
  }

  // Modal actions
  const openModal = (modalName) => {
    modals.value[modalName] = true
  }

  const closeModal = (modalName) => {
    modals.value[modalName] = false
  }

  const openAddToSetModal = (questionId) => {
    questionToAddToSet.value = questionId
    openModal('addToSet')
  }

  const closeAddToSetModal = () => {
    questionToAddToSet.value = null
    closeModal('addToSet')
  }

  return {
    // State
    toast,
    modals,
    questionToAddToSet,
    
    // Actions
    showToast,
    hideToast,
    openModal,
    closeModal,
    openAddToSetModal,
    closeAddToSetModal
  }
}) 
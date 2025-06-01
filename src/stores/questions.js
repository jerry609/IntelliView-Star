import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockQuestions } from '@/utils/mockData'

export const useQuestionsStore = defineStore('questions', () => {
  // State
  const allQuestions = ref([])
  const favoriteQuestionIds = ref([])
  const mistakeLogEntries = ref([])
  const customPracticeSets = ref([])
  const currentQuestionListView = ref('all')
  const filters = ref({
    category: '',
    difficulty: ''
  })

  // Getters
  const categories = computed(() => {
    return [...new Set(allQuestions.value.map(cat => cat.category))]
  })

  const filteredQuestions = computed(() => {
    let result = allQuestions.value

    if (currentQuestionListView.value === 'favorites') {
      result = allQuestions.value.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => favoriteQuestionIds.value.includes(q.id))
      })).filter(cat => cat.questions.length > 0)
    } else if (currentQuestionListView.value === 'mistakes') {
      result = allQuestions.value.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          mistakeLogEntries.value.some(entry => entry.questionId === q.id)
        )
      })).filter(cat => cat.questions.length > 0)
    } else if (currentQuestionListView.value.startsWith('set_')) {
      const setId = currentQuestionListView.value.split('_')[1]
      const set = customPracticeSets.value.find(s => s.id === setId)
      if (set) {
        result = allQuestions.value.map(cat => ({
          ...cat,
          questions: cat.questions.filter(q => set.questionIds.includes(q.id))
        })).filter(cat => cat.questions.length > 0)
      } else {
        result = []
      }
    }

    // Apply filters for 'all' view
    if (currentQuestionListView.value === 'all') {
      if (filters.value.category) {
        result = result.filter(cat => cat.category === filters.value.category)
      }
      if (filters.value.difficulty) {
        result = result.map(cat => ({
          ...cat,
          questions: cat.questions.filter(q => q.difficulty === filters.value.difficulty)
        })).filter(cat => cat.questions.length > 0)
      }
    }

    return result
  })

  const questionById = computed(() => {
    return (id) => {
      for (const category of allQuestions.value) {
        const question = category.questions.find(q => q.id === id)
        if (question) {
          return { ...question, category: category.category }
        }
      }
      return null
    }
  })

  const favoritesCount = computed(() => favoriteQuestionIds.value.length)
  const mistakesCount = computed(() => mistakeLogEntries.value.length)
  const customSetsCount = computed(() => customPracticeSets.value.length)

  // Actions
  const generateQuestions = async (resumeFile, jobDescription) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    allQuestions.value = generateMockQuestions()
  }

  const toggleFavorite = (questionId) => {
    const index = favoriteQuestionIds.value.indexOf(questionId)
    if (index > -1) {
      favoriteQuestionIds.value.splice(index, 1)
      return false // removed
    } else {
      favoriteQuestionIds.value.push(questionId)
      return true // added
    }
  }

  const addMistake = (questionId, userAnswer, score, feedback, category) => {
    const existingIndex = mistakeLogEntries.value.findIndex(entry => entry.questionId === questionId)
    const mistakeEntry = {
      questionId,
      userAnswer,
      score,
      feedback,
      timestamp: new Date().toISOString(),
      category
    }

    if (existingIndex > -1) {
      mistakeLogEntries.value[existingIndex] = mistakeEntry
    } else {
      mistakeLogEntries.value.push(mistakeEntry)
    }
  }

  const removeMistake = (questionId) => {
    const index = mistakeLogEntries.value.findIndex(entry => entry.questionId === questionId)
    if (index > -1) {
      mistakeLogEntries.value.splice(index, 1)
    }
  }

  const createCustomSet = (name) => {
    const newSet = {
      id: `set_${Date.now()}`,
      name,
      questionIds: []
    }
    customPracticeSets.value.push(newSet)
    return newSet
  }

  const deleteCustomSet = (setId) => {
    const index = customPracticeSets.value.findIndex(set => set.id === setId)
    if (index > -1) {
      customPracticeSets.value.splice(index, 1)
    }
  }

  const addQuestionToSet = (setId, questionId) => {
    const set = customPracticeSets.value.find(s => s.id === setId)
    if (set && !set.questionIds.includes(questionId)) {
      set.questionIds.push(questionId)
      return true
    }
    return false
  }

  const setCurrentView = (view) => {
    currentQuestionListView.value = view
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = { category: '', difficulty: '' }
  }

  return {
    // State
    allQuestions,
    favoriteQuestionIds,
    mistakeLogEntries,
    customPracticeSets,
    currentQuestionListView,
    filters,
    
    // Getters
    categories,
    filteredQuestions,
    questionById,
    favoritesCount,
    mistakesCount,
    customSetsCount,
    
    // Actions
    generateQuestions,
    toggleFavorite,
    addMistake,
    removeMistake,
    createCustomSet,
    deleteCustomSet,
    addQuestionToSet,
    setCurrentView,
    setFilters,
    resetFilters
  }
}) 
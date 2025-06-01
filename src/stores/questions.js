import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useUIStore } from './ui'

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
  const isLoading = ref(false)

  // UI Store
  const uiStore = useUIStore()

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
    try {
      isLoading.value = true
      const response = await api.questions.generate(resumeFile, jobDescription)
      
      if (response.success) {
        allQuestions.value = response.data
        uiStore.showToast('题目生成成功！', 'success')
      } else {
        throw new Error(response.message || '题目生成失败')
      }
    } catch (error) {
      console.error('Generate questions error:', error)
      uiStore.showToast(error.message || '题目生成失败，请重试', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadQuestions = async (filters = {}) => {
    try {
      isLoading.value = true
      const response = await api.questions.getList(filters)
      
      if (response.success) {
        allQuestions.value = response.data
      } else {
        throw new Error(response.message || '获取题目失败')
      }
    } catch (error) {
      console.error('Load questions error:', error)
      uiStore.showToast(error.message || '获取题目失败', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = async (questionId) => {
    try {
      const isFavorited = favoriteQuestionIds.value.includes(questionId)
      
      if (isFavorited) {
        const response = await api.user.favorites.remove(questionId)
        if (response.success) {
          favoriteQuestionIds.value = favoriteQuestionIds.value.filter(id => id !== questionId)
          uiStore.showToast('已取消收藏', 'success')
          return false
        }
      } else {
        const response = await api.user.favorites.add(questionId)
        if (response.success) {
          favoriteQuestionIds.value.push(questionId)
          uiStore.showToast('已添加收藏！', 'success')
          return true
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error)
      uiStore.showToast('操作失败，请重试', 'error')
      return favoriteQuestionIds.value.includes(questionId)
    }
  }

  const addMistake = async (questionId, userAnswer, score, feedback, category) => {
    try {
      const mistakeData = {
        questionId,
        userAnswer,
        score,
        feedback,
        timestamp: new Date().toISOString(),
        category
      }

      const response = await api.user.mistakes.add(mistakeData)
      if (response.success) {
        const existingIndex = mistakeLogEntries.value.findIndex(entry => entry.questionId === questionId)
        if (existingIndex > -1) {
          mistakeLogEntries.value[existingIndex] = mistakeData
        } else {
          mistakeLogEntries.value.push(mistakeData)
        }
        uiStore.showToast('已加入错题本', 'warning')
      }
    } catch (error) {
      console.error('Add mistake error:', error)
      uiStore.showToast('错题记录失败', 'error')
    }
  }

  const removeMistake = async (questionId) => {
    try {
      const response = await api.user.mistakes.markMastered(questionId)
      if (response.success) {
        mistakeLogEntries.value = mistakeLogEntries.value.filter(entry => entry.questionId !== questionId)
        uiStore.showToast('已标记为掌握！', 'success')
      }
    } catch (error) {
      console.error('Remove mistake error:', error)
      uiStore.showToast('操作失败，请重试', 'error')
    }
  }

  const createCustomSet = async (name) => {
    try {
      const response = await api.user.practiceSets.create(name)
      if (response.success) {
        customPracticeSets.value.push(response.data)
        uiStore.showToast(`练习集 "${name}" 已创建！`, 'success')
        return response.data
      }
    } catch (error) {
      console.error('Create custom set error:', error)
      uiStore.showToast('创建练习集失败', 'error')
      throw error
    }
  }

  const deleteCustomSet = async (setId) => {
    try {
      const response = await api.user.practiceSets.delete(setId)
      if (response.success) {
        customPracticeSets.value = customPracticeSets.value.filter(set => set.id !== setId)
        uiStore.showToast('练习集已删除', 'success')
      }
    } catch (error) {
      console.error('Delete custom set error:', error)
      uiStore.showToast('删除练习集失败', 'error')
    }
  }

  const addQuestionToSet = async (setId, questionId) => {
    try {
      const response = await api.user.practiceSets.addQuestion(setId, questionId)
      if (response.success) {
        const set = customPracticeSets.value.find(s => s.id === setId)
        if (set && !set.questionIds.includes(questionId)) {
          set.questionIds.push(questionId)
        }
        uiStore.showToast('题目已添加到练习集', 'success')
        return true
      } else {
        uiStore.showToast(response.message || '题目已存在于练习集中', 'warning')
        return false
      }
    } catch (error) {
      console.error('Add question to set error:', error)
      uiStore.showToast('添加失败，请重试', 'error')
      return false
    }
  }

  const loadUserData = async () => {
    try {
      // 并行加载用户数据
      const [favoritesRes, mistakesRes, setsRes] = await Promise.all([
        api.user.favorites.list(),
        api.user.mistakes.list(),
        api.user.practiceSets.list()
      ])

      if (favoritesRes.success) {
        favoriteQuestionIds.value = favoritesRes.data
      }
      if (mistakesRes.success) {
        mistakeLogEntries.value = mistakesRes.data
      }
      if (setsRes.success) {
        customPracticeSets.value = setsRes.data
      }
    } catch (error) {
      console.error('Load user data error:', error)
    }
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
    isLoading,
    
    // Getters
    categories,
    filteredQuestions,
    questionById,
    favoritesCount,
    mistakesCount,
    customSetsCount,
    
    // Actions
    generateQuestions,
    loadQuestions,
    toggleFavorite,
    addMistake,
    removeMistake,
    createCustomSet,
    deleteCustomSet,
    addQuestionToSet,
    loadUserData,
    setCurrentView,
    setFilters,
    resetFilters
  }
}) 
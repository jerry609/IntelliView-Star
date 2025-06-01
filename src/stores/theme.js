import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isLightMode = ref(false)

  const toggleTheme = () => {
    isLightMode.value = !isLightMode.value
    localStorage.setItem('theme', isLightMode.value ? 'light' : 'dark')
  }

  const applyInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    isLightMode.value = savedTheme === 'light'
  }

  return {
    isLightMode,
    toggleTheme,
    applyInitialTheme
  }
}) 
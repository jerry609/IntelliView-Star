<template>
  <div id="app" :class="{ 'light': isLightMode }">
    <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div class="app-container-bg w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
        <AppHeader />
        <main class="p-6 md:p-8">
          <router-view />
        </main>
      </div>
    </div>
    
    <!-- Global Toast Component -->
    <Toast />
    
    <!-- Global Modal Components -->
    <CreateSetModal />
    <AddToSetModal />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import Toast from '@/components/ui/Toast.vue'
import CreateSetModal from '@/components/modals/CreateSetModal.vue'
import AddToSetModal from '@/components/modals/AddToSetModal.vue'

const themeStore = useThemeStore()
const { isLightMode } = storeToRefs(themeStore)

// Apply initial theme on mount
themeStore.applyInitialTheme()

// Provide theme toggle function globally
provide('toggleTheme', themeStore.toggleTheme)
</script> 
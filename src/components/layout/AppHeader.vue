<template>
  <header class="header-bg p-6 border-b border-dynamic">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="w-10 h-10 text-accent"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09zM18.25 12L15.404 11.187a4.5 4.5 0 00-3.09-3.09L11.25 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L4.5 12l2.846.813a4.5 4.5 0 003.09 3.09L11.25 18.75l.813-2.846a4.5 4.5 0 003.09-3.09L18.25 12zM12.75 15l.813 2.846a4.5 4.5 0 003.09 3.09L19.5 21.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L12.75 15z" 
          />
        </svg>
        <div>
          <h1 class="text-2xl font-bold text-primary">AI 面试官 (V3.4)</h1>
          <p class="text-sm text-secondary">统计增强，编辑器优化</p>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script> 
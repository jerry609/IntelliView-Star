<template>
  <section>
    <h2 class="text-2xl font-semibold text-accent mb-6 text-center">
      选择您的练习模式
    </h2>
    
    <div class="grid md:grid-cols-3 gap-6">
      <button 
        @click="$router.push('/standard-practice')"
        class="card-bg p-6 rounded-lg shadow-lg hover:shadow-accent transition-shadow text-left border border-dynamic"
      >
        <h3 class="text-xl font-bold text-primary mb-2">标准练习</h3>
        <p class="text-secondary text-sm">
          AI生成题目，逐题作答、收藏、回顾错题。
        </p>
      </button>
      
      <button 
        @click="$router.push('/mock-interview')"
        class="card-bg p-6 rounded-lg shadow-lg hover:shadow-accent transition-shadow text-left border border-dynamic"
      >
        <h3 class="text-xl font-bold text-primary mb-2">模拟面试</h3>
        <p class="text-secondary text-sm">
          选择角色与时长，进行沉浸式模拟面试体验。
        </p>
      </button>
      
      <button 
        @click="$router.push('/statistics')"
        class="card-bg p-6 rounded-lg shadow-lg hover:shadow-accent transition-shadow text-left border border-dynamic"
      >
        <h3 class="text-xl font-bold text-primary mb-2">练习统计</h3>
        <p class="text-secondary text-sm">
          查看您的练习数据、掌握程度和进步轨迹。
        </p>
      </button>
    </div>
  </section>
</template>

<script setup>
// This component doesn't need any reactive data or methods
// since it's just navigation buttons
</script> 
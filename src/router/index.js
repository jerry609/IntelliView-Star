import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: () => import('@/views/MainMenu.vue')
  },
  {
    path: '/standard-practice',
    name: 'StandardPractice',
    component: () => import('@/views/StandardPractice.vue'),
    children: [
      {
        path: '',
        name: 'PracticeInput',
        component: () => import('@/views/practice/PracticeInput.vue')
      },
      {
        path: 'loading',
        name: 'PracticeLoading',
        component: () => import('@/views/practice/PracticeLoading.vue')
      },
      {
        path: 'questions',
        name: 'QuestionsList',
        component: () => import('@/views/practice/QuestionsList.vue')
      },
      {
        path: 'answer/:questionId',
        name: 'AnswerView',
        component: () => import('@/views/practice/AnswerView.vue'),
        props: true
      }
    ]
  },
  {
    path: '/mock-interview',
    name: 'MockInterview',
    component: () => import('@/views/MockInterview.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/Statistics.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
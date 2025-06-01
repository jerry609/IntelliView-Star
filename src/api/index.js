/**
 * API模块统一入口
 */

// 配置和客户端
export { default as apiClient } from './client.js'
export * from './config.js'

// 服务模块
export { default as questionsService } from './services/questionsService.js'
export { default as answersService } from './services/answersService.js'
export { default as userService } from './services/userService.js'

// 类型定义
export * from '../types/index.js'

// 创建统一的API接口对象，方便使用
import questionsService from './services/questionsService.js'
import answersService from './services/answersService.js'
import userService from './services/userService.js'

export const api = {
  // 题目相关
  questions: {
    generate: questionsService.generateQuestions.bind(questionsService),
    getList: questionsService.getQuestions.bind(questionsService),
    getDetail: questionsService.getQuestionDetail.bind(questionsService),
    getCategories: questionsService.getCategories.bind(questionsService),
    search: questionsService.searchQuestions.bind(questionsService),
    export: questionsService.exportQuestions.bind(questionsService)
  },

  // 答题相关
  answers: {
    submit: answersService.submitAnswer.bind(answersService),
    getAIScore: answersService.getAIScore.bind(answersService),
    getHistory: answersService.getAnswerHistory.bind(answersService),
    getStatistics: answersService.getAnswerStatistics.bind(answersService),
    submitFollowUp: answersService.submitFollowUpAnswer.bind(answersService)
  },

  // 用户功能
  user: {
    // 收藏
    favorites: {
      list: userService.getFavorites.bind(userService),
      add: userService.addFavorite.bind(userService),
      remove: userService.removeFavorite.bind(userService)
    },
    
    // 错题本
    mistakes: {
      list: userService.getMistakes.bind(userService),
      add: userService.addMistake.bind(userService),
      markMastered: userService.markMistakeMastered.bind(userService)
    },
    
    // 练习集
    practiceSets: {
      list: userService.getPracticeSets.bind(userService),
      create: userService.createPracticeSet.bind(userService),
      update: userService.updatePracticeSet.bind(userService),
      delete: userService.deletePracticeSet.bind(userService),
      addQuestion: userService.addQuestionToSet.bind(userService),
      getQuestions: userService.getPracticeSetQuestions.bind(userService)
    }
  }
}

// 默认导出统一接口
export default api 
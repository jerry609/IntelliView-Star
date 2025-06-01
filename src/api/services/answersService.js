import apiClient from '../client.js'
import { API_ENDPOINTS } from '../config.js'
import { createApiResponse, createAIFeedback } from '../../types/index.js'
import { generateMockScore, generateMockFeedback } from '../../utils/helpers.js'

/**
 * 答题相关API服务
 */
class AnswersService {
  /**
   * 提交答案
   * @param {Object} answerData - 答案数据
   * @returns {Promise<Object>} API响应
   */
  async submitAnswer(answerData) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 800))
        const answerId = `answer_${Date.now()}`
        return createApiResponse(true, { id: answerId, ...answerData }, '答案提交成功')
      }

      const response = await apiClient.post(API_ENDPOINTS.ANSWERS.SUBMIT, {
        questionId: answerData.questionId,
        answerText: answerData.answerText,
        timeSpent: answerData.timeSpent,
        metadata: answerData.metadata || {}
      })
      
      return response
    } catch (error) {
      console.error('Submit answer error:', error)
      throw error
    }
  }

  /**
   * 获取AI评分
   * @param {string} answerId - 答案ID
   * @param {string} questionId - 题目ID (Mock模式使用)
   * @returns {Promise<Object>} AI评分结果
   */
  async getAIScore(answerId, questionId = null) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟AI处理时间
        
        const score = generateMockScore()
        const feedback = generateMockFeedback(score)
        
        const aiFeedback = createAIFeedback({
          score,
          highlights: feedback.highlights,
          improvements: feedback.improvements,
          suggestions: feedback.suggestions,
          followUpQuestion: score >= 70 ? {
            id: `followup_${Date.now()}`,
            text: "能否详细解释一下这个概念在实际项目中的应用场景？",
            referenceAnswer: "这是一个追问的参考答案示例。"
          } : null
        })
        
        return createApiResponse(true, aiFeedback, 'AI评分完成')
      }

      const response = await apiClient.post(API_ENDPOINTS.ANSWERS.AI_SCORE, {}, {
        pathParams: { id: answerId }
      })
      
      return response
    } catch (error) {
      console.error('Get AI score error:', error)
      throw error
    }
  }

  /**
   * 获取答题历史
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 答题历史
   */
  async getAnswerHistory(filters = {}) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 生成模拟历史数据
        const mockHistory = []
        for (let i = 0; i < 10; i++) {
          mockHistory.push({
            id: `answer_${i}`,
            questionId: `q_${i}`,
            questionText: `这是第${i + 1}个练习题目`,
            answerText: `这是第${i + 1}个答案`,
            score: Math.floor(Math.random() * 40) + 60,
            timeSpent: Math.floor(Math.random() * 300) + 60,
            submittedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            category: i % 2 === 0 ? '计算机网络' : '数据结构与算法'
          })
        }
        
        return createApiResponse(true, {
          answers: mockHistory,
          total: mockHistory.length,
          page: filters.page || 1,
          pageSize: filters.pageSize || 20
        }, '获取答题历史成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.ANSWERS.HISTORY, {
        queryParams: {
          questionId: filters.questionId,
          category: filters.category,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || 1,
          pageSize: filters.pageSize || 20
        }
      })
      
      return response
    } catch (error) {
      console.error('Get answer history error:', error)
      throw error
    }
  }

  /**
   * 获取答题统计
   * @returns {Promise<Object>} 统计数据
   */
  async getAnswerStatistics() {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const mockStats = {
          totalAnswered: 45,
          averageScore: 78.5,
          totalTimeSpent: 12600, // 秒
          categoryStats: {
            '计算机网络': {
              totalAnswered: 15,
              averageScore: 82.3,
              correctRate: 0.73
            },
            '数据结构与算法': {
              totalAnswered: 20,
              averageScore: 75.8,
              correctRate: 0.65
            },
            '计算机科学基础': {
              totalAnswered: 10,
              averageScore: 79.2,
              correctRate: 0.70
            }
          },
          recentActivity: [
            { date: '2024-01-15', answersCount: 3, averageScore: 85 },
            { date: '2024-01-14', answersCount: 2, averageScore: 76 },
            { date: '2024-01-13', answersCount: 4, averageScore: 82 }
          ]
        }
        
        return createApiResponse(true, mockStats, '获取统计数据成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.ANSWERS.STATISTICS)
      return response
    } catch (error) {
      console.error('Get answer statistics error:', error)
      throw error
    }
  }

  /**
   * 提交追问回答
   * @param {Object} followUpData - 追问数据
   * @returns {Promise<Object>} API响应
   */
  async submitFollowUpAnswer(followUpData) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const score = Math.floor(Math.random() * 30) + 70 // 70-100分
        const feedback = score >= 85 ? '追问回答优秀！' : 
                        score >= 75 ? '追问回答良好。' : '追问回答一般。'
        
        return createApiResponse(true, {
          score,
          feedback,
          evaluatedAt: new Date().toISOString()
        }, '追问回答评分完成')
      }

      const response = await apiClient.post(API_ENDPOINTS.ANSWERS.SUBMIT, {
        parentAnswerId: followUpData.parentAnswerId,
        followUpQuestionId: followUpData.followUpQuestionId,
        answerText: followUpData.answerText,
        timeSpent: followUpData.timeSpent
      })
      
      return response
    } catch (error) {
      console.error('Submit follow-up answer error:', error)
      throw error
    }
  }
}

// 创建单例实例
export const answersService = new AnswersService()

// 导出默认实例
export default answersService 
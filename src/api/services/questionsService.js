import apiClient from '../client.js'
import { API_ENDPOINTS } from '../config.js'
import { generateMockQuestions } from '../../utils/mockData.js'
import { createApiResponse } from '../../types/index.js'

/**
 * 题目相关API服务
 */
class QuestionsService {
  /**
   * 生成题目（根据简历和JD）
   * @param {File} resumeFile - 简历文件
   * @param {string} jobDescription - 岗位描述
   * @returns {Promise<Object>} API响应
   */
  async generateQuestions(resumeFile, jobDescription) {
    try {
      // 如果启用Mock模式，返回模拟数据
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟网络延迟
        return createApiResponse(true, generateMockQuestions(), '题目生成成功')
      }

      // 实际API调用
      const response = await apiClient.upload(
        API_ENDPOINTS.QUESTIONS.GENERATE,
        resumeFile,
        {
          extraData: {
            jobDescription,
            questionCount: 10,
            includeFollowUps: true
          }
        }
      )
      
      return response
    } catch (error) {
      console.error('Generate questions error:', error)
      throw error
    }
  }

  /**
   * 获取题目列表
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 题目列表
   */
  async getQuestions(filters = {}) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return createApiResponse(true, generateMockQuestions(), '获取题目列表成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.LIST, {
        queryParams: {
          category: filters.category,
          difficulty: filters.difficulty,
          page: filters.page || 1,
          pageSize: filters.pageSize || 20
        }
      })
      
      return response
    } catch (error) {
      console.error('Get questions error:', error)
      throw error
    }
  }

  /**
   * 获取题目详情
   * @param {string} questionId - 题目ID
   * @returns {Promise<Object>} 题目详情
   */
  async getQuestionDetail(questionId) {
    try {
      if (apiClient.enableMock) {
        // 从mock数据中查找
        const mockData = generateMockQuestions()
        for (const category of mockData) {
          const question = category.questions.find(q => q.id === questionId)
          if (question) {
            return createApiResponse(true, { ...question, category: category.category }, '获取题目详情成功')
          }
        }
        throw new Error('题目不存在')
      }

      const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.DETAIL, {
        pathParams: { id: questionId }
      })
      
      return response
    } catch (error) {
      console.error('Get question detail error:', error)
      throw error
    }
  }

  /**
   * 获取题目分类
   * @returns {Promise<Object>} 分类列表
   */
  async getCategories() {
    try {
      if (apiClient.enableMock) {
        const mockData = generateMockQuestions()
        const categories = mockData.map(cat => ({
          id: cat.category.toLowerCase().replace(/\s+/g, '_'),
          name: cat.category,
          questionCount: cat.questions.length
        }))
        return createApiResponse(true, categories, '获取分类成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.CATEGORIES)
      return response
    } catch (error) {
      console.error('Get categories error:', error)
      throw error
    }
  }

  /**
   * 搜索题目
   * @param {string} query - 搜索关键词
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 搜索结果
   */
  async searchQuestions(query, filters = {}) {
    try {
      if (apiClient.enableMock) {
        const mockData = generateMockQuestions()
        const filteredData = mockData.map(cat => ({
          ...cat,
          questions: cat.questions.filter(q => 
            q.text.toLowerCase().includes(query.toLowerCase()) ||
            q.category.toLowerCase().includes(query.toLowerCase())
          )
        })).filter(cat => cat.questions.length > 0)
        
        return createApiResponse(true, filteredData, '搜索完成')
      }

      const response = await apiClient.post(API_ENDPOINTS.QUESTIONS.SEARCH, {
        query,
        filters: {
          category: filters.category,
          difficulty: filters.difficulty,
          page: filters.page || 1,
          pageSize: filters.pageSize || 20
        }
      })
      
      return response
    } catch (error) {
      console.error('Search questions error:', error)
      throw error
    }
  }

  /**
   * 批量导出题目
   * @param {Array} questionIds - 题目ID列表
   * @param {string} format - 导出格式 ('json', 'txt', 'pdf')
   * @returns {Promise<Blob>} 导出文件
   */
  async exportQuestions(questionIds, format = 'txt') {
    try {
      if (apiClient.enableMock) {
        // Mock导出功能
        const mockData = generateMockQuestions()
        const questions = []
        
        for (const cat of mockData) {
          for (const q of cat.questions) {
            if (questionIds.includes(q.id)) {
              questions.push({ ...q, category: cat.category })
            }
          }
        }
        
        let content = ''
        if (format === 'json') {
          content = JSON.stringify(questions, null, 2)
        } else {
          questions.forEach((q, index) => {
            content += `${index + 1}. ${q.text}\n分类: ${q.category}\n难度: ${q.difficulty}\n\n`
          })
        }
        
        return new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' })
      }

      const response = await apiClient.post(API_ENDPOINTS.QUESTIONS.BULK_EXPORT, {
        questionIds,
        format
      })
      
      return response
    } catch (error) {
      console.error('Export questions error:', error)
      throw error
    }
  }
}

// 创建单例实例
export const questionsService = new QuestionsService()

// 导出默认实例
export default questionsService 
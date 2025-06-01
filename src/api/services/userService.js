import apiClient from '../client.js'
import { API_ENDPOINTS } from '../config.js'
import { createApiResponse, createPracticeSet } from '../../types/index.js'

/**
 * 用户相关API服务
 */
class UserService {
  // ========== 收藏功能 ==========
  
  /**
   * 获取收藏列表
   * @returns {Promise<Object>} 收藏列表
   */
  async getFavorites() {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        return createApiResponse(true, mockFavorites, '获取收藏列表成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.FAVORITES.LIST)
      return response
    } catch (error) {
      console.error('Get favorites error:', error)
      throw error
    }
  }

  /**
   * 添加收藏
   * @param {string} questionId - 题目ID
   * @returns {Promise<Object>} API响应
   */
  async addFavorite(questionId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        if (!favorites.includes(questionId)) {
          favorites.push(questionId)
          localStorage.setItem('favorites', JSON.stringify(favorites))
        }
        return createApiResponse(true, { questionId }, '添加收藏成功')
      }

      const response = await apiClient.post(API_ENDPOINTS.FAVORITES.ADD, {
        questionId
      })
      return response
    } catch (error) {
      console.error('Add favorite error:', error)
      throw error
    }
  }

  /**
   * 取消收藏
   * @param {string} questionId - 题目ID
   * @returns {Promise<Object>} API响应
   */
  async removeFavorite(questionId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        const newFavorites = favorites.filter(id => id !== questionId)
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        return createApiResponse(true, { questionId }, '取消收藏成功')
      }

      const response = await apiClient.delete(API_ENDPOINTS.FAVORITES.REMOVE, {
        pathParams: { questionId }
      })
      return response
    } catch (error) {
      console.error('Remove favorite error:', error)
      throw error
    }
  }

  // ========== 错题本功能 ==========
  
  /**
   * 获取错题列表
   * @returns {Promise<Object>} 错题列表
   */
  async getMistakes() {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockMistakes = JSON.parse(localStorage.getItem('mistakes') || '[]')
        return createApiResponse(true, mockMistakes, '获取错题列表成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.MISTAKES.LIST)
      return response
    } catch (error) {
      console.error('Get mistakes error:', error)
      throw error
    }
  }

  /**
   * 添加错题
   * @param {Object} mistakeData - 错题数据
   * @returns {Promise<Object>} API响应
   */
  async addMistake(mistakeData) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const mistakes = JSON.parse(localStorage.getItem('mistakes') || '[]')
        const existingIndex = mistakes.findIndex(m => m.questionId === mistakeData.questionId)
        
        if (existingIndex > -1) {
          mistakes[existingIndex] = mistakeData
        } else {
          mistakes.push(mistakeData)
        }
        
        localStorage.setItem('mistakes', JSON.stringify(mistakes))
        return createApiResponse(true, mistakeData, '错题记录成功')
      }

      const response = await apiClient.post(API_ENDPOINTS.MISTAKES.LIST, mistakeData)
      return response
    } catch (error) {
      console.error('Add mistake error:', error)
      throw error
    }
  }

  /**
   * 标记错题为已掌握
   * @param {string} questionId - 题目ID
   * @returns {Promise<Object>} API响应
   */
  async markMistakeMastered(questionId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const mistakes = JSON.parse(localStorage.getItem('mistakes') || '[]')
        const newMistakes = mistakes.filter(m => m.questionId !== questionId)
        localStorage.setItem('mistakes', JSON.stringify(newMistakes))
        return createApiResponse(true, { questionId }, '已标记为掌握')
      }

      const response = await apiClient.delete(API_ENDPOINTS.MISTAKES.MARK_MASTERED, {
        pathParams: { questionId }
      })
      return response
    } catch (error) {
      console.error('Mark mistake mastered error:', error)
      throw error
    }
  }

  // ========== 练习集功能 ==========
  
  /**
   * 获取练习集列表
   * @returns {Promise<Object>} 练习集列表
   */
  async getPracticeSets() {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockSets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        return createApiResponse(true, mockSets, '获取练习集列表成功')
      }

      const response = await apiClient.get(API_ENDPOINTS.PRACTICE_SETS.LIST)
      return response
    } catch (error) {
      console.error('Get practice sets error:', error)
      throw error
    }
  }

  /**
   * 创建练习集
   * @param {string} name - 练习集名称
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>} API响应
   */
  async createPracticeSet(name, options = {}) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const newSet = createPracticeSet({
          id: `set_${Date.now()}`,
          name,
          questionIds: [],
          userId: 'mock_user',
          isPublic: options.isPublic || false
        })
        
        const sets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        sets.push(newSet)
        localStorage.setItem('practiceSets', JSON.stringify(sets))
        
        return createApiResponse(true, newSet, '练习集创建成功')
      }

      const response = await apiClient.post(API_ENDPOINTS.PRACTICE_SETS.CREATE, {
        name,
        isPublic: options.isPublic || false,
        description: options.description || ''
      })
      return response
    } catch (error) {
      console.error('Create practice set error:', error)
      throw error
    }
  }

  /**
   * 更新练习集
   * @param {string} setId - 练习集ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} API响应
   */
  async updatePracticeSet(setId, updateData) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const sets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        const setIndex = sets.findIndex(s => s.id === setId)
        
        if (setIndex > -1) {
          sets[setIndex] = { ...sets[setIndex], ...updateData, updatedAt: new Date().toISOString() }
          localStorage.setItem('practiceSets', JSON.stringify(sets))
          return createApiResponse(true, sets[setIndex], '练习集更新成功')
        } else {
          throw new Error('练习集不存在')
        }
      }

      const response = await apiClient.put(API_ENDPOINTS.PRACTICE_SETS.UPDATE, updateData, {
        pathParams: { id: setId }
      })
      return response
    } catch (error) {
      console.error('Update practice set error:', error)
      throw error
    }
  }

  /**
   * 删除练习集
   * @param {string} setId - 练习集ID
   * @returns {Promise<Object>} API响应
   */
  async deletePracticeSet(setId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const sets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        const newSets = sets.filter(s => s.id !== setId)
        localStorage.setItem('practiceSets', JSON.stringify(newSets))
        return createApiResponse(true, { id: setId }, '练习集删除成功')
      }

      const response = await apiClient.delete(API_ENDPOINTS.PRACTICE_SETS.DELETE, {
        pathParams: { id: setId }
      })
      return response
    } catch (error) {
      console.error('Delete practice set error:', error)
      throw error
    }
  }

  /**
   * 添加题目到练习集
   * @param {string} setId - 练习集ID
   * @param {string} questionId - 题目ID
   * @returns {Promise<Object>} API响应
   */
  async addQuestionToSet(setId, questionId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const sets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        const set = sets.find(s => s.id === setId)
        
        if (set) {
          if (!set.questionIds.includes(questionId)) {
            set.questionIds.push(questionId)
            set.updatedAt = new Date().toISOString()
            localStorage.setItem('practiceSets', JSON.stringify(sets))
            return createApiResponse(true, { setId, questionId }, '题目添加成功')
          } else {
            return createApiResponse(false, null, '题目已存在于练习集中')
          }
        } else {
          throw new Error('练习集不存在')
        }
      }

      const response = await apiClient.post(API_ENDPOINTS.PRACTICE_SETS.ADD_QUESTION, {
        questionId
      }, {
        pathParams: { id: setId }
      })
      return response
    } catch (error) {
      console.error('Add question to set error:', error)
      throw error
    }
  }

  /**
   * 获取练习集的题目
   * @param {string} setId - 练习集ID
   * @returns {Promise<Object>} 练习集题目
   */
  async getPracticeSetQuestions(setId) {
    try {
      if (apiClient.enableMock) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const sets = JSON.parse(localStorage.getItem('practiceSets') || '[]')
        const set = sets.find(s => s.id === setId)
        
        if (set) {
          return createApiResponse(true, {
            setInfo: set,
            questionIds: set.questionIds
          }, '获取练习集题目成功')
        } else {
          throw new Error('练习集不存在')
        }
      }

      const response = await apiClient.get(API_ENDPOINTS.PRACTICE_SETS.QUESTIONS, {
        pathParams: { id: setId }
      })
      return response
    } catch (error) {
      console.error('Get practice set questions error:', error)
      throw error
    }
  }
}

// 创建单例实例
export const userService = new UserService()

// 导出默认实例
export default userService 
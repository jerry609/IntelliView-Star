/**
 * API配置文件
 */

// 环境配置
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
}

// 当前环境
const currentEnv = import.meta.env.MODE || ENV.DEVELOPMENT

// API基础配置
const API_CONFIG = {
  [ENV.DEVELOPMENT]: {
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    enableMock: true // 开发环境启用Mock
  },
  [ENV.PRODUCTION]: {
    baseURL: 'https://api.intelliview-star.com/api/v1',
    timeout: 15000,
    enableMock: false
  }
}

// 获取当前环境配置
export const getApiConfig = () => API_CONFIG[currentEnv]

// API端点定义
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  
  // 题目相关
  QUESTIONS: {
    GENERATE: '/questions/generate',           // POST - 根据简历和JD生成题目
    LIST: '/questions',                        // GET - 获取题目列表
    DETAIL: '/questions/:id',                  // GET - 获取题目详情
    CATEGORIES: '/questions/categories',       // GET - 获取题目分类
    SEARCH: '/questions/search',               // POST - 搜索题目
    BULK_EXPORT: '/questions/export'          // POST - 批量导出题目
  },
  
  // 用户回答相关
  ANSWERS: {
    SUBMIT: '/answers',                        // POST - 提交答案
    AI_SCORE: '/answers/:id/ai-score',         // POST - AI评分
    HISTORY: '/answers/history',               // GET - 获取答题历史
    STATISTICS: '/answers/statistics'          // GET - 获取答题统计
  },
  
  // 收藏功能
  FAVORITES: {
    LIST: '/favorites',                        // GET - 获取收藏列表
    ADD: '/favorites',                         // POST - 添加收藏
    REMOVE: '/favorites/:questionId',          // DELETE - 取消收藏
    EXPORT: '/favorites/export'               // GET - 导出收藏
  },
  
  // 错题本
  MISTAKES: {
    LIST: '/mistakes',                         // GET - 获取错题列表
    MARK_MASTERED: '/mistakes/:questionId',    // DELETE - 标记已掌握
    EXPORT: '/mistakes/export'                // GET - 导出错题本
  },
  
  // 自定义练习集
  PRACTICE_SETS: {
    LIST: '/practice-sets',                    // GET - 获取练习集列表
    CREATE: '/practice-sets',                  // POST - 创建练习集
    UPDATE: '/practice-sets/:id',              // PUT - 更新练习集
    DELETE: '/practice-sets/:id',              // DELETE - 删除练习集
    QUESTIONS: '/practice-sets/:id/questions', // GET - 获取练习集题目
    ADD_QUESTION: '/practice-sets/:id/questions', // POST - 添加题目到练习集
    EXPORT: '/practice-sets/:id/export'       // GET - 导出练习集
  },
  
  // 模拟面试
  MOCK_INTERVIEW: {
    START: '/mock-interview',                  // POST - 开始模拟面试
    SUBMIT_ANSWER: '/mock-interview/:sessionId/answers', // POST - 提交面试答案
    END: '/mock-interview/:sessionId/end',     // POST - 结束面试
    REPORT: '/mock-interview/:sessionId/report' // GET - 获取面试报告
  },
  
  // 文件上传
  UPLOAD: {
    RESUME: '/upload/resume',                  // POST - 上传简历
    EXPORT_FILE: '/upload/export'             // POST - 导出文件
  },
  
  // 统计数据
  STATISTICS: {
    OVERVIEW: '/statistics/overview',          // GET - 总览统计
    CATEGORY: '/statistics/category',          // GET - 分类统计
    PROGRESS: '/statistics/progress',          // GET - 进度统计
    ACTIVITY: '/statistics/activity'          // GET - 活跃度统计
  }
}

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

// 错误代码定义（与Go后端对应）
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  
  // 业务错误
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  ALREADY_FAVORITED: 'ALREADY_FAVORITED',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  PRACTICE_SET_NOT_FOUND: 'PRACTICE_SET_NOT_FOUND'
} 
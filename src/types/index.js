/**
 * 用户相关类型定义
 */
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
}

/**
 * 题目难度枚举
 */
export const QuestionDifficulty = {
  EASY: '简单',
  MEDIUM: '中等',
  HARD: '困难'
}

/**
 * 面试模式枚举
 */
export const InterviewMode = {
  STANDARD: 'standard',
  MOCK: 'mock',
  CUSTOM: 'custom'
}

/**
 * API响应基础结构
 */
export const createApiResponse = (success, data = null, message = '', code = 200) => ({
  success,
  data,
  message,
  code,
  timestamp: new Date().toISOString()
})

/**
 * 题目数据结构
 */
export const createQuestion = ({
  id,
  text,
  difficulty = QuestionDifficulty.MEDIUM,
  category = '',
  referenceAnswer = '',
  resources = [],
  followUps = [],
  tags = []
}) => ({
  id,
  text,
  difficulty,
  category,
  referenceAnswer,
  resources,
  followUps,
  tags,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

/**
 * 用户回答数据结构
 */
export const createUserAnswer = ({
  questionId,
  userId,
  answerText,
  score = 0,
  timeSpent = 0,
  isCorrect = false
}) => ({
  id: `answer_${Date.now()}`,
  questionId,
  userId,
  answerText,
  score,
  timeSpent,
  isCorrect,
  submittedAt: new Date().toISOString()
})

/**
 * AI评分结果数据结构
 */
export const createAIFeedback = ({
  score,
  highlights = '',
  improvements = '',
  suggestions = '',
  followUpQuestion = null
}) => ({
  score,
  highlights,
  improvements,
  suggestions,
  followUpQuestion,
  evaluatedAt: new Date().toISOString()
})

/**
 * 练习集数据结构
 */
export const createPracticeSet = ({
  id,
  name,
  questionIds = [],
  userId,
  isPublic = false
}) => ({
  id,
  name,
  questionIds,
  userId,
  isPublic,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

/**
 * 模拟面试配置
 */
export const createMockInterviewConfig = ({
  role = 'general_tech',
  duration = 30,
  questionCount = 5,
  customTopic = ''
}) => ({
  role,
  duration,
  questionCount,
  customTopic,
  createdAt: new Date().toISOString()
})

/**
 * 统计数据结构
 */
export const createStatistics = ({
  totalAnswered = 0,
  averageScore = 0,
  mockInterviewsCompleted = 0,
  categoryStats = {},
  practiceHistory = []
}) => ({
  totalAnswered,
  averageScore,
  mockInterviewsCompleted,
  categoryStats,
  practiceHistory,
  lastUpdated: new Date().toISOString()
}) 
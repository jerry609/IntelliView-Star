import { getApiConfig, HTTP_STATUS } from './config.js'

/**
 * API客户端类
 */
class ApiClient {
  constructor() {
    this.config = getApiConfig()
    this.baseURL = this.config.baseURL
    this.timeout = this.config.timeout
    this.enableMock = this.config.enableMock
  }

  /**
   * 创建请求配置
   */
  createRequestConfig(options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    // 从localStorage获取token
    const token = localStorage.getItem('auth_token')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    return {
      method: 'GET',
      headers: defaultHeaders,
      timeout: this.timeout,
      ...options
    }
  }

  /**
   * 处理URL参数替换
   */
  buildUrl(endpoint, params = {}) {
    let url = this.baseURL + endpoint
    
    // 替换路径参数 (:id -> 实际值)
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key])
    })
    
    return url
  }

  /**
   * 处理查询参数
   */
  buildQueryString(params = {}) {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key])
      }
    })
    return queryParams.toString()
  }

  /**
   * 通用请求方法
   */
  async request(endpoint, options = {}) {
    try {
      const { pathParams = {}, queryParams = {}, ...requestOptions } = options
      
      // 构建完整URL
      let url = this.buildUrl(endpoint, pathParams)
      const queryString = this.buildQueryString(queryParams)
      if (queryString) {
        url += `?${queryString}`
      }

      // 创建请求配置
      const config = this.createRequestConfig(requestOptions)

      // 发送请求
      const response = await fetch(url, config)
      
      // 处理响应
      return await this.handleResponse(response)
      
    } catch (error) {
      console.error('API Request Error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * 处理响应
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (response.ok) {
      return data
    } else {
      throw {
        status: response.status,
        statusText: response.statusText,
        data
      }
    }
  }

  /**
   * 处理错误
   */
  handleError(error) {
    if (error.status) {
      // HTTP错误
      return {
        success: false,
        message: error.data?.message || error.statusText || '请求失败',
        code: error.status,
        errorCode: error.data?.errorCode || 'HTTP_ERROR'
      }
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // 网络错误
      return {
        success: false,
        message: '网络连接失败，请检查网络设置',
        code: 0,
        errorCode: 'NETWORK_ERROR'
      }
    } else {
      // 其他错误
      return {
        success: false,
        message: error.message || '未知错误',
        code: 0,
        errorCode: 'UNKNOWN_ERROR'
      }
    }
  }

  /**
   * GET请求
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST请求
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT请求
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE请求
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * 文件上传
   */
  async upload(endpoint, file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    // 添加额外的表单数据
    if (options.extraData) {
      Object.keys(options.extraData).forEach(key => {
        formData.append(key, options.extraData[key])
      })
    }

    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
        'Accept': 'application/json'
      }
    })
  }

  /**
   * 下载文件
   */
  async download(endpoint, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/octet-stream'
      }
    })
    
    return response
  }
}

// 创建单例实例
export const apiClient = new ApiClient()

// 导出默认实例
export default apiClient 
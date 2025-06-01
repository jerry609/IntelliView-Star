import { saveAs } from 'file-saver'

// Time formatting
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// File validation
export const validatePDFFile = (file) => {
  const errors = []
  
  if (!file) {
    errors.push('请选择文件')
    return errors
  }
  
  if (file.type !== 'application/pdf') {
    errors.push('文件格式错误，请上传PDF文件')
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    errors.push('文件过大，请上传小于5MB的PDF')
  }
  
  return errors
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('复制失败: ', err)
      return fallbackCopyTextToClipboard(text)
    }
  } else {
    return fallbackCopyTextToClipboard(text)
  }
}

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"
  
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('备用复制失败: ', err)
    document.body.removeChild(textArea)
    return false
  }
}

// Export data to file
export const exportData = (data, filename, type = 'text/plain') => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error('没有数据可导出')
  }
  
  let content = ""
  
  if (type.includes('json')) {
    content = JSON.stringify(data, null, 2)
  } else {
    if (Array.isArray(data) && data.every(item => item && item.category)) {
      // Question format
      data.forEach((cat) => {
        if (cat && cat.category && Array.isArray(cat.questions)) {
          content += `\n--- ${cat.category} ---\n\n`
          cat.questions.forEach((q, qIndex) => {
            if (q && q.text) {
              content += `${qIndex + 1}. ${q.text}\n   (难度: ${q.difficulty || '未知'})\n`
              if (q.referenceAnswer) {
                const ref = typeof q.referenceAnswer === 'string' 
                  ? q.referenceAnswer 
                  : (q.referenceAnswer.summary || '无摘要')
                content += `   参考答案: ${ref}\n\n`
              } else {
                content += `\n`
              }
            }
          })
        }
      })
    } else if (typeof data === 'string') {
      content = data
    } else {
      content = JSON.stringify(data, null, 2)
    }
  }

  const blob = new Blob([content], { type })
  saveAs(blob, filename)
}

// Generate random score (for mock AI scoring)
export const generateMockScore = () => {
  return Math.floor(Math.random() * 51) + 50 // 50-100
}

// Generate mock feedback based on score
export const generateMockFeedback = (score) => {
  let highlights = "模拟亮点：回答了关键点A。"
  let improvements = "模拟可改进：对于B的阐述可以更深入。"
  let suggestions = "模拟建议：复习C相关知识。"
  let simpleFeedback = ""

  if (score >= 90) {
    simpleFeedback = "优秀！您的回答非常全面且准确。"
    highlights = "知识点覆盖全面，逻辑清晰，表达准确。对[关键点1]和[关键点2]的理解非常到位。"
    improvements = "可以尝试思考该问题在不同场景下的变种，或者与其他相关概念（如[相关概念X]）进行对比分析。"
    suggestions = "保持这个状态，挑战更难的题目！可以深入研究[进阶主题Y]。"
  } else if (score >= 80) {
    simpleFeedback = "良好，回答基本正确，但部分细节可以更完善。"
    highlights = "主要概念（如[核心概念A]）理解正确，基本流程描述清晰。"
    improvements = "某些细节（例如[细节X]的边界条件或[细节Y]的潜在问题）可以补充得更完整。对[得分点Z]的阐述略显简略。"
    suggestions = "建议回顾[知识点P]和[知识点Q]，加强细节理解和案例分析。"
  } else if (score >= 60) {
    simpleFeedback = "一般，回答中存在一些不足，建议参考答案并加强理解。"
    highlights = "部分概念（如[概念M]）有提及，显示出一定的了解。"
    improvements = "核心逻辑（如[核心逻辑N]）的理解可能存在偏差，对[概念O]的解释不够清晰或准确。"
    suggestions = "请仔细对照参考答案，重点学习[概念O]和[核心逻辑N]的正确表述和原理。"
  } else {
    simpleFeedback = "有较大提升空间，请仔细对照参考答案，巩固知识点。"
    highlights = "能够识别问题所属的技术范畴。"
    improvements = "关键知识点（如[关键点R]、[关键点S]）缺失较多，回答结构不够系统。"
    suggestions = "建议系统学习该模块的基础知识，特别是[基础模块T]和[基础模块U]。"
  }

  return {
    simpleFeedback,
    highlights,
    improvements,
    suggestions
  }
}

// Format questions list for copying
export const formatQuestionsForCopy = (questions) => {
  let content = ""
  let globalQuestionIndex = 1

  questions.forEach(cat => {
    content += `\n--- ${cat.category} ---\n`
    cat.questions.forEach((qData) => {
      content += `${globalQuestionIndex}. ${qData.text} (难度: ${qData.difficulty})\n`
      globalQuestionIndex++
    })
  })

  return content.trim()
} 
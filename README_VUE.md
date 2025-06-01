# 智面星 (IntelliView Star) - Vue 3 版本 🌟

## 项目简介

智面星是一款 AI 驱动的智能面试题生成与练习平台，采用现代前后端分离架构构建。本项目为前端Vue应用，配合Go后端提供完整的面试辅助功能。

### 🚀 最新更新 (v2.0)

- ✅ 完成API架构重构，支持前后端分离
- ✅ 集成Go后端API接口预留
- ✅ 优化状态管理，使用Pinia替代Vuex
- ✅ 支持Mock模式和真实API模式切换
- ✅ 增强错误处理和用户体验
- ✅ 添加TypeScript类型定义

## 技术栈

### 前端技术
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: Tailwind CSS + 自定义CSS变量
- **HTTP客户端**: Fetch API (封装)
- **Markdown**: Marked.js

### 后端技术 (Go)
- **框架**: Gin Web Framework
- **数据库**: PostgreSQL + Redis
- **ORM**: GORM
- **认证**: JWT Token
- **API文档**: Swagger/OpenAPI
- **AI集成**: 支持多种大模型API

## 项目架构

```
前端 (Vue 3 + Vite)    →    后端 (Go + Gin)    →    数据库 (PostgreSQL)
    ↓                           ↓                        ↓
API层封装                   RESTful API              持久化存储
状态管理(Pinia)             业务逻辑                 Redis缓存
组件化UI                    AI服务集成               文件存储
```

## 核心功能

### 🎯 智能题目生成
- 上传简历PDF，输入岗位JD
- AI分析生成个性化面试题
- 支持多种难度和分类

### 📝 多样化练习模式
- **标准练习**: 单题作答，AI评分反馈
- **模拟面试**: 限时完整面试体验
- **专项练习**: 按分类、难度筛选
- **自定义练习集**: 个人专属题库

### 🔧 智能学习工具
- **AI追问**: 深度交互式问答
- **错题本**: 自动记录，智能复习
- **收藏夹**: 重点题目快速访问
- **Markdown编辑器**: 支持格式化答案

### 📊 数据统计分析
- 练习进度跟踪
- 分类掌握度分析
- 答题时间统计
- 成长趋势可视化

## 快速开始

### 环境要求
- Node.js 18+
- npm/yarn/pnpm
- Go 1.21+ (后端开发)
- PostgreSQL (生产环境)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/intelliview-star.git
cd intelliview-star
```

2. **安装前端依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
# Mock模式 (默认)
npm run dev

# 连接真实后端API
npm run dev:api
```

4. **启动后端服务** (可选)
```bash
cd backend-go
make dev
```

### 开发模式

| 模式 | 命令 | 说明 |
|-----|------|-----|
| Mock模式 | `npm run dev` | 使用模拟数据，无需后端 |
| API模式 | `npm run dev:api` | 连接Go后端API |
| 构建生产版本 | `npm run build` | 构建优化后的生产版本 |

## 项目结构

```
src/
├── api/                          # API接口层
│   ├── client.js                 # HTTP客户端封装
│   ├── config.js                 # API配置和端点
│   ├── index.js                  # 统一导出
│   └── services/                 # 业务API服务
│       ├── questionsService.js   # 题目API
│       ├── answersService.js     # 答题API
│       └── userService.js        # 用户功能API
├── components/                   # Vue组件
│   ├── layout/                   # 布局组件
│   ├── ui/                       # UI组件库
│   └── modals/                   # 弹窗组件
├── views/                        # 页面组件
├── stores/                       # Pinia状态管理
│   ├── questions.js              # 题目状态
│   ├── theme.js                  # 主题状态
│   └── ui.js                     # UI状态
├── router/                       # 路由配置
├── utils/                        # 工具函数
├── types/                        # 类型定义
└── style.css                     # 全局样式
```

## API设计

### 前端API调用示例

```javascript
import { api } from '@/api'

// 生成题目
const result = await api.questions.generate(resumeFile, jobDescription)

// 提交答案
const response = await api.answers.submit({
  questionId: 'q123',
  answerText: '用户答案',
  timeSpent: 120
})

// 收藏题目
await api.user.favorites.add(questionId)
```

### 后端API端点

| 模块 | 端点 | 方法 | 说明 |
|-----|------|------|-----|
| 题目 | `/api/v1/questions/generate` | POST | 生成题目 |
| 答题 | `/api/v1/answers` | POST | 提交答案 |
| 收藏 | `/api/v1/favorites` | GET/POST/DELETE | 收藏管理 |
| 统计 | `/api/v1/statistics/overview` | GET | 统计概览 |

完整的API文档请参考：[API集成指南](./API_INTEGRATION_GUIDE.md)

## 配置说明

### 环境变量

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_MOCK_ENABLED=true
VITE_APP_TITLE=智面星面试助手
```

### 开发代理

Vite开发服务器自动将 `/api` 请求代理到后端：

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 部署指南

### 前端部署

```bash
# 构建生产版本
npm run build

# 部署到静态托管服务
# dist/ 目录包含所有静态资源
```

### 全栈部署

```bash
# 使用Docker Compose
docker-compose up -d

# 包含：前端Nginx + 后端Go应用 + PostgreSQL + Redis
```

## 开发指南

### 添加新功能

1. **定义API接口** (`src/api/config.js`)
2. **实现API服务** (`src/api/services/`)
3. **更新状态管理** (`src/stores/`)
4. **创建UI组件** (`src/components/`)
5. **添加页面路由** (`src/router/`)

### 代码规范

```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 状态管理模式

使用Pinia进行状态管理：

```javascript
// stores/questions.js
export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref([])
  
  const loadQuestions = async () => {
    const response = await api.questions.getList()
    questions.value = response.data
  }
  
  return { questions, loadQuestions }
})
```

## 性能优化

### 前端优化
- ✅ Vue组件懒加载
- ✅ 路由级别代码分割
- ✅ 图片懒加载
- ✅ API请求缓存
- ✅ 构建时压缩优化

### 用户体验
- ✅ 加载状态指示
- ✅ 错误边界处理
- ✅ 响应式设计
- ✅ 暗色/亮色主题
- ✅ 键盘导航支持

## 测试策略

```bash
# 单元测试
npm run test:unit

# 端到端测试
npm run test:e2e

# 覆盖率报告
npm run test:coverage
```

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 提交规范

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具、依赖更新
```

## 技术路线图

### 短期计划 (1-2个月)
- [ ] 完善Go后端API实现
- [ ] 集成真实AI服务
- [ ] 添加用户认证系统
- [ ] 实现实时通知功能

### 中期计划 (3-6个月)
- [ ] 移动端适配优化
- [ ] 多语言国际化
- [ ] 高级数据分析
- [ ] 社区功能模块

### 长期愿景 (6个月+)
- [ ] 微服务架构迁移
- [ ] AI助手集成
- [ ] 企业级功能
- [ ] 开放API平台

## 故障排查

### 常见问题

**Q: API请求失败怎么办？**
A: 检查后端服务状态 (`http://localhost:8080/health`)，确认代理配置正确。

**Q: 如何切换到真实API？**
A: 运行 `npm run dev:api` 或设置环境变量 `VITE_API_MOCK_ENABLED=false`。

**Q: 构建失败怎么解决？**
A: 检查Node.js版本，清除缓存 (`rm -rf node_modules package-lock.json && npm install`)。

### 获取帮助

- 📖 [技术文档](./docs/)
- 🐛 [问题反馈](https://github.com/your-username/intelliview-star/issues)
- 💬 [讨论区](https://github.com/your-username/intelliview-star/discussions)

## 许可证

本项目采用 [MIT License](./LICENSE) 开源许可证。

## 致谢

感谢以下开源项目和贡献者：
- Vue.js 团队
- Tailwind CSS
- Vite 构建工具
- 所有贡献者和用户

---

**项目维护**: 开发团队  
**最后更新**: 2024年1月15日  
**版本**: v2.0.0

<div align="center">

**🌟 如果这个项目对您有帮助，请给我们一个Star！🌟**

[⭐ Star项目](https://github.com/your-username/intelliview-star) | [🚀 快速开始](#快速开始) | [📖 文档](./docs/) | [🐛 报告问题](https://github.com/your-username/intelliview-star/issues)

</div> 
# API集成指南 - 前后端对接文档

## 概述

本文档描述了智面星项目前端Vue应用与Go后端API的集成架构。项目已完成从单文件HTML应用到现代前后端分离架构的重构。

## 架构概览

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    GORM    ┌─────────────────┐
│   Vue 3 前端    │ ◄─────────────► │   Go Gin 后端   │ ◄────────► │   PostgreSQL    │
│  (Port: 3000)   │                 │  (Port: 8080)   │             │    数据库       │
└─────────────────┘                 └─────────────────┘             └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   静态资源      │                 │     Redis       │
│    (Vite)       │                 │     缓存        │
└─────────────────┘                 └─────────────────┘
```

## 前端API层架构

### 1. 目录结构

```
src/
├── api/                          # API接口层
│   ├── client.js                 # HTTP客户端封装
│   ├── config.js                 # API配置和端点定义
│   ├── index.js                  # 统一导出接口
│   └── services/                 # 业务API服务
│       ├── questionsService.js   # 题目相关API
│       ├── answersService.js     # 答题相关API
│       └── userService.js        # 用户功能API
├── types/                        # 类型定义
│   └── index.js                  # 数据结构定义
└── stores/                       # 状态管理
    ├── questions.js              # 已重构为API调用
    ├── theme.js                  # 主题状态
    └── ui.js                     # UI状态
```

### 2. API客户端特性

- **统一响应处理**: 标准化的成功/错误响应格式
- **自动认证**: JWT Token自动添加到请求头
- **错误处理**: 统一的错误处理和用户提示
- **Mock模式**: 开发环境支持Mock数据
- **代理配置**: Vite开发服务器自动代理到Go后端

### 3. 使用示例

```javascript
// 从统一接口导入
import { api } from '@/api'

// 题目生成
const response = await api.questions.generate(resumeFile, jobDescription)

// 添加收藏
const result = await api.user.favorites.add(questionId)

// 提交答案
const answer = await api.answers.submit({
  questionId: 'q123',
  answerText: '用户的回答...',
  timeSpent: 120
})
```

## 后端API架构

### 1. 项目结构

```
backend-go/
├── cmd/server/main.go            # 应用入口
├── internal/
│   ├── config/                   # 配置管理
│   ├── handler/                  # HTTP处理器
│   ├── service/                  # 业务逻辑层
│   ├── repository/               # 数据访问层
│   ├── model/                    # 数据模型
│   ├── middleware/               # 中间件
│   └── ai/                       # AI服务集成
└── configs/                      # 配置文件
```

### 2. API端点映射

| 功能模块 | 前端调用 | 后端端点 | 描述 |
|---------|---------|---------|-----|
| 题目生成 | `api.questions.generate()` | `POST /api/v1/questions/generate` | 根据简历和JD生成题目 |
| 题目列表 | `api.questions.getList()` | `GET /api/v1/questions` | 获取题目列表 |
| 收藏管理 | `api.user.favorites.add()` | `POST /api/v1/favorites` | 添加收藏 |
| 错题本 | `api.user.mistakes.list()` | `GET /api/v1/mistakes` | 获取错题列表 |
| AI评分 | `api.answers.getAIScore()` | `POST /api/v1/answers/:id/ai-score` | AI智能评分 |

### 3. 数据格式规范

#### 请求格式
```json
{
  "questionId": "string",
  "answerText": "string", 
  "timeSpent": 120,
  "metadata": {}
}
```

#### 响应格式
```json
{
  "success": true,
  "data": {}, 
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 开发环境配置

### 1. 前端开发服务器

```bash
# 启动前端 (Port: 3000)
npm run dev
```

**自动代理配置**:
- 所有 `/api` 请求自动代理到 `http://localhost:8080`
- 支持热重载和开发调试

### 2. 后端开发服务器

```bash
# 启动后端 (Port: 8080)  
cd backend-go
make dev
```

**开发特性**:
- Swagger API文档: `http://localhost:8080/swagger/index.html`
- 健康检查: `http://localhost:8080/health`
- 自动重载 (使用air工具)

### 3. 数据库配置

```yaml
# configs/config.dev.yaml
database:
  host: localhost
  port: 5432
  name: intelliview_star_dev
  user: postgres
  password: password

redis:
  host: localhost
  port: 6379
  password: ""
```

## Mock模式切换

### 当前状态
- **开发环境**: 默认启用Mock模式 (`enableMock: true`)
- **生产环境**: 连接真实后端API (`enableMock: false`)

### 切换方式

1. **配置文件切换** (`src/api/config.js`):
```javascript
const API_CONFIG = {
  development: {
    enableMock: false  // 改为false连接真实后端
  }
}
```

2. **环境变量切换**:
```bash
# .env.local
VITE_API_MOCK_ENABLED=false
```

## 部署配置

### 1. 前端构建

```bash
npm run build
# 生成 dist/ 目录，可部署到CDN或静态服务器
```

### 2. 后端部署

```bash
cd backend-go
make build
# 生成二进制文件，配置生产环境变量后启动
```

### 3. Docker部署

```bash
# 启动完整环境
docker-compose up -d

# 包含：前端Nginx、后端Go应用、PostgreSQL、Redis
```

## API扩展指南

### 1. 添加新的API端点

**前端步骤**:
1. 在 `src/api/config.js` 中添加端点定义
2. 在对应的service文件中实现API调用方法
3. 在 `src/api/index.js` 中导出新接口
4. 在stores中调用新API

**后端步骤**:
1. 在 `internal/model/` 中定义数据模型
2. 在 `internal/repository/` 中实现数据访问
3. 在 `internal/service/` 中实现业务逻辑
4. 在 `internal/handler/` 中实现HTTP处理器
5. 在 `cmd/server/main.go` 中添加路由

### 2. 数据类型同步

前后端使用相同的数据结构定义，确保类型安全：

**前端** (`src/types/index.js`):
```javascript
export const createQuestion = ({ id, text, difficulty, category }) => ({
  id, text, difficulty, category,
  createdAt: new Date().toISOString()
})
```

**后端** (`internal/model/question.go`):
```go
type Question struct {
    ID         string    `json:"id" gorm:"primaryKey"`
    Text       string    `json:"text" gorm:"not null"`
    Difficulty string    `json:"difficulty" gorm:"not null"`
    Category   string    `json:"category" gorm:"not null"`
    CreatedAt  time.Time `json:"createdAt"`
}
```

## 性能优化

### 1. 前端优化
- **代码分割**: Vue Router懒加载
- **状态管理**: Pinia轻量级状态管理
- **API缓存**: 合理的数据缓存策略
- **请求去重**: 防止重复API调用

### 2. 后端优化
- **数据库优化**: 索引和查询优化
- **Redis缓存**: 热点数据缓存
- **连接池**: 数据库连接复用
- **API限流**: 防止API滥用

## 监控与调试

### 1. 前端调试
- **浏览器DevTools**: Network面板查看API请求
- **Vue DevTools**: 查看组件状态和Pinia数据
- **控制台日志**: API调用过程日志

### 2. 后端监控
- **Swagger文档**: API接口测试
- **日志系统**: 结构化日志记录
- **健康检查**: 服务状态监控
- **性能指标**: Prometheus metrics

## 安全考虑

### 1. 认证授权
- **JWT Token**: 无状态身份验证
- **Token刷新**: 自动续期机制
- **权限控制**: 基于角色的访问控制

### 2. 数据安全
- **输入验证**: 前后端双重验证
- **SQL注入防护**: GORM参数化查询
- **XSS防护**: 前端输出编码
- **CORS配置**: 跨域请求控制

## 故障排查

### 常见问题

1. **API请求失败**
   - 检查后端服务是否启动 (`http://localhost:8080/health`)
   - 检查前端代理配置 (`vite.config.js`)
   - 查看浏览器Network面板

2. **认证错误**
   - 检查JWT Token是否正确设置
   - 确认Token未过期
   - 验证请求头格式

3. **数据不同步**
   - 检查前后端数据结构是否一致
   - 确认API响应格式正确
   - 验证状态管理更新逻辑

## 下一步计划

### 短期目标
- [ ] 完成Go后端核心模块实现
- [ ] 集成真实AI服务 (GPT/Claude)
- [ ] 添加用户认证系统
- [ ] 实现文件上传功能

### 长期目标
- [ ] 微服务架构拆分
- [ ] Kubernetes部署
- [ ] 监控告警系统
- [ ] 性能优化和扩容

---

**更新时间**: 2024年1月15日
**维护人员**: 开发团队
**文档版本**: v1.0 
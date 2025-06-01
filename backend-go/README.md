# IntelliView Star - Go 后端

## 项目概述

这是智面星项目的Go语言后端服务，提供RESTful API来支持前端Vue应用的所有功能。

## 技术栈

- **框架**: Gin Web Framework
- **数据库**: PostgreSQL (主数据库) + Redis (缓存)
- **ORM**: GORM
- **认证**: JWT Token
- **文件存储**: 七牛云/阿里云OSS (简历上传)
- **AI服务**: 集成大模型API (如ChatGPT/Claude/通义千问)
- **配置管理**: Viper
- **日志**: Zap
- **API文档**: Swagger
- **部署**: Docker + Docker Compose

## 项目结构

```
backend-go/
├── cmd/
│   └── server/
│       └── main.go              # 应用入口
├── internal/
│   ├── config/                  # 配置管理
│   ├── handler/                 # HTTP处理器
│   ├── service/                 # 业务逻辑层
│   ├── repository/              # 数据访问层
│   ├── model/                   # 数据模型
│   ├── middleware/              # 中间件
│   ├── utils/                   # 工具函数
│   └── ai/                      # AI服务集成
├── api/
│   └── swagger/                 # API文档
├── scripts/
│   ├── migration/               # 数据库迁移脚本
│   └── deploy/                  # 部署脚本
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── configs/
│   ├── config.yaml              # 配置文件
│   └── config.dev.yaml          # 开发环境配置
├── docs/                        # 项目文档
├── tests/                       # 测试文件
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## API设计

### 基础结构

```go
// 统一响应格式
type Response struct {
    Success   bool        `json:"success"`
    Data      interface{} `json:"data,omitempty"`
    Message   string      `json:"message"`
    Code      int         `json:"code"`
    Timestamp string      `json:"timestamp"`
}

// 分页响应
type PaginationResponse struct {
    Data       interface{} `json:"data"`
    Total      int64       `json:"total"`
    Page       int         `json:"page"`
    PageSize   int         `json:"pageSize"`
    TotalPages int         `json:"totalPages"`
}
```

### 核心API端点

#### 1. 认证模块 (`/api/v1/auth`)
- `POST /login` - 用户登录
- `POST /register` - 用户注册
- `POST /logout` - 用户登出
- `POST /refresh` - 刷新Token
- `GET /profile` - 获取用户信息

#### 2. 题目模块 (`/api/v1/questions`)
- `POST /generate` - 根据简历和JD生成题目
- `GET /` - 获取题目列表 (支持分页、筛选)
- `GET /:id` - 获取题目详情
- `GET /categories` - 获取题目分类
- `POST /search` - 搜索题目
- `POST /export` - 批量导出题目

#### 3. 答题模块 (`/api/v1/answers`)
- `POST /` - 提交答案
- `POST /:id/ai-score` - AI评分
- `GET /history` - 获取答题历史
- `GET /statistics` - 获取答题统计

#### 4. 用户功能模块
- 收藏: `/api/v1/favorites`
- 错题本: `/api/v1/mistakes` 
- 练习集: `/api/v1/practice-sets`

#### 5. 模拟面试模块 (`/api/v1/mock-interview`)
- `POST /` - 开始模拟面试
- `POST /:sessionId/answers` - 提交面试答案
- `POST /:sessionId/end` - 结束面试
- `GET /:sessionId/report` - 获取面试报告

#### 6. 文件上传 (`/api/v1/upload`)
- `POST /resume` - 上传简历
- `POST /export` - 导出文件

#### 7. 统计分析 (`/api/v1/statistics`)
- `GET /overview` - 总览统计
- `GET /category` - 分类统计
- `GET /progress` - 进度统计
- `GET /activity` - 活跃度统计

## 数据模型

### 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 题目表 (questions)
```sql
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    text TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    reference_answer TEXT,
    resources JSONB,
    follow_ups JSONB,
    tags JSONB,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 答案表 (answers)
```sql
CREATE TABLE answers (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    question_id VARCHAR(50) REFERENCES questions(id),
    answer_text TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    ai_feedback JSONB,
    is_correct BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP DEFAULT NOW()
);
```

## 快速开始

### 环境要求
- Go 1.21+
- PostgreSQL 13+
- Redis 6+

### 安装和运行

1. **克隆项目**
```bash
git clone <repository-url>
cd intelliview-star/backend-go
```

2. **安装依赖**
```bash
go mod download
```

3. **配置环境**
```bash
cp configs/config.yaml.example configs/config.yaml
# 编辑配置文件，设置数据库和其他服务配置
```

4. **数据库迁移**
```bash
make migrate-up
```

5. **启动服务**
```bash
# 开发模式
make dev

# 生产模式
make build && ./bin/server
```

### Docker部署

```bash
# 使用Docker Compose启动所有服务
docker-compose up -d

# 仅启动应用
docker build -f docker/Dockerfile -t intelliview-star-api .
docker run -p 8080:8080 intelliview-star-api
```

## 开发指南

### Make命令

```bash
make dev          # 开发模式启动
make build        # 编译应用
make test         # 运行测试
make lint         # 代码检查
make clean        # 清理构建文件
make migrate-up   # 数据库迁移
make migrate-down # 回滚迁移
make swagger      # 生成API文档
```

### 环境变量

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=intelliview_star
DB_USER=postgres
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRE_HOURS=72

# AI服务配置
AI_PROVIDER=openai  # openai/claude/tongyi
AI_API_KEY=your-ai-api-key
AI_MODEL=gpt-3.5-turbo

# 文件存储配置
OSS_PROVIDER=qiniu  # qiniu/aliyun
OSS_ACCESS_KEY=your-access-key
OSS_SECRET_KEY=your-secret-key
OSS_BUCKET=intelliview-star
```

## API接口规范

### 请求格式
- Content-Type: `application/json`
- Authorization: `Bearer <jwt-token>` (需要认证的接口)

### 响应格式
```json
{
  "success": true,
  "data": {}, 
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 错误码定义
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器内部错误

## 部署说明

### 生产环境部署

1. **配置生产环境变量**
2. **构建Docker镜像**
3. **使用Kubernetes/Docker Swarm部署**
4. **配置负载均衡和反向代理**
5. **设置监控和日志收集**

### 健康检查

- 健康检查端点: `GET /health`
- 指标端点: `GET /metrics` (Prometheus格式)

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](../LICENSE) 文件 
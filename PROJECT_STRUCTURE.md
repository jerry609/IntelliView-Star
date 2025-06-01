# 智面星 Vue 3 项目结构

## 📁 项目目录结构

```
intelliview-star/
├── public/                          # 静态资源
├── src/                            # 源代码目录
│   ├── components/                 # 可复用组件
│   │   ├── layout/                # 布局组件
│   │   │   └── AppHeader.vue      # 应用头部
│   │   ├── ui/                    # UI基础组件
│   │   │   ├── ThemeToggle.vue    # 主题切换按钮
│   │   │   ├── Toast.vue          # 提示消息
│   │   │   ├── Spinner.vue        # 加载动画
│   │   │   ├── FileUpload.vue     # 文件上传
│   │   │   └── MarkdownEditor.vue # Markdown编辑器
│   │   ├── questions/             # 题目相关组件
│   │   │   ├── QuestionCard.vue   # 题目卡片
│   │   │   ├── QuestionFilters.vue # 题目筛选
│   │   │   ├── QuestionNav.vue    # 题目导航
│   │   │   └── CustomSetsList.vue # 自定义练习集列表
│   │   └── modals/                # 模态框组件
│   │       ├── CreateSetModal.vue # 创建练习集
│   │       └── AddToSetModal.vue  # 添加到练习集
│   ├── views/                     # 页面视图组件
│   │   ├── MainMenu.vue           # 主菜单
│   │   ├── StandardPractice.vue   # 标准练习布局
│   │   ├── MockInterview.vue      # 模拟面试
│   │   ├── Statistics.vue         # 统计页面
│   │   └── practice/              # 标准练习子页面
│   │       ├── PracticeInput.vue  # 输入简历和JD
│   │       ├── PracticeLoading.vue # 加载页面
│   │       ├── QuestionsList.vue  # 题目列表
│   │       └── AnswerView.vue     # 答题界面
│   ├── stores/                    # Pinia状态管理
│   │   ├── theme.js              # 主题状态
│   │   ├── questions.js          # 题目数据状态
│   │   ├── ui.js                 # UI状态 (toast, modal等)
│   │   ├── stats.js              # 统计数据状态
│   │   └── mockInterview.js      # 模拟面试状态
│   ├── router/                    # 路由配置
│   │   └── index.js              # 路由定义
│   ├── utils/                     # 工具函数
│   │   ├── mockData.js           # 模拟数据生成
│   │   ├── helpers.js            # 通用工具函数
│   │   └── storage.js            # 本地存储封装
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 应用入口
│   └── style.css                 # 全局样式
├── index.html                     # HTML模板
├── package.json                   # 项目配置
├── vite.config.js                # Vite配置
├── tailwind.config.js            # Tailwind配置
├── postcss.config.js             # PostCSS配置
└── README.md                     # 项目说明
```

## 🏗️ 架构设计

### 状态管理 (Pinia)
- **theme.js**: 主题切换、深色/浅色模式
- **questions.js**: 题目数据、收藏、错题、自定义练习集
- **ui.js**: 全局UI状态，如Toast提示、Modal显示
- **stats.js**: 练习统计数据
- **mockInterview.js**: 模拟面试状态管理

### 路由结构
```
/ (MainMenu)                        # 主菜单
/standard-practice                  # 标准练习模式
  ├── / (PracticeInput)            # 输入页面
  ├── /loading (PracticeLoading)    # 加载页面
  ├── /questions (QuestionsList)    # 题目列表
  └── /answer/:questionId (AnswerView) # 答题页面
/mock-interview                     # 模拟面试
/statistics                        # 练习统计
```

### 组件设计原则
1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: UI组件设计为可复用
3. **组合式API**: 使用Vue 3 Composition API
4. **响应式设计**: 适配不同屏幕尺寸
5. **类型安全**: 使用JSDoc注释增强代码可读性

### 样式组织
- **全局样式**: `src/style.css` 包含CSS变量和基础样式
- **Tailwind CSS**: 用于快速样式开发
- **CSS变量**: 支持主题切换的动态样式

### 数据流
```
User Action → Component → Store Action → State Change → UI Update
```

## 🚀 开发指南

### 环境搭建
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 组件开发规范
1. 使用 `<script setup>` 语法
2. Props使用TypeScript或JSDoc定义类型
3. 事件使用 `defineEmits`
4. 导出使用 `defineExpose` (如需要)
5. 样式使用Tailwind CSS + 自定义CSS变量

### 状态管理规范
1. Store使用组合式函数模式
2. 复杂计算使用 `computed`
3. 异步操作在actions中处理
4. 状态持久化使用localStorage

### 代码提交规范
- feat: 新功能
- fix: 修复bug
- refactor: 重构
- style: 样式更新
- docs: 文档更新

## 📝 待实现功能

### 高优先级
- [ ] 完善所有Vue组件
- [ ] 实现本地数据持久化
- [ ] 优化移动端适配
- [ ] 添加键盘快捷键支持

### 中优先级
- [ ] 集成真实AI API
- [ ] 添加更多题目模板
- [ ] 实现数据导入导出
- [ ] 添加用户引导功能

### 低优先级
- [ ] PWA支持
- [ ] 多语言支持
- [ ] 主题自定义
- [ ] 插件系统 
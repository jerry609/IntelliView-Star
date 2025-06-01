# 智面星 (IntelliView Star) Vue 3 版本 🌟
## AI 驱动的智能面试题生成与练习平台

---

## 🚀 项目简介

这是"智面星"项目的Vue 3重构版本，采用现代化的前端架构和开发模式。该版本将原本的单文件HTML项目重构为模块化的Vue 3应用，提供更好的可维护性、可扩展性和开发体验。

### 技术升级亮点
- ✅ **Vue 3 + Composition API**: 更好的逻辑复用和类型推导
- ✅ **Pinia 状态管理**: 轻量级、类型安全的状态管理方案
- ✅ **Vue Router 4**: 现代化的路由管理
- ✅ **Vite 构建工具**: 极速的开发体验和优化的生产构建
- ✅ **模块化架构**: 清晰的文件组织和组件拆分
- ✅ **响应式设计**: 更好的移动端适配

---

## 🛠️ 技术栈

**前端框架**
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)

**构建工具**
- Vite 5
- Tailwind CSS 3
- PostCSS

**开发工具**
- ESLint (代码规范)
- Marked.js (Markdown渲染)
- File-saver (文件导出)

---

## 📁 项目结构

```
src/
├── components/              # 可复用组件
│   ├── layout/             # 布局组件
│   ├── ui/                 # UI基础组件
│   ├── questions/          # 题目相关组件
│   └── modals/             # 模态框组件
├── views/                  # 页面视图组件
│   ├── practice/           # 标准练习子页面
│   └── ...
├── stores/                 # Pinia状态管理
├── router/                 # 路由配置
├── utils/                  # 工具函数
└── style.css              # 全局样式
```

详细结构请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm >= 7

### 方式一：使用启动脚本（推荐）

**Windows用户:**
```bash
# 双击运行或在命令行执行
start.bat
```

**Linux/macOS用户:**
```bash
# 添加执行权限并运行
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 在浏览器中打开 http://localhost:3000
```

### 构建生产版本
```bash
npm run build
```

---

## ✨ 功能特性

### 🎯 智能题目生成
- 基于简历PDF和岗位JD的AI分析（原型中为模拟数据）
- 多分类、多难度的技术面试题生成
- 实时题目筛选和分类浏览

### 📝 多样化练习模式
- **标准练习**: 逐题作答，AI评分反馈，参考答案对比
- **AI追问**: 智能追问机制，模拟真实面试深度交流
- **模拟面试**: 角色化、计时的沉浸式面试体验
- **自定义练习集**: 个性化题目组合和专项训练

### 🔧 学习辅助工具
- **智能收藏**: 一键收藏重要题目，便于复习
- **错题本**: 自动记录低分题目，支持掌握度标记
- **Markdown编辑器**: 支持格式化答案输入和预览
- **练习计时器**: 辅助时间管理和答题节奏

### 📊 数据可视化
- **练习统计**: 详细的学习数据分析和进度追踪
- **掌握度分析**: 各知识点的掌握情况可视化
- **学习轨迹**: 练习历史和成长曲线展示

### 🎨 用户体验
- **响应式设计**: 完美适配桌面端和移动端
- **深色/浅色主题**: 护眼模式和个性化外观
- **流畅动画**: 现代化的交互动效
- **快捷键支持**: 提高操作效率

---

## 🏗️ 架构设计

### 组件化设计
```
App.vue
├── AppHeader.vue (全局头部)
├── Router View (页面内容)
│   ├── MainMenu.vue
│   ├── StandardPractice.vue
│   │   ├── PracticeInput.vue
│   │   ├── QuestionsList.vue
│   │   └── AnswerView.vue
│   ├── MockInterview.vue
│   └── Statistics.vue
├── Toast.vue (全局提示)
└── Modals/ (全局模态框)
```

### 状态管理
```javascript
// stores/
theme.js        // 主题状态
questions.js    // 题目数据、收藏、错题、练习集
ui.js          // UI状态（Toast、Modal等）
stats.js       // 统计数据
mockInterview.js // 模拟面试状态
```

### 路由设计
```
/                           # 主菜单
/standard-practice         # 标准练习
  ├── /                   # 输入页面
  ├── /loading            # 加载页面  
  ├── /questions          # 题目列表
  └── /answer/:questionId # 答题页面
/mock-interview           # 模拟面试
/statistics              # 练习统计
```

---

## 🔮 开发计划

### Phase 1: 核心功能完善 ✅
- [x] Vue 3项目架构搭建
- [x] 基础组件开发
- [x] 状态管理设计
- [x] 路由配置
- [ ] 所有页面组件开发

### Phase 2: 功能增强
- [ ] 本地数据持久化
- [ ] 键盘快捷键支持
- [ ] 更多题目模板
- [ ] 拖拽排序功能

### Phase 3: AI集成
- [ ] 真实AI API集成
- [ ] 智能题目生成
- [ ] 语义化答案评分
- [ ] 个性化推荐

### Phase 4: 高级功能
- [ ] PWA支持
- [ ] 多语言国际化
- [ ] 主题自定义
- [ ] 社区功能

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发规范
1. 使用Vue 3 Composition API
2. 遵循ESLint代码规范
3. 组件名使用PascalCase
4. 文件名使用kebab-case
5. 提交信息使用约定式提交

### 提交类型
- `feat`: 新功能
- `fix`: 修复bug
- `refactor`: 重构
- `style`: 样式更新
- `docs`: 文档更新
- `test`: 测试相关

---

## 📄 许可证

本项目采用 MIT License 开源许可。

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

如果这个项目对您有帮助，请不要忘记给个⭐Star⭐！

---

**联系方式**
- GitHub Issues: [提交问题和建议](https://github.com/your-username/intelliview-star/issues)
- 邮箱: your-email@example.com

**相关链接**
- [原始HTML版本](./demo.html)
- [项目架构文档](./PROJECT_STRUCTURE.md)
- [更新日志](./CHANGELOG.md) 
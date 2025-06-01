#!/bin/bash

echo "🌟 智面星 Vue 3 项目启动脚本"
echo "================================"

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js (建议版本 >= 16)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查是否安装了npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 检查是否存在node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已存在"
fi

echo ""
echo "🚀 启动开发服务器..."
echo "项目将在 http://localhost:3000 打开"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev 
@echo off
chcp 65001 >nul
cls

echo 🌟 智面星 Vue 3 项目启动脚本
echo ================================

:: 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js (建议版本 ^>= 16^)
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version

:: 检查是否安装了npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm
    pause
    exit /b 1
)

echo ✅ npm 版本:
npm --version

:: 检查是否存在node_modules
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已存在
)

echo.
echo 🚀 启动开发服务器...
echo 项目将在 http://localhost:3000 打开
echo.
echo 按 Ctrl+C 停止服务器
echo.

:: 启动开发服务器
call npm run dev

pause 
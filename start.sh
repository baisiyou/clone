#!/bin/bash

# 声音克隆智能对话应用启动脚本

echo "🎙️  声音克隆智能对话应用启动脚本"
echo "=================================="
echo ""

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "📝 正在创建 .env 文件..."
    cat > .env << EOF
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=

# Google Gemini API Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
EOF
    echo "✅ .env 文件已创建，请编辑它并填入你的 API 密钥"
    echo ""
    echo "📖 获取 API 密钥："
    echo "   - ElevenLabs: https://elevenlabs.io/"
    echo "   - Google Gemini: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "按 Enter 键继续安装依赖..."
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装后端依赖..."
    npm install
    echo ""
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 正在安装前端依赖..."
    cd client
    npm install
    cd ..
    echo ""
fi

echo "✅ 依赖安装完成！"
echo ""
echo "🚀 启动应用..."
echo "   后端服务: http://localhost:3001"
echo "   前端应用: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 启动应用
npm run dev


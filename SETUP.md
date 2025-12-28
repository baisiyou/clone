# 快速设置指南

## 第一步：获取 API 密钥

### 1. ElevenLabs API 密钥

1. 访问 https://elevenlabs.io/
2. 注册/登录账号
3. 进入 **Profile** → **API Keys**
4. 点击 **"Create API Key"**
5. 复制生成的密钥

### 2. Google Gemini API 密钥

1. 访问 https://makersuite.google.com/app/apikey
2. 使用 Google 账号登录
3. 点击 **"Create API Key"**
4. 选择或创建 Google Cloud 项目
5. 复制生成的密钥

## 第二步：配置项目

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
touch .env
```

### 2. 填入配置信息

编辑 `.env` 文件，填入以下内容：

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=sk-你的elevenlabs密钥

# 可选：如果你已经有一个克隆的声音ID，可以填入
# ELEVENLABS_VOICE_ID=your_voice_id_here

# Google Gemini API Configuration
GOOGLE_AI_API_KEY=你的google_ai_api密钥

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## 第三步：安装依赖

```bash
# 安装所有依赖（后端 + 前端）
npm run install-all
```

或者分别安装：

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

## 第四步：启动应用

### 开发模式（推荐）

同时启动前后端：

```bash
npm run dev
```

或者分别启动：

```bash
# 终端 1：启动后端
npm run server

# 终端 2：启动前端
npm run client
```

### 访问应用

- 前端：http://localhost:3000
- 后端 API：http://localhost:3001

## 第五步：使用应用

### 1. 克隆第一个声音

1. 准备一个清晰的语音样本（1-5 分钟，MP3/WAV 格式）
2. 在左侧"克隆声音"区域上传音频文件
3. 输入声音名称（如"爸爸的声音"）
4. 点击"开始克隆"
5. 等待处理完成

### 2. 开始对话

1. 确保已选择克隆的声音
2. 在对话框输入消息
3. 点击"发送"或按 Enter
4. 等待 AI 回复，点击"🔊 播放"听语音回复

## 验证安装

### 检查后端服务

访问 http://localhost:3001/api/health

应该看到：
```json
{
  "status": "ok",
  "message": "Voice Clone API is running"
}
```

### 测试 API

```bash
# 列出可用声音（需要先克隆一个）
curl http://localhost:3001/api/voice/list \
  -H "Content-Type: application/json"
```

## 常见问题

### 问题 1：npm install 失败

**解决方案：**
- 确保 Node.js 版本 >= 16
- 清除 npm 缓存：`npm cache clean --force`
- 删除 node_modules 重新安装

### 问题 2：端口被占用

**解决方案：**
- 修改 `.env` 中的 `PORT` 值
- 或关闭占用端口的进程

### 问题 3：API 密钥无效

**解决方案：**
- 检查 `.env` 文件中的密钥是否正确
- 确认没有多余的空格或引号
- 重新生成 API 密钥

### 问题 4：CORS 错误

**解决方案：**
- 确认 `CLIENT_URL` 在 `.env` 中设置为 `http://localhost:3000`
- 重启服务器

## 下一步

- 查看 [README.md](./README.md) 了解完整功能
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署选项
- 开始克隆声音并与 AI 对话！


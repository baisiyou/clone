# 🎙️ 声音克隆智能对话应用

一个整合 **ElevenLabs（声音克隆 + 语音合成）** 和 **Google Cloud AI（Gemini 对话模型）** 的完整语音交互应用。

## ✨ 功能特性

- 🎤 **声音克隆**：上传亲人语音样本，生成专属声音模型
- 💬 **智能对话**：使用 Google Gemini 进行自然语言对话
- 🔊 **语音合成**：将 AI 回复转换为克隆声音的语音
- 🎨 **现代 UI**：美观易用的 React 前端界面
- 🔄 **实时交互**：支持文字和语音输入

## 🏗️ 技术架构

### 后端
- **Node.js + Express**：RESTful API 服务
- **ElevenLabs API**：声音克隆和语音合成
- **Google Gemini API**：智能对话生成

### 前端
- **React**：用户界面
- **Axios**：API 请求
- **Web APIs**：语音录制和播放

## 💰 费用说明

⚠️ **重要**: 此应用使用两个付费 API 服务：

- **ElevenLabs**: 提供免费额度（每月 10,000 字符），付费计划从 $5/月起
- **Google Gemini**: 提供免费额度（每天 1,500 次请求），按使用量付费

📖 详细费用说明请查看 [PRICING.md](./PRICING.md)

**快速参考**:
- 轻度使用（测试）：**$0/月**（使用免费额度）
- 中等使用：**约 $5-22/月**
- 重度使用：**约 $33+/月**

---

## 📦 安装步骤

### 1. 克隆项目并安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

或者使用一键安装：

```bash
npm run install-all
```

### 2. 配置 API 密钥

复制环境变量示例文件并填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入以下信息：

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_cloned_voice_id_here  # 可选，可在应用内克隆后使用

# Google Gemini API Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 3. 获取 API 密钥

#### ElevenLabs API
1. 访问 [ElevenLabs](https://elevenlabs.io/)
2. 注册账号并登录
3. 进入 Profile → API Keys
4. 创建新的 API 密钥
5. 将密钥填入 `.env` 文件

#### Google Gemini API
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用 Google 账号登录
3. 点击 "Create API Key"
4. 将生成的 API 密钥填入 `.env` 文件

## 🚀 运行应用

### 开发模式（同时运行前后端）

```bash
npm run dev
```

或者分别运行：

```bash
# 终端 1：启动后端服务
npm run server

# 终端 2：启动前端服务
npm run client
```

- 后端服务：http://localhost:3001
- 前端应用：http://localhost:3000

### 生产模式

```bash
# 构建前端
npm run build

# 启动后端（前端已构建）
npm run server
```

## 📖 使用指南

### 1. 克隆声音

1. 在左侧"克隆声音"区域
2. 输入声音名称（可选）
3. 选择音频文件（建议 1-5 分钟清晰录音，支持 MP3、WAV 等格式）
4. 点击"开始克隆"
5. 等待处理完成，系统会自动选择新克隆的声音

### 2. 开始对话

1. 确保已选择或克隆了一个声音
2. 在对话界面输入消息
3. 点击"发送"或按 Enter 键
4. AI 会用克隆的声音回复你
5. 点击"🔊 播放"按钮可重复播放语音回复

### 3. 管理声音

- 在"可用声音"列表中查看所有克隆的声音
- 点击声音卡片切换使用的声音
- 点击删除按钮移除不需要的声音

## 🔌 API 接口

### 声音相关

#### 克隆声音
```
POST /api/voice/clone
Content-Type: multipart/form-data

Body:
- audio: 音频文件
- name: 声音名称（可选）
- description: 声音描述（可选）
```

#### 列出所有声音
```
GET /api/voice/list
```

#### 合成语音
```
POST /api/voice/synthesize

Body:
{
  "text": "要合成的文本",
  "voiceId": "声音ID（可选）",
  "stability": 0.5,
  "similarityBoost": 0.75
}
```

#### 删除声音
```
DELETE /api/voice/:voiceId
```

### 对话相关

#### 语音对话（带语音回复）
```
POST /api/chat/voice-chat

Body:
{
  "message": "用户消息",
  "voiceId": "声音ID（可选）",
  "conversationHistory": []
}

Response:
{
  "success": true,
  "text": "AI回复文本",
  "audio": "base64编码的音频",
  "conversationHistory": [...]
}
```

#### 文本对话（仅文本回复）
```
POST /api/chat/text-chat

Body:
{
  "message": "用户消息",
  "conversationHistory": []
}
```

## 🛠️ 项目结构

```
sound-clone-voice-chat/
├── server/                 # 后端代码
│   ├── index.js           # Express 服务器入口
│   ├── routes/            # API 路由
│   │   ├── voice.js       # 声音相关路由
│   │   └── chat.js        # 对话相关路由
│   └── services/          # 业务逻辑服务
│       ├── voiceService.js    # ElevenLabs 集成
│       └── chatService.js     # Google Gemini 集成
├── client/                # 前端代码
│   ├── public/
│   ├── src/
│   │   ├── App.js         # 主应用组件
│   │   ├── components/    # React 组件
│   │   │   ├── VoiceCloneUpload.js
│   │   │   ├── ChatInterface.js
│   │   │   └── VoiceList.js
│   │   └── index.js
│   └── package.json
├── .env.example           # 环境变量示例
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ 配置说明

### ElevenLabs 参数

- `stability` (0-1)：语音稳定性，值越高越稳定但可能缺乏情感
- `similarityBoost` (0-1)：相似度增强，值越高越接近原声
- `style` (0-1)：风格化程度
- `useSpeakerBoost`：是否使用说话人增强

### Gemini 模型

当前使用 `gemini-pro` 模型，你可以在 `server/services/chatService.js` 中修改为其他可用模型。

## 🔒 安全注意事项

1. **不要提交 `.env` 文件到版本控制**
2. **API 密钥要妥善保管**，不要泄露
3. **生产环境建议使用环境变量管理密钥**
4. **建议设置 CORS 白名单**限制前端访问来源

## 🐛 常见问题

### 1. API 密钥无效
- 检查 `.env` 文件中的密钥是否正确
- 确认 API 密钥是否过期
- 检查 ElevenLabs 账号是否有足够的配额

### 2. 声音克隆失败
- 确保音频文件格式正确（MP3、WAV 等）
- 文件大小不超过 10MB
- 音频质量清晰，建议 1-5 分钟长度

### 3. 语音合成失败
- 确认已设置默认 `ELEVENLABS_VOICE_ID` 或在请求中提供
- 检查文本长度限制
- 验证声音 ID 是否有效

### 4. 对话无响应
- 检查 Google Gemini API 密钥配置
- 查看服务器控制台错误信息
- 确认网络连接正常

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请提交 Issue。

---

**享受与 AI 克隆声音的对话体验！** 🎉


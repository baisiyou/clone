# API 密钥获取指南

## 🔑 需要的 API 密钥

本项目需要两个 API 密钥：

1. **ELEVENLABS_API_KEY** - ElevenLabs 语音克隆服务
2. **GOOGLE_AI_API_KEY** - Google Gemini AI 对话服务

---

## 📝 获取方式

### 1. ElevenLabs API 密钥

1. **访问 ElevenLabs 官网**
   - 网址：https://elevenlabs.io/
   - 点击右上角注册/登录

2. **进入 API Keys 页面**
   - 登录后，点击右上角头像
   - 选择 **Profile**（个人资料）
   - 在左侧菜单中找到 **API Keys**

3. **创建 API 密钥**
   - 点击 **"Create API Key"** 按钮
   - 输入一个名称（如：voice-clone-app）
   - 点击确认
   - **复制生成的密钥**（格式类似：sk-xxxxxxxxxxxxx）

4. **保存密钥**
   - ⚠️ **重要**：密钥只显示一次，请立即保存
   - 如果丢失，需要删除旧密钥并创建新的

**免费额度**：
- 每月 10,000 字符免费
- 付费计划从 $5/月起

---

### 2. Google Gemini API 密钥

1. **访问 Google AI Studio**
   - 网址：https://makersuite.google.com/app/apikey
   - 或访问：https://aistudio.google.com/app/apikey
   - 使用 Google 账号登录

2. **创建 API 密钥**
   - 点击 **"Create API Key"** 按钮
   - 选择或创建一个 Google Cloud 项目
   - 点击 **"Create API Key in new project"** 或使用现有项目
   - **复制生成的密钥**（格式类似：AIzaSyxxxxxxxxxxxxxxxxxxxxx）

3. **保存密钥**
   - ⚠️ **重要**：妥善保管密钥，不要泄露

**免费额度**：
- 每分钟最多 15 次请求
- 每天最多 1,500 次请求
- 完全免费使用（Gemini Pro 模型）

---

## ⚙️ 配置密钥

### 本地开发配置

1. **创建 `.env` 文件**
   在项目根目录创建 `.env` 文件：

   ```bash
   # 在项目根目录执行
   touch .env
   ```

2. **编辑 `.env` 文件**

   使用任何文本编辑器打开 `.env` 文件，填入以下内容：

   ```env
   # ElevenLabs API Configuration
   ELEVENLABS_API_KEY=sk-你的elevenlabs密钥
   
   # Google Gemini API Configuration
   GOOGLE_AI_API_KEY=AIzaSy你的google_ai密钥
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   CLIENT_URL=http://localhost:3000
   ```

   **示例**：
   ```env
   ELEVENLABS_API_KEY=sk-abc123def456ghi789
   GOOGLE_AI_API_KEY=AIzaSy1234567890abcdefghijklmnop
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **保存文件**
   - 确保没有多余的空格或引号
   - 确保密钥正确复制（没有换行）

---

### Render 部署配置

在 Render Dashboard 中配置环境变量：

1. **登录 Render**
   - 访问 https://render.com
   - 使用 GitHub 账号登录

2. **进入服务设置**
   - 选择你的后端服务（如 `clone-backend`）
   - 点击左侧菜单 **Environment**

3. **添加环境变量**
   点击 **"Add Environment Variable"**，添加以下变量：

   ```
   Key: ELEVENLABS_API_KEY
   Value: sk-你的elevenlabs密钥
   ```

   ```
   Key: GOOGLE_AI_API_KEY
   Value: AIzaSy你的google_ai密钥
   ```

   ```
   Key: CLIENT_URL
   Value: https://baisiyou.github.io
   ```

   ```
   Key: NODE_ENV
   Value: production
   ```

   ```
   Key: PORT
   Value: 10000
   ```

4. **保存并重新部署**
   - 保存所有环境变量
   - Render 会自动重新部署服务

---

## ✅ 验证配置

### 本地开发验证

启动服务器后，访问：
```
http://localhost:3001/api/health
```

如果返回：
```json
{
  "status": "ok",
  "message": "Voice Clone API is running"
}
```

说明服务器正常启动。如果 API 密钥有问题，会在具体使用时（如克隆声音、AI 对话）出现错误。

### Render 部署验证

访问：
```
https://your-render-backend-url.onrender.com/api/health
```

---

## 🔒 安全提示

1. **不要提交 `.env` 文件**
   - `.env` 文件已添加到 `.gitignore`
   - 确保不要将 `.env` 提交到 Git

2. **不要泄露 API 密钥**
   - 不要在代码中硬编码密钥
   - 不要在公开场合分享密钥
   - 如果密钥泄露，立即删除并创建新的

3. **定期检查使用量**
   - ElevenLabs：在 Profile → Usage 查看
   - Google AI：在 Google Cloud Console 查看

---

## ❓ 常见问题

### Q: 密钥无效怎么办？
A: 
1. 检查是否有多余的空格或换行
2. 确认密钥是否正确复制
3. 尝试重新创建密钥

### Q: 本地可以运行，但 Render 上不行？
A: 
1. 检查 Render 环境变量是否正确设置
2. 确保环境变量名称完全匹配（区分大小写）
3. 查看 Render 日志了解具体错误

### Q: 免费额度用完了怎么办？
A: 
1. ElevenLabs：等待下个月重置或升级付费计划
2. Google AI：通常免费额度足够使用，如有需要可查看计费信息

---

更多帮助请查看：
- [SETUP.md](./SETUP.md) - 本地开发设置
- [DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md) - 部署指南
- [README.md](./README.md) - 项目说明


# 快速部署指南

## GitHub Pages + Render 部署

### 前置条件
- GitHub 账号
- Render 账号（可使用 GitHub 登录）
- ElevenLabs API 密钥
- Google Gemini API 密钥

---

## 步骤 1: 部署后端到 Render

1. **访问 Render Dashboard**
   - https://render.com
   - 使用 GitHub 登录

2. **创建 Web Service**
   - 点击 "New" → "Web Service"
   - 连接仓库 `baisiyou/clone`

3. **配置服务**
   ```
   Name: clone-backend
   Environment: Node
   Region: Singapore (或选择其他)
   Branch: main
   Build Command: npm install
   Start Command: node server/index.js
   ```

4. **添加环境变量**
   ```
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://baisiyou.github.io
   ELEVENLABS_API_KEY=your_key_here
   GOOGLE_AI_API_KEY=your_key_here
   ```

5. **创建服务并等待部署完成**
   - 记录后端 URL，例如：`https://clone-backend-xxxx.onrender.com`

---

## 步骤 2: 配置前端部署

1. **在 GitHub 仓库启用 Pages**
   - Settings → Pages
   - Source: "GitHub Actions"

2. **配置 API URL（选择一种方式）**

   **方式 A: 使用 GitHub Secrets（推荐）**
   - Settings → Secrets and variables → Actions → New repository secret
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-render-backend-url.onrender.com/api`
   - 注意：URL 必须以 `/api` 结尾

   **方式 B: 直接修改 workflow 文件**
   - 编辑 `.github/workflows/deploy.yml`
   - 修改 `REACT_APP_API_URL` 的默认值

3. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "Configure deployment"
   git push origin main
   ```

4. **查看部署状态**
   - GitHub → Actions 标签页
   - 等待部署完成（约 2-3 分钟）

5. **访问前端**
   - URL: https://baisiyou.github.io/clone

---

## 验证部署

### 检查后端
```bash
curl https://your-render-backend-url.onrender.com/api/health
```
应该返回：`{"status":"ok","message":"Voice Clone API is running"}`

### 检查前端
- 打开 https://baisiyou.github.io/clone
- 打开浏览器开发者工具（F12）
- 查看 Console 是否有错误
- 尝试克隆一个语音测试功能

---

## 故障排查

### CORS 错误
- 确保 Render 后端 `CLIENT_URL` = `https://baisiyou.github.io`（不包含 `/clone`）

### 前端无法连接后端
- 检查 `REACT_APP_API_URL` 是否正确
- 确保 URL 以 `/api` 结尾
- 检查后端是否正常运行

### Render 服务休眠（Free 计划）
- Free 计划服务 15 分钟无活动后会休眠
- 首次访问需要等待 30 秒左右唤醒
- 可考虑升级到付费计划

---

## 后续更新

每次推送代码到 main 分支时：
- GitHub Actions 会自动重新部署前端
- Render 会自动重新部署后端

更新环境变量：
- Render: Dashboard → 服务 → Environment
- GitHub: Settings → Secrets → Actions


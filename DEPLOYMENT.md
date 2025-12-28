# 部署指南

## 本地开发部署

### 前置要求

- Node.js 16+ 和 npm
- ElevenLabs API 密钥
- Google Gemini API 密钥

### 快速开始

1. **安装依赖**
   ```bash
   npm run install-all
   ```

2. **配置环境变量**
   
   创建 `.env` 文件：
   ```bash
   # 复制示例文件（如果存在）
   cp .env.example .env
   
   # 或手动创建 .env 文件，内容如下：
   ```
   
   ```env
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ELEVENLABS_VOICE_ID=your_cloned_voice_id_here
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **启动应用**
   ```bash
   npm run dev
   ```

   这将同时启动：
   - 后端服务：http://localhost:3001
   - 前端应用：http://localhost:3000

## Google Cloud Functions 部署

### 准备工作

1. 安装 Google Cloud CLI
2. 配置 Google Cloud 项目
3. 启用 Cloud Functions API

### 部署步骤

1. **构建前端**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **创建部署配置文件**

   创建 `server.js`（适用于 Cloud Functions）：
   ```javascript
   const functions = require('@google-cloud/functions-framework');
   const server = require('./server/index');
   
   functions.http('voiceCloneAPI', server);
   ```

3. **部署函数**
   ```bash
   gcloud functions deploy voiceCloneAPI \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars ELEVENLABS_API_KEY=xxx,GOOGLE_AI_API_KEY=xxx
   ```

## Docker 部署

### 创建 Dockerfile

```dockerfile
# 后端 Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server/ ./server/

EXPOSE 3001

CMD ["node", "server/index.js"]
```

```dockerfile
# 前端 Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

FROM nginx:alpine
COPY --from=build /app/client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
      - PORT=3001
      - CLIENT_URL=http://localhost:3000
    volumes:
      - ./server:/app/server

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

运行：
```bash
docker-compose up -d
```

## Vercel 部署（前端）

1. 安装 Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. 构建前端
   ```bash
   cd client
   npm run build
   ```

3. 部署
   ```bash
   vercel
   ```

## GitHub Pages + Render 部署（推荐）

本项目使用 GitHub Pages 部署前端，Render 部署后端。

### 前端部署到 GitHub Pages

#### 方式一：使用 GitHub Actions（推荐，已配置）

项目已配置自动部署工作流。只需：

1. **在 GitHub 仓库中启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **配置前端 API 地址（可选）**
   - 如果后端已部署到 Render，在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-render-backend-url.onrender.com/api`
   - 如果不设置，需要在 GitHub Actions workflow 文件中手动修改 `REACT_APP_API_URL` 环境变量

3. **推送代码到 main/master 分支**
   ```bash
   git push origin main
   ```
   - GitHub Actions 会自动构建并部署到 GitHub Pages
   - 部署完成后，前端地址为：`https://baisiyou.github.io/clone`

#### 方式二：手动部署

```bash
cd client
npm install
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api npm run build
# 然后手动将 build 目录内容推送到 gh-pages 分支
```

### 后端部署到 Render

1. **登录 Render**
   - 访问 https://render.com
   - 使用 GitHub 账号登录

2. **创建新的 Web Service**
   - 点击 "New" → "Web Service"
   - 连接 GitHub 仓库 `baisiyou/clone`

3. **配置服务**
   - **Name**: `clone-backend`（或其他名称）
   - **Environment**: `Node`
   - **Region**: 选择离用户最近的区域（如 Singapore）
   - **Branch**: `main` 或 `master`
   - **Root Directory**: 留空（使用项目根目录）
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free（或根据需要选择付费计划）

4. **配置环境变量**
   在 Render Dashboard 的 Environment 部分添加：
   ```
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://baisiyou.github.io
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ELEVENLABS_VOICE_ID=your_voice_id（可选）
   ```

5. **部署**
   - 点击 "Create Web Service"
   - Render 会自动开始部署
   - 部署完成后会获得后端 URL，例如：`https://clone-backend.onrender.com`

6. **更新前端 API 地址**
   - 获取 Render 后端 URL 后，更新 GitHub Actions workflow 中的 `REACT_APP_API_URL`
   - 或在 GitHub Secrets 中设置该环境变量
   - 重新触发部署工作流

### 使用 render.yaml（可选）

项目已包含 `render.yaml` 配置文件，可以在 Render Dashboard 中使用 "Apply Manifest" 功能一键部署，但仍需手动配置环境变量。

### 验证部署

1. **检查后端健康状态**
   ```bash
   curl https://your-render-backend-url.onrender.com/api/health
   ```
   应该返回：`{"status":"ok","message":"Voice Clone API is running"}`

2. **访问前端**
   - 打开 https://baisiyou.github.io/clone
   - 检查浏览器控制台是否有 API 连接错误
   - 如果出现 CORS 错误，检查后端 `CLIENT_URL` 环境变量是否正确

### 常见问题

1. **CORS 错误**
   - 确保 Render 后端的 `CLIENT_URL` 环境变量设置为 `https://baisiyou.github.io`
   - 不要包含末尾的 `/clone` 路径

2. **前端无法连接后端**
   - 检查 `REACT_APP_API_URL` 是否正确设置为 Render 后端 URL
   - 确保后端 URL 以 `/api` 结尾

3. **Render 服务休眠（Free 计划）**
   - Free 计划的服务在15分钟无活动后会休眠
   - 首次访问需要等待约30秒唤醒
   - 可考虑使用付费计划或添加健康检查 ping

## Railway/Render 部署（旧方法）

### Railway

1. 连接 GitHub 仓库
2. 设置环境变量
3. 构建命令：`npm install && cd client && npm install && npm run build`
4. 启动命令：`node server/index.js`

### Render（不使用 render.yaml）

1. 创建 Web Service
2. 设置环境变量
3. Build Command: `npm run install-all && npm run build`
4. Start Command: `node server/index.js`

## 生产环境配置

### 安全建议

1. **使用环境变量管理密钥**
   - 不要在代码中硬编码 API 密钥
   - 使用密钥管理服务（如 AWS Secrets Manager, Google Secret Manager）

2. **启用 HTTPS**
   - 使用反向代理（Nginx）
   - 配置 SSL 证书

3. **设置 CORS 白名单**
   ```javascript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://yourdomain.com',
     credentials: true
   }));
   ```

4. **限流和认证**
   - 添加 API 限流（如 express-rate-limit）
   - 实现用户认证（可选）

5. **日志和监控**
   - 配置日志系统
   - 添加错误追踪（如 Sentry）

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/client/build;
        try_files $uri $uri/ /index.html;
    }
}
```

## 性能优化

1. **启用压缩**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **缓存静态资源**
3. **使用 CDN 加速前端资源**
4. **数据库优化**（如需要存储对话历史）

## 故障排查

### 常见问题

1. **端口冲突**
   - 修改 `.env` 中的 PORT 值

2. **API 密钥错误**
   - 检查环境变量是否正确加载
   - 验证 API 密钥是否有效

3. **CORS 错误**
   - 检查 `CLIENT_URL` 配置
   - 确保前后端 URL 匹配

4. **构建失败**
   - 清除 node_modules 和重新安装
   - 检查 Node.js 版本

## 备份和恢复

定期备份：
- 环境变量配置
- 克隆的声音 ID 列表
- 部署配置


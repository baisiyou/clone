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

## Railway/Render 部署

### Railway

1. 连接 GitHub 仓库
2. 设置环境变量
3. 构建命令：`npm install && cd client && npm install && npm run build`
4. 启动命令：`node server/index.js`

### Render

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


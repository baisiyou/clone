# 404 错误排查指南

## 问题：访问 https://baisiyou.github.io/clone/ 显示 404

### 可能的原因和解决方法

#### 1. GitHub Pages 未启用或 Source 设置错误

**检查步骤：**
1. 进入 GitHub 仓库：https://github.com/baisiyou/clone
2. 点击 **Settings** → **Pages**
3. 检查 **Source** 设置

**解决方法：**
- Source 应该选择 **"GitHub Actions"**（不是 "Deploy from a branch"）
- 如果显示 "None" 或 "Deploy from a branch"，改为 "GitHub Actions"
- 保存设置

#### 2. GitHub Actions Workflow 未运行或失败

**检查步骤：**
1. 进入 GitHub 仓库的 **Actions** 标签页
2. 查看是否有 "Deploy to GitHub Pages" workflow
3. 检查 workflow 状态：
   - ✅ 绿色 = 成功
   - ⚠️ 黄色 = 进行中
   - ❌ 红色 = 失败

**如果 workflow 没有运行：**
1. 手动触发：
   - Actions → "Deploy to GitHub Pages" → "Run workflow"
   - 选择 main 分支，点击 "Run workflow"

**如果 workflow 失败：**
- 点击失败的 workflow 查看错误信息
- 常见错误：
  - 缺少 GitHub Secret `REACT_APP_API_URL`
  - 构建错误
  - 权限问题

#### 3. 缺少 GitHub Secret

**检查步骤：**
1. Settings → Secrets and variables → Actions
2. 检查是否有 `REACT_APP_API_URL`

**解决方法：**
如果没有，添加：
- Name: `REACT_APP_API_URL`
- Value: `https://clone-i9i8.onrender.com/api`

#### 4. 手动触发部署

如果以上都正确但仍未部署：

1. **手动触发 workflow：**
   ```
   Actions → Deploy to GitHub Pages → Run workflow → Run workflow
   ```

2. **或者推送一个空提交：**
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

#### 5. 等待部署完成

GitHub Pages 部署通常需要：
- 构建时间：2-5 分钟
- 部署时间：1-2 分钟
- 总共：3-7 分钟

部署完成后，可能需要几分钟才能访问到新内容。

---

## 验证步骤

### 1. 检查 GitHub Pages 状态
- Settings → Pages
- 查看是否显示 "Your site is live at..."

### 2. 检查 Actions 运行
- Actions 标签页
- 查看最新运行的工作流状态

### 3. 检查部署环境
- Settings → Environments
- 应该看到 "github-pages" 环境

---

## 如果仍然无法访问

1. **清除浏览器缓存**
2. **使用无痕模式访问**
3. **等待 10-15 分钟后重试**（CDN 传播需要时间）
4. **检查是否有构建错误**（Actions → 查看日志）

---

## 联系支持

如果以上方法都无效，请：
1. 检查 GitHub Actions 的错误日志
2. 截图 GitHub Pages 设置页面
3. 检查是否有权限问题


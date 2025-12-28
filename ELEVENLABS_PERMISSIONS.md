# ElevenLabs API 权限问题解决指南

## 问题

如果看到错误信息：`"The API key you used is missing the permission voices_read to execute this operation."`

这表示你的 ElevenLabs API 密钥缺少必要的权限。

## 解决方案

### 1. 检查 API 密钥权限

1. **登录 ElevenLabs**
   - 访问：https://elevenlabs.io/
   - 登录你的账号

2. **检查 API 密钥**
   - 进入 Profile → API Keys
   - 查看你使用的 API 密钥
   - 确认它是否有以下权限：
     - ✅ `voices_read` - 读取语音列表
     - ✅ `voices_add` - 添加新语音（克隆）
     - ✅ `voices_delete` - 删除语音
     - ✅ `text_to_speech` - 文本转语音

### 2. 创建新的 API 密钥（如果有权限设置）

如果可以在创建 API 密钥时选择权限：

1. **删除旧密钥**（可选）
   - Profile → API Keys
   - 找到旧密钥，点击删除

2. **创建新密钥**
   - 点击 "Create API Key"
   - **确保勾选所有需要的权限**：
     - ✅ Voices Read
     - ✅ Voices Add
     - ✅ Voices Delete
     - ✅ Text to Speech
   - 复制新密钥

3. **更新环境变量**
   - **本地开发**：更新 `.env` 文件中的 `ELEVENLABS_API_KEY`
   - **Render 部署**：在 Render Dashboard → Environment 中更新 `ELEVENLABS_API_KEY`

### 3. 检查 ElevenLabs 订阅计划

某些权限可能需要付费计划：

- **Free 计划**：功能有限
- **Starter 计划（$5/月）**：包含基本功能
- **Creator 计划（$22/月）**：包含所有功能

如果使用的是 Free 计划，可能需要：
- 升级到付费计划以获取完整权限
- 或使用不同的 API 密钥（如果有多个账号）

### 4. 验证修复

更新 API 密钥后：

1. **重启 Render 服务**
   - Render Dashboard → 你的服务 → Manual Deploy → Deploy latest commit

2. **测试 API**
   ```bash
   curl https://clone-i9i8.onrender.com/api/voice/list
   ```

3. **检查前端**
   - 刷新 https://baisiyou.github.io/clone
   - 应该能够加载语音列表

## 临时解决方案（如果无法获取权限）

如果暂时无法解决权限问题，可以：

1. **直接克隆语音**（不依赖列表 API）
   - 上传音频文件克隆新语音
   - 使用返回的 voice_id

2. **硬编码默认语音 ID**（如果有）
   - 在 `.env` 中设置 `ELEVENLABS_VOICE_ID`
   - 修改前端，跳过列表加载，直接使用默认语音

## 需要帮助？

如果问题仍然存在：
1. 检查 ElevenLabs 账号状态
2. 查看 Render 日志了解详细错误
3. 联系 ElevenLabs 支持确认权限问题


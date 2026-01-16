# AutoGPT 平台本地 Supabase 管理员创建与控制台访问指南

本文档说明在本地 Docker Supabase 环境下，如何启动 Supabase Studio、创建管理员用户并用其访问平台后台。

## 目录
- 环境前提
- 启动 Supabase 基础服务与 Studio
- 访问 Supabase Studio
- 创建用户并设为管理员
- 使用管理员账号登录平台与调用后端
- 常见排查

## 环境前提
- 已安装 Docker / Docker Compose。
- 仓库路径：`D:\mycode\2026\AutoGPT\autogpt_platform`。
- `.env` 中 Supabase 相关配置已存在：`SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`SUPABASE_JWT_SECRET` 或 `JWT_VERIFY_KEY`（必须与 Supabase JWT secret 一致）。

## 启动 Supabase 基础服务与 Studio
在仓库根目录执行（启动 Kong/Auth/DB + Studio/Meta）：
```powershell
cd D:\mycode\2026\AutoGPT\autogpt_platform
docker compose -f docker-compose.yml -f db/docker/docker-compose.yml -f db/docker/dev/docker-compose.dev.yml --profile local up -d kong auth db studio meta
```
检查容器状态：
```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```
若看到 `supabase-studio` 有 `0.0.0.0:8082->8082/tcp`，说明 Studio 已映射到本机 8082。

> 端口占用处理：如 8082 被占用，修改 `db/docker/dev/docker-compose.dev.yml` 中 `studio` 服务的端口映射（例如 `18082:8082`），然后重新运行上面的 compose 命令。

## 访问 Supabase Studio
- 浏览器打开 `http://localhost:8082`（或你修改后的端口）。
- 首次访问会让你设置 Studio 登录密码（仅用于 Studio，自身与 Supabase 用户无关）。

## 创建用户并设为管理员
1) 在 Studio 左侧导航进入 **Auth -> Users**，点击 **Add user**，填写邮箱与强密码，勾选“Confirm user”。
2) 在 Studio 的 **SQL Editor** 执行下列 SQL，将邮箱替换为你的账号：
```sql
update auth.users
set role = 'admin',
    raw_app_meta_data = jsonb_set(
      coalesce(raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"',
      true
    )
where email = 'admin@example.com';
```
执行后重新登录一次以刷新 token，新的 JWT 将包含 `role: "admin"`。

## 使用管理员账号
- 前端后台入口：登录后访问 `http://localhost:3000/admin` 及其子页（如 `/admin/marketplace`、`/admin/spending` 等）。
- 直接调用后端管理 API：先用 Supabase Auth 换取 access_token，再带 Bearer 调用。示例：
```powershell
# 登录获取 token（用 anon key）
curl -X POST `
  -H "apikey: $env:SUPABASE_ANON_KEY" `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","password":"你的密码"}' `
  "$env:SUPABASE_URL/auth/v1/token?grant_type=password"

# 拿到 access_token 后调用后台管理接口（REST API 默认 8006）
curl -H "Authorization: Bearer <access_token>" http://localhost:8006/api/store/admin/listings
```

## 常见排查
- 访问 `/admin` 被重定向或 403：确认上述 SQL 已执行、重新登录获取新 token；解码 JWT 看 `role` 是否为 `"admin"`。
- 8082 打不开：确认 `supabase-studio` 容器在跑且端口映射正确；必要时更换端口并重启 compose。
- 后端 401/403：检查 Authorization 头是否带最新的 Bearer token，且 JWT 密钥与 `.env`/Supabase 配置一致。

---

最后更新：2025-12-16

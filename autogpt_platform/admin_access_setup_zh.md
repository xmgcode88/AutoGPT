# AutoGPT Platform：创建管理员账号并访问 `/admin` 资源（本地）

本文档说明如何在本地开发环境中创建一个 Supabase Auth 用户，并将其提升为 `admin`，从而访问 AutoGPT Platform 的管理端资源（前端 `/admin/*` 页面 + 后端 `*/admin/*` API）。

## 1) 管理员权限判定逻辑（你在做什么）

本项目把“是否管理员”绑定在 **Supabase JWT 的 `role` 声明**上：

- 前端（Next.js middleware）会检查 `user.role === "admin"`，否则访问 `/admin` 会被重定向。
- 后端（FastAPI）会校验 JWT payload 的 `role === "admin"`，否则访问 `.../admin/...` 会返回 403。

因此你需要让 Supabase 发放的 JWT 里包含 `role: "admin"`。

## 2) 前置条件

- Supabase（至少 `auth` + `db` + `kong`，推荐带 `studio`）已启动。
- 平台前端与后端已启动：
  - 前端：`http://localhost:3000`
  - 后端 REST：`http://localhost:8006`

如果你只启动了 Supabase（例如只看到 `supabase-*` 容器），那么 `/admin` 页面还不能访问；请先按 `autogpt_platform/README.md` 的方式启动平台服务。

## 3) 启动 Supabase（推荐带 Studio）

在 `autogpt_platform` 目录执行：

```powershell
cd D:\mycode\2026\AutoGPT\autogpt_platform
docker compose -f docker-compose.yml -f db/docker/docker-compose.yml -f db/docker/dev/docker-compose.dev.yml --profile local up -d kong auth db studio meta
```

打开 Studio：`http://localhost:8082`

## 4) 创建用户（Auth 用户）

方式 A（推荐，使用 Studio）：

1. 打开 `http://localhost:8082`
2. 左侧进入 **Auth → Users**
3. 点击 **Add user**
4. 输入邮箱与密码
5. 勾选 **Confirm user**（或确保环境开启自动确认）

方式 B（可选，不用 Studio，直接走 Supabase Auth API）：

- 使用 `anon key` 调用 `auth/v1/signup` 或 `token` 接口创建/登录用户（略）。如果你需要，我可以按你当前 `.env` 帮你写一套可直接跑的 PowerShell 脚本。

## 5) 将用户提升为管理员（关键步骤）

### 方式 A：在 Studio 的 SQL Editor 执行

1. Studio 左侧进入 **SQL Editor**
2. 将下面 SQL 的邮箱替换为你的用户邮箱后执行：

```sql
update auth.users
set
  role = 'admin',
  raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"',
    true
  )
where email = 'admin@example.com';
```

### 方式 B：直接在数据库容器里执行（不依赖 Studio）

```powershell
docker exec supabase-db psql -U postgres -d postgres -c "update auth.users set role = 'admin', raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', '\"admin\"', true) where email = 'admin@example.com';"
```

## 6) 重新登录以刷新 Token（非常重要）

提升为管理员后，你必须 **退出并重新登录**（或清 Cookie/Session）：

- 旧 token 仍然是旧的 `role`
- 新登录拿到的新 JWT 才会包含 `role: "admin"`

## 7) 验证管理员生效

### 7.1 验证前端 `/admin`

1. 访问 `http://localhost:3000/login` 登录刚才的用户
2. 打开 `http://localhost:3000/admin/marketplace`（或其它 `/admin/*` 页面）
3. 如果不是管理员，会被重定向回 `/marketplace`

### 7.2 验证后端管理 API（示例）

先用密码登录换取 `access_token`（示例，按你的 `.env` 设置 `SUPABASE_URL`/`SUPABASE_ANON_KEY`）：

```powershell
$body = @{ email = "admin@example.com"; password = "你的密码" } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post `
  -Headers @{ apikey = $env:SUPABASE_ANON_KEY; "Content-Type" = "application/json" } `
  -Body $body `
  -Uri "$env:SUPABASE_URL/auth/v1/token?grant_type=password"
$token = $resp.access_token
```

再携带 Bearer token 调用平台后端的 admin API（以 store 为例）：

```powershell
Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } -Uri "http://localhost:8006/api/store/admin/listings"
```

非管理员会得到 403（`Admin access required`）。

## 8) 回退：取消管理员（可选）

把 `role` 改回 `authenticated`（或你项目约定的普通角色），并重新登录刷新 token：

```sql
update auth.users
set role = 'authenticated'
where email = 'admin@example.com';
```

## 9) 常见问题

- **访问 `/admin` 仍然 403/重定向**：确认已重新登录；并检查 JWT/用户对象里的 `role` 是否为 `admin`。
- **后端提示 `Invalid token`**：平台后端用于验签的 `JWT_VERIFY_KEY`（或 `SUPABASE_JWT_SECRET`）必须与 Supabase 的 `JWT_SECRET` 一致；本地默认来自 `autogpt_platform/.env`。

（最后更新：2025-12-18）


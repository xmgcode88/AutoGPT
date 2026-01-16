# Auth ????????? + ?? + ?????

> ????????????????????????????????

---

## ????
## 目标
- 移除运行时对 Supabase 的依赖（包含 `http://localhost:8082` 的 Studio）。
- 保持现有功能与用户体验不变。
- 在同一 Postgres 实例内拆分两个库：
  - `platform`：业务数据（当前 Prisma schema）。
  - `auth`：认证、身份与权限数据。
- 新增独立的认证微服务，并与现有服务对接。

## 非目标
- 不改变业务逻辑或用户体验。
- 不替换现有 FastAPI 服务。
- 不移除 Postgres 或 Prisma。

## 现有依赖（必须兼容）
- 后端 JWT 校验要求：
  - `aud = "authenticated"`
  - `sub = user_id`
  - `role` 用于管理员权限判断
- 前端会话行为：
  - 基于 Cookie 的 Session
  - 服务器端刷新 Session
  - 受保护/管理员路由跳转逻辑
- 用户 ID 必须与平台业务数据中的 UUID 保持一致。

## 目标架构（微服务模型）

```
+-----------------+      +------------------+      +-------------------+
|  Next.js        | ---> |  Auth Service    | ---> | Postgres (auth)    |
|  (frontend)     |      |  (FastAPI)       |      | DB: auth           |
+-----------------+      +------------------+      +-------------------+
         |                         |
         | JWT (aud/sub/role)      | 内部调用
         v                         v
+-----------------+      +------------------+      +-------------------+
| Backend APIs    | ---> | Platform API     | ---> | Postgres (platform)|
| (rest, ws, etc) |      | (existing)       |      | DB: platform       |
+-----------------+      +------------------+      +-------------------+
```

### 服务构成
- `auth_service`（新增）：负责所有认证与会话逻辑。
- 现有服务（`rest_server`、`executor`、`websocket_server` 等）：不改动，仅消费 JWT。

### 现有微服务运行方式（参考）
为保持结构一致，认证服务也应与现有服务的运行方式对齐：

1) Database Manager（8005）
```powershell
poetry run db
```

2) WebSocket（8001）
```powershell
poetry run ws
```

3) Notification（8007）
```powershell
poetry run notification
```

4) Scheduler（8003）
```powershell
poetry run scheduler
```

5) Executor（8002）
```powershell
poetry run executor
```

6) REST API（8006）
```powershell
poetry run rest
```

**Auth 服务建议（新增）**
- 建议统一入口为：
```powershell
poetry run auth
```
- 端口建议：`8010`（避免与现有服务冲突，可按需调整）。
- 需提供健康检查与就绪探针（/healthz、/readyz）。
- 与其他服务通信采用 HTTP（同步）或 RabbitMQ（异步）。

### 微服务对接要点（保持功能不变）
- 前端/后端只依赖 JWT 与 Auth API，不直接访问 auth DB。
- Auth 服务在注册/首次登录后调用 Platform API `createUser`。
- 对 admin 权限的判断仍由 JWT `role` 驱动。

## Postgres 分库（同一实例）
- 同一个 Postgres 实例，两个数据库：
  - `platform`（现有业务数据）
  - `auth`（新增认证数据）
- 不做跨库触发器，改用服务调用或消息队列进行同步。

## Auth 数据库 Schema（建议）
最小化集合，保证功能完整：
- `auth.users`
  - `id (uuid, pk)`
  - `email (unique)`
  - `password_hash`（bcrypt）
  - `role`（admin/authenticated）
  - `email_confirmed_at`
  - `created_at`, `updated_at`
- `auth.refresh_tokens`
  - `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`
- `auth.password_resets`
  - `id`, `user_id`, `token_hash`, `expires_at`, `used_at`
- `auth.email_verifications`
  - `id`, `user_id`, `token_hash`, `expires_at`, `used_at`
- `auth.identities`（可选，OAuth）
  - `id`, `user_id`, `provider`, `provider_user_id`, `metadata`

## JWT 策略（兼容优先）
- 后端 JWT 校验逻辑保持不变。
- Auth 服务签发 JWT（HS256 或非对称密钥）。
- JWT 必须包含：
  - `sub` = 用户 UUID
  - `role` = `admin` 或 `authenticated`
  - `aud` = `authenticated`
  - `email`
  - `exp`, `iat`

## 前端对接方案（保持体验）
- 用 `auth_client` 替换 Supabase SDK，同时模拟现有 API 形态：
  - `signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`, `updateUser`,
    `getSession`, `getUser`, `refreshSession`
- 更新 `middleware.ts`：由 Auth 服务完成 Session 校验与刷新。

## 后端对接方案
- JWT 验证仍走 `autogpt_libs.auth.jwt_utils`。
- 替换所有 Supabase Admin API 调用为 Auth 服务调用。
- 移除数据库中对 `auth.users` 的触发器逻辑：
  - 改为 Auth 服务在注册后调用 Platform API `createUser`。
  - 历史用户通过迁移脚本回填。

## 微服务接口（建议）

### Auth Service REST API
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/reset-password`
- `POST /auth/update-password`
- `GET /auth/user`
- `POST /auth/verify-email`
- `POST /auth/oauth/callback`（可选）

### Platform API 集成
- `POST /api/users` 或现有 `createUser` 入口
- Auth 服务在注册或首次登录时调用

## 迁移计划（保证功能无回归）

### 阶段 1：落地 Auth 服务
- 建模 + 实现 API。
- JWT 签发与 claim 兼容。
- 邮件服务（SMTP 或第三方）。

### 阶段 2：数据库分库
- 在同一 Postgres 创建 `auth` 库。
- 将 Supabase 的 `auth.users` 迁移到新库：
  - 保持 UUID
  - 兼容密码 hash（Supabase 使用 bcrypt）
- 删除依赖 `auth.users` 的平台迁移逻辑。

### 阶段 3：前端替换
- 替换 Supabase SDK 使用点。
- Session 中间件改为 Auth 服务。
- 路由与 UI 不变。

### 阶段 4：后端替换
- Supabase admin 调用替换为 Auth 服务调用。
- JWT 校验保持不动。

### 阶段 5：切换
- Compose 中新增 `auth_service`。
- 前端/后端指向新的 Auth 服务。
- 下线 Supabase 相关容器。

## Docker Compose 变更（高层）
- 在 `docker-compose.platform.yml` 新增 `auth_service`。
- 新增配置项：
  - `AUTH_DATABASE_URL`
  - `AUTH_JWT_PRIVATE_KEY` 或 `AUTH_JWT_SECRET`
- 本地 profile 中移除 Supabase 容器。

## 风险与回滚
- 风险：密码 hash 不兼容
  - 对策：使用 bcrypt 校验，必要时强制重置密码
- 风险：JWT claim 不一致
  - 对策：新增测试验证 claim
- 回滚：保留 Supabase compose 定义并通过环境变量回切

## 测试计划
- JWT 生成与校验单测
- 登录/注册/重置密码集成测试
- 受保护/管理员路由 E2E

## 交付物
- 新增 `auth_service` 代码：`autogpt_platform/backend/services/auth`
- Auth DB 迁移脚本
- 前端 auth_client 替换 Supabase SDK
- Compose 增加 `auth_service`

---

如需，我可以继续把该文档细化为具体任务列表、改动清单与迁移脚本模板。


## ??
- ??????????`auth-refactor-tasks.md`
- ???????`auth-migration-templates.md`

---

## ?????????
> ?????? Postgres ????? `platform` + `auth` ?????????? Auth ??????????????? Supabase?

## ??????????

**P0??????**
1. ?? Auth ??? API ??? JWT ?????aud/sub/role??
2. ?? Auth ??? schema?`auth` DB?????????
3. ?? `auth_service` ??????FastAPI??? `/healthz` `/readyz`?
4. ?? Auth ? Platform ??????????/?????? `createUser`??
5. ? Compose ??? `auth_service` ??????????????

**P1??????**
6. ???? Supabase SDK ? `auth_client`????? API ??????
7. ?? Session ????? Auth ????????
8. ???? Supabase Admin API ????? Auth ?????????
9. ???????????????? `auth` DB??? UUID ???

**P2???????**
10. ?? Supabase ??????
11. ?? OAuth/????/???????????????
12. ?? Supabase ????????

---

## ?????????

### 1) ??????auth_service?
- [ ] ???????`autogpt_platform/backend/services/auth`?
- [ ] FastAPI ?????`poetry run auth`?
- [ ] REST API?
  - `POST /auth/signup`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `POST /auth/reset-password`
  - `POST /auth/update-password`
  - `GET /auth/user`
  - `POST /auth/verify-email`
- [ ] JWT ??????`aud=sub/role` ??????
- [ ] Refresh Token ????`auth.refresh_tokens`??
- [ ] ?????`/healthz` `/readyz`?

### 2) ????auth DB?
- [ ] ?? `auth` DB?
- [ ] ?? schema ????users/tokens/reset/verify??
- [ ] ??????????????
- [ ] ???????drop schema / revoke??

### 3) ????
- [ ] ?? `auth_client`?????????? `useSupabase` ???
- [ ] ????/??/???????
- [ ] ?? `middleware.ts`?Session ???? Auth ???
- [ ] ?????????`NEXT_PUBLIC_AUTH_URL`??

### 4) ????
- [ ] ?? Supabase client ?????`backend/util/clients.py` ? supabase ???
- [ ] ?? feature flag / admin ???????
- [ ] `jwt_utils` ????? token claim ???

### 5) ???? & ??
- [ ] ? Supabase `auth.users` ???????
- [ ] ?? `auth.users` ???UUID ????????
- [ ] ???? hash ????Supabase bcrypt??
- [ ] ?? `platform.User` / ???????

### 6) Compose & ??
- [ ] `docker-compose.platform.yml` ?? `auth_service`?
- [ ] ?????`AUTH_DATABASE_URL`?`AUTH_JWT_SECRET`?
- [ ] ???????`poetry run auth`?
- [ ] ?????????? + error logging?

---

## ?????

**M1?Auth ?????**
- ?? / ?? / ?? token ????
- JWT claim ????????

**M2??????**
- ??/??/?????????
- ????????????????

**M3??????**
- Supabase ????????????
- ???????

---

## ??????
> ??????????????????????????????

## 0) ????
- ??????`auth`
- schema?`auth`
- ??????`platform`
- ?????`admin` / `authenticated`

---

## 1) ?? auth ???????

```sql
-- ? postgres ?????
CREATE DATABASE auth;
```

---

## 2) ?? schema ????

```sql
-- ??? auth ?????
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'authenticated',
  email_confirmed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth.password_resets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth.email_verifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth.identities (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_user_id ON auth.refresh_tokens(user_id);
```

---

## 3) ? Supabase `auth.users` ????????

> ?? Supabase ????????????? CSV??

```sql
-- ? auth ??????
-- ????? postgres ? auth schema?Supabase ???
INSERT INTO auth.users (id, email, password_hash, role, email_confirmed_at, created_at, updated_at)
SELECT
  id,
  email,
  encrypted_password, -- Supabase bcrypt hash
  COALESCE(raw_app_meta_data->>'role', 'authenticated') AS role,
  email_confirmed_at,
  created_at,
  updated_at
FROM public.auth_users_backup; -- ??????????
```

### CSV ????

1. ? Supabase ??????CSV??
2. ?????? `public.auth_users_backup`?
3. ????? INSERT?

---

## 4) ????????????

> ? `platform.User` ??????????????? SQL ???

```sql
-- ? platform ???????????????
INSERT INTO "User" (id, createdAt, updatedAt)
SELECT id, now(), now()
FROM auth.users
WHERE id NOT IN (SELECT id FROM "User");
```

---

## 5) JWT ?????Auth ???

- ? `.env` ? secret ????
  - `AUTH_JWT_SECRET`?HS256? ? `AUTH_JWT_PRIVATE_KEY`?RS/ES?
- ?????????????
  - `aud = authenticated`
  - `sub = user_id`
  - `role` ??

---

## 6) ????????

```sql
DROP SCHEMA IF EXISTS auth CASCADE;
```

---

## 7) ???????????

```sql
-- ???????
SELECT
  (SELECT count(*) FROM auth.users) AS auth_users,
  (SELECT count(*) FROM "User") AS platform_users;

-- ??????
SELECT id FROM auth.users
EXCEPT
SELECT id FROM "User";
```

---


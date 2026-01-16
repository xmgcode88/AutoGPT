# Auth Refactor Plan (Split Postgres DBs, Microservice, No Supabase)

## Goals
- Remove runtime dependency on Supabase (including Studio on `http://localhost:8082`).
- Keep existing product behavior and user-facing flows unchanged.
- Split data into two Postgres databases hosted on the same Postgres server:
  - `platform` DB for business data (current Prisma schema).
  - `auth` DB for authentication, identity, and access control.
- Introduce a dedicated Auth microservice and integrate with existing services.

## Non-Goals
- Do not change business logic or user experience.
- Do not replace the current FastAPI backend services.
- Do not remove Postgres or Prisma from the stack.

## Current Dependencies That Must Be Preserved
- Backend JWT verification expects:
  - `aud = "authenticated"`
  - `sub = user_id`
  - `role` claim for admin checks
- Frontend session behavior:
  - Cookie-based sessions with server-side refresh
  - Protected/admin route redirects
- User ID remains the same UUID used by platform data.

## Target Architecture (Microservice Model)

```
+-----------------+      +------------------+      +-------------------+
|  Next.js        | ---> |  Auth Service    | ---> | Postgres (auth)    |
|  (frontend)     |      |  (FastAPI)       |      | DB: auth           |
+-----------------+      +------------------+      +-------------------+
         |                         |
         | JWT (aud/sub/role)      | Internal call
         v                         v
+-----------------+      +------------------+      +-------------------+
| Backend APIs    | ---> | Platform API     | ---> | Postgres (platform)|
| (rest, ws, etc) |      | (existing)       |      | DB: platform       |
+-----------------+      +------------------+      +-------------------+
```

### Services
- `auth_service` (new): FastAPI service responsible for all auth flows.
- `rest_server`, `executor`, `websocket_server`, etc: unchanged, only consume JWTs.

## Postgres Split (Two Databases)
- Single Postgres instance hosts two databases:
  - `platform` (existing schema)
  - `auth` (new schema)
- No cross-DB triggers. Integration uses service-to-service calls or queue.

## Auth Database Schema (Proposed)
Minimal tables to preserve current functionality:
- `auth.users`
  - `id (uuid, pk)`
  - `email (unique)`
  - `password_hash` (bcrypt)
  - `role` (admin/authenticated)
  - `email_confirmed_at`
  - `created_at`, `updated_at`
- `auth.refresh_tokens`
  - `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`
- `auth.password_resets`
  - `id`, `user_id`, `token_hash`, `expires_at`, `used_at`
- `auth.email_verifications`
  - `id`, `user_id`, `token_hash`, `expires_at`, `used_at`
- `auth.identities` (optional OAuth)
  - `id`, `user_id`, `provider`, `provider_user_id`, `metadata`

## JWT Strategy (Compatibility First)
- Keep current backend verification unchanged.
- Auth service signs JWTs with shared secret (HS256) or public/private keys.
- JWT claims must include:
  - `sub` = user UUID
  - `role` = `admin` or `authenticated`
  - `aud` = `authenticated`
  - `email`
  - `exp`, `iat`

## Frontend Integration Plan (Keep UX Stable)
- Replace Supabase client with `auth_client` wrapper that mimics the same API
  surface used by `useSupabase` hooks and server actions.
- Minimal touches by keeping function names aligned:
  - `signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`, `updateUser`,
    `getSession`, `getUser`, `refreshSession`
- Update `middleware.ts` to validate session via Auth service (not Supabase).

## Backend Integration Plan
- JWT verification stays in `autogpt_libs.auth.jwt_utils`.
- Replace any direct Supabase Admin calls with Auth service calls.
  - Example: feature flag user lookup.
- Remove `auth.users` DB triggers and replace with service flow:
  - Auth service calls Platform API `createUser` after signup.
  - For legacy data, backfill users via migration script.

## Microservice Interfaces (Proposed)

### Auth Service REST API
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/reset-password`
- `POST /auth/update-password`
- `GET /auth/user`
- `POST /auth/verify-email`
- `POST /auth/oauth/callback` (optional)

### Platform API Integration
- `POST /api/users` or existing `createUser` endpoint
- Called by Auth service after successful signup or on first login.

## Migration Plan (No Feature Regression)

### Phase 1: Build Auth Service
- Implement data models and REST endpoints.
- Add JWT signing with existing claim structure.
- Add email sender (SMTP or provider).

### Phase 2: Split DBs
- Create `auth` DB in same Postgres instance.
- Migrate users from Supabase `auth.users` into new `auth.users`.
  - Preserve UUIDs.
  - Preserve password hashes (Supabase uses bcrypt).
- Remove platform migrations that reference `auth.users`.

### Phase 3: Integrate Frontend
- Replace Supabase client with `auth_client` wrapper.
- Keep UX and routes unchanged.
- Update session middleware to use Auth service.

### Phase 4: Integrate Backend
- Replace Supabase admin calls with Auth service.
- Ensure JWT verification remains unchanged.

### Phase 5: Cutover
- Deploy Auth service in compose.
- Point frontend and backend to Auth service endpoints.
- Disable Supabase containers.

## Docker Compose Changes (High-Level)
- Add `auth_service` container to `docker-compose.platform.yml`.
- Add `auth_db` connection string env vars:
  - `AUTH_DATABASE_URL`
  - `AUTH_JWT_PRIVATE_KEY` or `AUTH_JWT_SECRET`
- Remove Supabase services from local compose profile.

## Risk & Rollback
- Risk: password hash incompatibility.
  - Mitigation: use bcrypt verify compatible with Supabase.
- Risk: missing JWT claims.
  - Mitigation: add automated test to compare claims with current tokens.
- Rollback: keep Supabase compose definitions and switch env vars back.

## Testing Plan
- Unit tests for JWT claims and token validation.
- Integration tests for login/signup/reset-password.
- End-to-end tests for protected/admin routes.

## Deliverables
- New `auth_service` codebase under `autogpt_platform/backend/services/auth`.
- New DB migration scripts for `auth` DB.
- Frontend auth client wrapper replacing Supabase SDK usage.
- Updated Docker compose to include `auth_service`.

---

If you want, I can turn this into a concrete implementation plan with tasks,
code changes, and a migration script outline.

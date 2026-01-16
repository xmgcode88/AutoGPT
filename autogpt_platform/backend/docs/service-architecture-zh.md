# AutoGPT Platform 后端服务说明（中文）

本文档面向本地或容器环境，解释 AutoGPT Platform 后端各服务的职责、目录位置、启动方式与通信方式。

## 1. 服务总览

后端拆分为多个进程（微服务风格），每个进程独立启动并通过 HTTP/RPC、Redis、RabbitMQ 通信：

1) REST API（端口 8006）
2) WebSocket（端口 8001）
3) Database Manager（端口 8005）
4) Scheduler（端口 8003）
5) Executor（端口 8002）
6) Notification（端口 8007）

这些服务均位于 `autogpt_platform/backend/backend/` 目录。

## 2. 目录与入口

### 2.1 Poetry 脚本入口

脚本定义位置：`autogpt_platform/backend/pyproject.toml` 的 `[tool.poetry.scripts]`

```
app         -> backend.app:main
rest        -> backend.rest:main
db          -> backend.db:main
ws          -> backend.ws:main
scheduler   -> backend.scheduler:main
notification-> backend.notification:main
executor    -> backend.exec:main
```

### 2.2 进程入口文件

```
backend/rest.py          REST API
backend/ws.py            WebSocket
backend/db.py            Database Manager
backend/scheduler.py     Scheduler
backend/notification.py  Notification
backend/exec.py          Executor
backend/app.py           一键启动全部（多进程）
```

## 3. 默认端口与配置

端口在 `backend/util/settings.py` 的 Config 中定义，默认值如下：

```
websocket_server_port    8001
execution_manager_port   8002
execution_scheduler_port 8003
database_api_port        8005
agent_api_port           8006
notification_service_port8007
```

实际可通过环境变量覆盖（如在 `.env` 或 docker-compose 中设置）。

## 4. 各服务职责

### 4.1 REST API（8006）

- 对外提供 HTTP API（FastAPI）。
- 主要入口：`backend/server/rest_api.py`
- 承接前端访问（`/api/*`），处理鉴权、业务逻辑、管理后台接口等。

### 4.2 WebSocket（8001）

- 实时推送执行状态、通知等。
- 主要入口：`backend/server/ws_api.py`
- 从 Redis 事件总线监听事件，并推送到前端。

### 4.3 Database Manager（8005）

- 以服务方式对内提供数据层操作（Graph、Execution、User 等）。
- 主要实现：`backend/executor/database.py`（AppService）
- 提供 HTTP/RPC 形式的服务接口供其他进程调用。

### 4.4 Scheduler（8003）

- 任务调度（定时执行 Graph）。
- 主要实现：`backend/executor/scheduler.py`（AppService）
- 使用 APScheduler + 数据库存储，支持 cron 与定时任务。

### 4.5 Executor（8002）

- 消费执行队列，真正执行 Graph/Agent。
- 主要实现：`backend/executor/manager.py`
- 使用 RabbitMQ 队列，按并发执行。

### 4.6 Notification（8007）

- 通知服务（邮件/批量通知/系统消息等）。
- 主要实现：`backend/notifications/notifications.py`
- 使用 RabbitMQ 进行通知消息分发。

## 5. 服务之间如何通信

### 5.1 HTTP/RPC（AppService）

核心封装在 `backend/util/service.py`：

- `AppService`：服务端（FastAPI + Uvicorn）。
- `get_service_client`：客户端（httpx），组装 `http://{host}:{port}` 进行调用。

客户端入口集中在 `backend/util/clients.py`，例如：

```
get_database_manager_client()
get_scheduler_client()
get_notification_manager_client()
```

### 5.2 Redis 事件总线（WebSocket 推送）

WebSocket 服务使用 Redis 事件总线监听执行事件与通知事件：

```
AsyncRedisExecutionEventBus
AsyncRedisNotificationEventBus
```

位置：`backend/server/ws_api.py`

### 5.3 RabbitMQ（执行与通知队列）

- Executor：消费执行队列（开始/取消执行）。
- Notification：发送通知消息。

主要实现位置：

```
backend/executor/manager.py
backend/notifications/notifications.py
```

## 6. 本地启动方式

### 6.1 单进程启动（仅某个服务）

```
poetry run rest
poetry run ws
poetry run db
poetry run scheduler
poetry run notification
poetry run executor
```

### 6.2 一键启动全部服务

```
poetry run app
```

`backend/app.py` 会按顺序启动各个进程，最后一个在前台运行。

## 7. Docker 方式（平台服务）

`autogpt_platform/docker-compose.platform.yml` 已定义服务编排：

- rest_server
- websocket_server
- db
- scheduler_server
- notification_server
- executor

服务间主机名通过环境变量传递，例如：

```
AGENTSERVER_HOST=rest_server
SCHEDULER_HOST=scheduler_server
EXECUTIONMANAGER_HOST=executor
NOTIFICATIONMANAGER_HOST=notification_server
DB_HOST=db
```

启动方式示例：

```
docker compose -f autogpt_platform/docker-compose.platform.yml up
```

## 8. 常见排错思路

1) 端口被占用：检查 8001/8002/8003/8005/8006/8007 是否被占。
2) 服务互相连接失败：确认环境变量 Host/Port 与容器网络。
3) 队列/Redis 不通：检查 RabbitMQ/Redis 服务是否运行。
4) REST API 正常但 WS 无推送：多半是 Redis 事件总线未连接。

## 9. 变更与二次开发提示

- 新增服务建议继承 `AppService`，通过 `get_service_client` 统一调用。
- 对外 API 请统一挂载在 REST API（`backend/server/rest_api.py`）。
- 需要后台管理功能请走 `requires_admin_user` 的 Admin 路由模式。

---

如需更细的调用链、数据模型说明，建议结合：

- `backend/data/`（数据层）
- `backend/server/`（API 路由）
- `backend/executor/`（执行与调度核心）

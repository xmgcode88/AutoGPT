# AutoGPT平台后端服务架构说明文档

## 概述

AutoGPT平台采用微服务架构，将复杂的AI智能体系统拆分为多个独立的服务组件。每个服务负责特定的功能领域，通过消息队列和API进行通信协作。本文档详细说明了各个后端服务的功能、端口分配以及它们之间的协作关系。

## 服务架构总览

### 核心服务列表

| 服务名称 | 端口 | 启动命令 | 主要功能 |
|---------|------|----------|----------|
| **rest_server** | 8006 | `python -m backend.rest` | REST API服务，处理HTTP请求 |
| **websocket_server** | 8001 | `python -m backend.ws` | WebSocket服务，实时通信 |
| **executor** | 8002 | `python -m backend.exec` | 智能体执行引擎 |
| **database_manager** | 8005 | `python -m backend.db` | 数据库管理服务 |
| **scheduler_server** | 8003 | `python -m backend.scheduler` | 任务调度服务 |
| **notification_server** | 8007 | `python -m backend.notification` | 通知管理服务 |

### 基础设施服务

| 服务名称 | 端口 | 类型 | 主要功能 |
|---------|------|------|----------|
| **redis** | 6379 | 缓存/消息队列 | 会话存储、消息队列 |
| **rabbitmq** | 5672/15672 | 消息队列 | 服务间异步通信 |
| **db (PostgreSQL)** | 5432 | 数据库 | 持久化数据存储 |
| **clamav** | 3310 | 安全扫描 | 文件安全检查 |

## 详细服务说明

### 1. REST API服务 (rest_server:8006)

**核心职责：**
- 处理所有HTTP API请求
- 用户认证和授权
- 智能体市场管理
- 聊天会话管理
- 文件上传和处理

**主要API端点：**
```
/api/v1/chat/*          # 聊天相关API
/api/v1/marketplace/*   # 智能体市场API
/api/v1/library/*       # 用户智能体库API
/api/v1/agents/*        # 智能体管理API
/api/v1/auth/*          # 认证相关API
```

**技术实现：**
```python
# 启动入口
from backend.server.rest_api import AgentServer
run_processes(AgentServer())
```

**依赖服务：**
- Redis：会话缓存
- PostgreSQL：数据持久化
- RabbitMQ：异步任务队列

### 2. WebSocket服务 (websocket_server:8001)

**核心职责：**
- 实时双向通信
- 聊天消息流式传输
- 智能体执行状态实时更新
- 多用户会话管理

**主要功能：**
- EventSource流式响应
- WebSocket连接管理
- 消息广播和路由
- 连接状态监控

**技术实现：**
```python
# 启动入口
from backend.server.ws_api import WebsocketServer
run_processes(WebsocketServer())
```

**协作关系：**
- 接收前端WebSocket连接
- 与REST API服务协同处理聊天请求
- 向客户端推送实时执行状态

### 3. 执行引擎服务 (executor:8002)

**核心职责：**
- 智能体任务执行
- 工作流编排
- 资源管理和监控
- 错误处理和重试

**执行流程：**
1. 接收执行任务（来自REST API或调度器）
2. 加载智能体配置和用户凭证
3. 执行智能体逻辑
4. 管理执行状态和结果
5. 推送执行状态更新

**技术实现：**
```python
# 启动入口
from backend.executor import ExecutionManager
run_processes(ExecutionManager())
```

**关键特性：**
- 支持并发执行
- 资源隔离和限制
- 执行历史记录
- 实时状态监控

### 4. 数据库管理服务 (database_manager:8005)

**核心职责：**
- 数据库连接池管理
- 数据访问层抽象
- 数据迁移和版本控制
- 查询优化和监控

**管理的数据实体：**
- 用户信息和认证数据
- 智能体定义和版本
- 执行历史和结果
- 市场数据和评分
- 用户凭证和配置

**技术实现：**
```python
# 启动入口
from backend.executor import DatabaseManager
run_processes(DatabaseManager())
```

**数据库操作：**
- Prisma ORM集成
- 连接池管理
- 事务处理
- 数据备份和恢复

### 5. 调度服务 (scheduler_server:8003)

**核心职责：**
- 定时任务管理
- Cron表达式解析
- 任务队列管理
- 执行时间调度

**调度类型：**
- **立即执行**：实时任务处理
- **定时执行**：基于cron表达式的周期性任务
- **延迟执行**：指定延迟时间的任务
- **条件触发**：基于事件或条件的任务

**技术实现：**
```python
# 启动入口
from backend.executor.scheduler import Scheduler
run_processes(Scheduler())
```

**核心功能：**
- 任务持久化存储
- 执行时间计算
- 任务状态跟踪
- 失败重试机制

### 6. 通知服务 (notification_server:8007)

**核心职责：**
- 实时通知推送
- 多渠道通知管理
- 通知模板和个性化
- 通知历史和统计

**通知类型：**
- 执行完成通知
- 错误和异常通知
- 系统状态更新
- 用户交互提醒

**技术实现：**
```python
# 启动入口
from backend.notifications.notifications import NotificationManager
run_processes(NotificationManager())
```

**通知渠道：**
- WebSocket实时推送
- 邮件通知
- 系统内消息
- 第三方集成（如Slack、钉钉）

## 服务协作流程

### 1. 用户聊天请求处理流程

```mermaid
sequenceDiagram
    participant Frontend as 前端
    participant REST as REST API (8006)
    participant WS as WebSocket (8001)
    participant Executor as 执行器 (8002)
    participant DB as 数据库管理 (8005)
    participant Redis as Redis缓存
    participant RabbitMQ as 消息队列

    Frontend->>REST: HTTP POST /api/v1/chat/sessions/{id}/stream
    REST->>Redis: 获取/创建会话
    REST->>DB: 保存用户消息
    REST->>WS: 建立EventSource连接
    REST->>Executor: 提交智能体执行任务
    Executor->>RabbitMQ: 发送执行消息
    Executor->>WS: 推送执行状态
    WS->>Frontend: 流式返回结果
    Executor->>DB: 保存执行结果
```

### 2. 智能体执行流程

```mermaid
sequenceDiagram
    participant REST as REST API (8006)
    participant Executor as 执行器 (8002)
    participant Scheduler as 调度器 (8003)
    participant DB as 数据库管理 (8005)
    participant Notification as 通知服务 (8007)

    REST->>Executor: 请求执行智能体
    Executor->>DB: 获取智能体配置
    Executor->>DB: 获取用户凭证
    Executor->>Executor: 执行智能体逻辑
    Executor->>DB: 保存执行状态
    Executor->>Notification: 发送执行通知
    Notification->>REST: 推送实时状态
    Executor->>DB: 保存最终结果
```

### 3. 定时任务调度流程

```mermaid
sequenceDiagram
    participant REST as REST API (8006)
    participant Scheduler as 调度器 (8003)
    participant Executor as 执行器 (8002)
    participant DB as 数据库管理 (8005)
    participant RabbitMQ as 消息队列

    REST->>Scheduler: 创建定时任务
    Scheduler->>DB: 保存任务配置
    Scheduler->>Scheduler: 计算下次执行时间
    Scheduler->>Executor: 触发执行
    Executor->>RabbitMQ: 发送执行消息
    Scheduler->>DB: 更新任务状态
```

## 基础设施服务详解

### 1. Redis (端口6379)

**用途：**
- **会话存储**：聊天会话数据和临时状态
- **缓存层**：频繁查询数据的缓存
- **消息队列**：轻量级任务队列
- **分布式锁**：服务间协调

**数据结构：**
```python
# 会话数据
session:{session_id} -> ChatSession

# 用户缓存
user:{user_id} -> UserInfo

# 执行状态
execution:{execution_id} -> ExecutionStatus

# 消息队列
queue:executions -> List[ExecutionTask]
```

### 2. RabbitMQ (端口5672/15672)

**用途：**
- **服务解耦**：异步消息传递
- **任务队列**：智能体执行任务
- **事件广播**：系统事件通知
- **负载均衡**：任务分发

**队列配置：**
```python
# 执行任务队列
agent_executions -> 高优先级

# 通知队列
notifications -> 中优先级

# 系统事件队列
system_events -> 低优先级
```

### 3. PostgreSQL (端口5432)

**用途：**
- **持久化存储**：所有业务数据
- **事务处理**：ACID事务保证
- **关系查询**：复杂关联查询
- **数据一致性**：数据完整性约束

**主要表结构：**
```sql
-- 用户表
users (id, email, created_at, updated_at)

-- 智能体表
agents (id, name, description, version, user_id)

-- 执行历史表
executions (id, agent_id, user_id, status, result)

-- 聊天会话表
chat_sessions (id, user_id, created_at, messages)
```

### 4. ClamAV (端口3310)

**用途：**
- **文件扫描**：上传文件安全检查
- **病毒检测**：恶意软件识别
- **内容安全**：文件内容验证

**集成方式：**
```python
# 文件上传时自动扫描
def scan_file(file_path: str) -> bool:
    clamav = ClamAV()
    return clamav.scan(file_path)
```

## 服务启动顺序

### 1. 基础设施服务
```bash
# 1. 数据库服务
docker compose up -d db

# 2. 缓存和消息队列
docker compose up -d redis rabbitmq

# 3. 安全服务
docker compose up -d clamav
```

### 2. 数据迁移
```bash
# 数据库迁移
docker compose up -d migrate
```

### 3. 核心业务服务
```bash
# 1. 数据库管理服务
docker compose up -d database_manager

# 2. REST API服务
docker compose up -d rest_server

# 3. WebSocket服务
docker compose up -d websocket_server

# 4. 执行引擎
docker compose up -d executor

# 5. 调度服务
docker compose up -d scheduler_server

# 6. 通知服务
docker compose up -d notification_server
```

### 4. 前端服务
```bash
# 前端应用
docker compose up -d frontend
```

## 服务监控和健康检查

### 健康检查端点

每个服务都提供健康检查端点：

```bash
# REST API健康检查
curl http://localhost:8006/health

# WebSocket服务健康检查
curl http://localhost:8001/health

# 执行器健康检查
curl http://localhost:8002/health

# 数据库管理健康检查
curl http://localhost:8005/health

# 调度器健康检查
curl http://localhost:8003/health

# 通知服务健康检查
curl http://localhost:8007/health
```

### 日志管理

所有服务都配置了统一的日志格式：

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

### 监控指标

**关键监控指标：**
- 服务响应时间
- 错误率和成功率
- 并发连接数
- 内存和CPU使用率
- 队列长度和处理速度

## 服务配置

### 环境变量配置

每个服务通过环境变量进行配置：

```bash
# 数据库连接
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Redis连接
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ连接
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672

# 服务端口配置
REST_SERVER_PORT=8006
WEBSOCKET_SERVER_PORT=8001
EXECUTOR_PORT=8002
DATABASE_MANAGER_PORT=8005
SCHEDULER_PORT=8003
NOTIFICATION_PORT=8007
```

### Docker网络配置

所有服务都在同一个Docker网络中运行：

```yaml
networks:
  app-network:
    driver: bridge
  shared-network:
    driver: bridge
```

## 扩展和部署

### 水平扩展

**可扩展的服务：**
- REST API服务：支持多实例负载均衡
- WebSocket服务：支持连接分发
- 执行器服务：支持任务并行处理

**扩展策略：**
```bash
# 扩展REST API服务
docker compose up -d --scale rest_server=3

# 扩展执行器服务
docker compose up -d --scale executor=5
```

### 生产环境部署

**推荐配置：**
- 使用Kubernetes进行容器编排
- 配置自动扩缩容
- 实施服务网格（如Istio）
- 配置监控和告警系统

## 故障处理

### 服务依赖关系

```mermaid
graph TD
    A[Frontend] --> B[REST API]
    A --> C[WebSocket]
    B --> D[Redis]
    B --> E[PostgreSQL]
    B --> F[RabbitMQ]
    C --> D
    G[Executor] --> F
    G --> D
    G --> E
    H[Scheduler] --> F
    H --> E
    I[Notification] --> F
    I --> D
    J[Database Manager] --> E
```

### 故障恢复策略

**单点故障处理：**
- Redis：使用Redis Cluster实现高可用
- PostgreSQL：配置主从复制和故障转移
- RabbitMQ：配置镜像队列和集群模式

**服务重启策略：**
```yaml
restart: on-failure
restart_policy:
  condition: on-failure
  delay: 5s
  max_attempts: 3
```

## 总结

AutoGPT平台的后端服务架构采用微服务设计，通过合理的职责分离和服务协作，实现了高可用、可扩展的AI智能体执行平台。每个服务都有明确的职责边界，通过标准化的API和消息队列进行通信，确保了系统的灵活性和可维护性。

这种架构设计使得平台能够：
- **独立部署和扩展**各个服务
- **实现故障隔离**和快速恢复
- **支持高并发**处理
- **便于监控和维护**
- **支持持续集成和部署**

通过理解这些服务的功能和协作关系，开发者可以更好地使用、维护和扩展AutoGPT平台。

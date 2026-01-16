# Chat 智能体匹配与执行流程说明

本文说明当用户在 `http://localhost:3000/chat` 发起提问时，系统如何完成“智能体匹配、执行并反馈”的核心流程，并给出一个完整示例。

## 一、流程总览（核心点）

1. **前端发起聊天流式请求**
   - 页面通过 SSE 发送请求到后端：`/api/chat/sessions/{session_id}/stream?message=...`

2. **后端聊天服务调用 LLM（带工具）**
   - 后端将 `find_agent`、`run_agent` 两个工具注册给 LLM，并启用 `tool_choice="auto"`
   - 由 LLM 决定是否调用工具

3. **智能体匹配（find_agent）**
   - LLM 根据用户问题生成搜索关键词
   - `find_agent` 调用商店检索（store search）并返回候选智能体列表

4. **用户选择 + 智能体执行（run_agent）**
   - 用户确认要使用的智能体后，系统调用 `run_agent`
   - `run_agent` 自动处理输入/凭证检查，满足条件后立即执行或排程

5. **回传结果给用户**
   - 执行开始后，系统返回执行链接/状态信息
   - 后续消息或执行结果会通过聊天流式响应返回给前端

## 二、关键组件说明

- **Chat 服务入口**：`backend/server/v2/chat/routes.py`
- **主流式逻辑**：`backend/server/v2/chat/service.py`
- **工具注册**：`backend/server/v2/chat/tools/__init__.py`
- **智能体检索工具**：`backend/server/v2/chat/tools/find_agent.py`
- **智能体执行工具**：`backend/server/v2/chat/tools/run_agent.py`
- **商店搜索实现**：`backend/server/v2/store/db.py`
- **系统提示词（流程规则）**：`backend/server/v2/chat/prompts/chat_system.md`

## 三、完整示例：从用户提问到执行与回复

### 1) 用户提问
用户在聊天框输入：

> “帮我做一个每天早上 9 点自动汇总 AI 新闻的智能体。”

### 2) LLM 触发智能体匹配（find_agent）
系统模型判断这是智能体任务，自动调用工具：

```
find_agent(query="AI 新闻 汇总 每日")
```

后端执行搜索，返回候选智能体列表（例如 1~5 个）。

### 3) 用户选择智能体
系统提示用户选择其中一个智能体（比如：`autogpt/ai-news`）。
用户回复：“就用 autogpt/ai-news”。

### 4) run_agent 进入自动执行流程
系统调用：

```
run_agent(username_agent_slug="autogpt/ai-news")
```

- 如果缺少输入或凭证，系统会先返回缺失信息
- 若用户确认用默认输入或补齐参数，再调用第二次 run_agent：

```
run_agent(
  username_agent_slug="autogpt/ai-news",
  inputs={"topic": "AI 新闻", "time": "09:00"},
  schedule_name="Daily AI News",
  cron="0 9 * * *",
  timezone="Asia/Shanghai"
)
```

### 5) 用户收到执行结果
系统返回：
- 已创建执行/排程
- 提供智能体运行链接（如 `/library/agents/{id}`）
- 聊天界面显示“已开始执行”或“已安排定时执行”

---

## 四、关键点总结

- **匹配智能体不是硬编码规则**，而是 LLM 自动调用 `find_agent` 搜索市场候选
- **是否调用工具由 LLM 决定**，工具本身只负责检索与执行
- **用户确认后才执行**，避免误触发执行

如果你需要我补充实际 API 响应结构、SSE 消息格式或调试位置，请告诉我。

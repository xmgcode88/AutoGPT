# AutoGPT平台前后端模块功能详细说明文档

## 概述

AutoGPT平台是一个基于现代Web技术栈构建的AI智能体管理和执行系统。本文档详细说明前端和后端各个模块的功能，着重描述系统的核心功能实现。

## 系统架构总览

### 技术栈
- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：FastAPI + Python + PostgreSQL + Redis
- **实时通信**：WebSocket + Server-Sent Events (SSE)
- **消息队列**：RabbitMQ
- **容器化**：Docker + Docker Compose

### 核心设计理念
- **微服务架构**：模块化设计，职责分离
- **实时响应**：流式处理，即时反馈
- **智能驱动**：AI辅助的智能体发现和执行
- **用户友好**：直观的界面和流畅的交互体验

## 前端模块详细说明

### 1. 聊天模块 (Chat Module)

#### 1.1 主页面组件 (`/chat/page.tsx`)

**核心功能：**
- 聊天会话的入口和管理
- 用户身份验证和会话初始化
- 响应式布局和状态管理

**关键实现：**
```typescript
export default function ChatPage() {
  return (
    <main className="flex h-full flex-col">
      <ChatLoadingState />
      <ChatContainer />
    </main>
  );
}
```

**技术特点：**
- 使用React Server Components进行服务端渲染
- 集成加载状态管理
- 模块化组件结构

#### 1.2 聊天容器组件 (`ChatContainer.tsx`)

**核心功能：**
- 管理聊天消息的显示和交互
- 处理流式消息接收
- 集成输入组件和消息列表

**状态管理：**
```typescript
const { messages, streamingChunks, isStreaming, sendMessage } =
  useChatContainer({
    sessionId,
    initialMessages,
    onRefreshSession,
  });
```

**智能交互特性：**
- **快速操作建议**：预设常用查询模板
- **欢迎界面**：新用户引导和功能介绍
- **实时状态反馈**：显示连接状态和输入状态

#### 1.3 聊天容器Hook (`useChatContainer.ts`)

**核心职责：**
- 消息状态管理和持久化
- 流式数据处理和分块显示
- 错误处理和用户反馈

**关键功能实现：**

**消息处理逻辑：**
```typescript
const allMessages = useMemo(() => {
  const processedInitialMessages = initialMessages
    .filter((msg: Record<string, unknown>) => {
      if (!isValidMessage(msg)) {
        console.warn("Invalid message structure from backend:", msg);
        return false;
      }
      const content = String(msg.content || "").trim();
      const toolCalls = msg.tool_calls;
      return (
        content.length > 0 ||
        (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0)
      );
    })
    .map((msg: Record<string, unknown>) => {
      // 消息类型转换和标准化
      const content = String(msg.content || "");
      const role = String(msg.role || "assistant").toLowerCase();
      const toolCalls = msg.tool_calls;
      
      // 处理不同类型的消息
      if (role === "assistant" && toolCalls && isToolCallArray(toolCalls)) {
        return null; // 工具调用消息不直接显示
      }
      if (role === "tool") {
        const toolResponse = parseToolResponse(/*...*/);
        return toolResponse;
      }
      return {
        type: "message",
        role: role as "user" | "assistant" | "system",
        content,
        timestamp: msg.timestamp ? new Date(msg.timestamp as string) : undefined,
      };
    })
    .filter((msg): msg is ChatMessageData => msg !== null);

  return [...processedInitialMessages, ...messages];
}, [initialMessages, messages]);
```

**流式消息发送：**
```typescript
const sendMessage = useCallback(
  async function sendMessage(content: string, isUserMessage: boolean = true) {
    if (!sessionId) {
      console.error("Cannot send message: no session ID");
      return;
    }
    
    // 添加用户消息到界面
    if (isUserMessage) {
      const userMessage = createUserMessage(content);
      setMessages((prev) => [...filterAuthMessages(prev), userMessage]);
    }
    
    // 重置流式状态
    setStreamingChunks([]);
    streamingChunksRef.current = [];
    setHasTextChunks(false);
    
    // 创建事件分发器
    const dispatcher = createStreamEventDispatcher({
      setHasTextChunks,
      setStreamingChunks,
      streamingChunksRef,
      setMessages,
      sessionId,
    });
    
    try {
      await sendStreamMessage(sessionId, content, dispatcher, isUserMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message", {
        description: err instanceof Error ? err.message : "Failed to send message",
      });
    }
  },
  [sessionId, sendStreamMessage],
);
```

#### 1.4 流式事件处理 (`createStreamEventDispatcher.ts`)

**核心功能：**
- 处理Server-Sent Events (SSE)
- 解析不同类型的流式事件
- 实时更新UI状态

**事件类型处理：**
```typescript
export const createStreamEventDispatcher = ({
  setHasTextChunks,
  setStreamingChunks,
  streamingChunksRef,
  setMessages,
  sessionId,
}: HandlerDependencies) => {
  return (event: ParsedEvent) => {
    switch (event.type) {
      case "text":
        handleTextEvent(event, setHasTextChunks, setStreamingChunks, streamingChunksRef);
        break;
      case "agent_carousel":
        handleAgentCarouselEvent(event, setMessages);
        break;
      case "execution_started":
        handleExecutionStartedEvent(event, setMessages);
        break;
      case "credentials_setup":
        handleCredentialsSetupEvent(event, setMessages);
        break;
      case "no_results":
        handleNoResultsEvent(event, setMessages);
        break;
      case "error":
        handleErrorEvent(event, setMessages);
        break;
      default:
        console.warn("Unknown event type:", event.type);
    }
  };
};
```

#### 1.5 输入组件 (`ChatInput.tsx`)

**核心功能：**
- 用户输入界面和交互
- 支持多行输入和快捷键
- 输入验证和状态管理

**交互特性：**
- **自动调整高度**：根据内容自动调整输入框高度
- **快捷键支持**：Enter发送，Shift+Enter换行
- **状态反馈**：显示发送状态和错误提示
- **无障碍支持**：完整的键盘导航和屏幕阅读器支持

#### 1.6 消息组件 (`ChatMessage.tsx`)

**核心功能：**
- 渲染不同类型的聊天消息
- 支持工具调用结果的特殊显示
- 提供消息交互功能

**消息类型支持：**
- **用户消息**：简单的文本显示
- **助手消息**：支持Markdown渲染
- **工具响应**：结构化的结果显示
- **系统消息**：状态和通知信息

#### 1.7 专用消息组件

**智能体轮播消息 (`AgentCarouselMessage.tsx`)：**
```typescript
export function AgentCarouselMessage({ message }: AgentCarouselMessageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-600" />
        <span className="font-medium">AI Assistant</span>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-2">{message.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{message.message}</p>
        <div className="grid gap-3">
          {message.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**执行开始消息 (`ExecutionStartedMessage.tsx`)：**
- 显示智能体执行状态
- 提供执行链接和进度跟踪
- 支持实时状态更新

**凭证设置消息 (`ChatCredentialsSetup.tsx`)：**
- 引导用户配置所需凭证
- 提供安全的凭证输入界面
- 支持多种凭证类型

**无结果消息 (`NoResultsMessage.tsx`)：**
- 友好的无结果提示
- 提供搜索建议和帮助链接
- 引导用户尝试其他选项

### 2. 智能体库模块 (Library Module)

#### 2.1 主页面组件 (`/library/page.tsx`)

**核心功能：**
- 用户智能体库的统一管理界面
- 智能体列表展示和操作
- 搜索、排序和筛选功能

**页面结构：**
```typescript
export default function LibraryPage() {
  return (
    <main>
      <LibraryActionHeader />
      <FavoritesSection />
      <LibraryAgentList />
    </main>
  );
}
```

#### 2.2 智能体卡片组件 (`LibraryAgentCard.tsx`)

**核心功能：**
- 智能体信息的可视化展示
- 交互操作（执行、编辑、删除、分享）
- 状态指示和进度显示

**信息展示：**
- **基本信息**：名称、描述、创建者
- **统计数据**：运行次数、评分、使用时间
- **状态信息**：运行状态、可用性、更新时间
- **操作按钮**：执行、编辑、删除、收藏、分享

#### 2.3 搜索和筛选组件

**搜索栏 (`LibrarySearchBar.tsx`)：**
- 实时搜索功能
- 搜索历史和建议
- 高级搜索选项

**排序菜单 (`LibrarySortMenu.tsx`)：**
- 多种排序方式（名称、创建时间、运行次数、评分）
- 升序/降序切换
- 自定义排序规则

**操作头部 (`LibraryActionSubHeader.tsx`)：**
- 批量操作功能
- 视图切换（列表/网格）
- 导入/导出功能

#### 2.4 收藏功能 (`FavoritesSection.tsx`)

**核心功能：**
- 收藏智能体的快速访问
- 收藏夹管理（添加、移除、分组）
- 个性化推荐

#### 2.5 上传对话框 (`LibraryUploadAgentDialog.tsx`)

**核心功能：**
- 智能体文件上传和导入
- 支持多种格式（JSON、YAML）
- 预览和验证功能

**上传流程：**
1. **文件选择**：拖拽或点击选择文件
2. **格式验证**：检查文件格式和结构
3. **内容预览**：显示智能体基本信息
4. **导入确认**：确认导入并添加到库中

#### 2.6 通知系统

**通知卡片 (`LibraryNotificationCard.tsx`)：**
- 显示系统通知和更新
- 智能体状态变更提醒
- 版本更新和功能介绍

**通知下拉 (`LibraryNotificationDropdown.tsx`)：**
- 通知历史查看
- 通知设置管理
- 批量操作（标记已读、删除）

### 3. 通用组件模块

#### 3.1 加载状态组件 (`ChatLoadingState.tsx`)

**核心功能：**
- 聊天页面加载状态管理
- 连接状态指示
- 错误状态处理

**状态类型：**
- **初始化中**：创建会话和连接
- **连接中**：建立WebSocket/SSE连接
- **加载中**：获取历史消息
- **错误状态**：连接失败或超时

#### 3.2 认证组件 (`AuthPromptWidget.tsx`)

**核心功能：**
- 用户身份验证引导
- 登录/注册界面
- 权限提示和说明

#### 3.3 流式消息组件 (`StreamingMessage.tsx`)

**核心功能：**
- 实时显示流式文本
- 打字机效果
- 内容格式化和渲染

## 后端模块详细说明

### 1. 聊天服务模块 (Chat Service)

#### 1.1 聊天服务核心 (`chat/service.py`)

**核心职责：**
- 处理聊天会话的创建和管理
- 实现流式聊天响应
- 集成AI工具调用机制

**主要功能：**

**流式聊天完成：**
```python
async def stream_chat_completion(
    session_id: str,
    message: str | None = None,
    is_user_message: bool = True,
    user_id: str | None = None,
) -> AsyncGenerator[StreamBaseResponse, None]:
    """处理流式聊天请求，支持工具调用和智能体执行"""
    
    # 1. 获取或创建会话
    session = await get_or_create_chat_session(session_id, user_id)
    
    # 2. 添加用户消息
    if message and is_user_message:
        user_msg = ChatMessage(role="user", content=message)
        session.messages.append(user_msg)
        await upsert_chat_session(session)
    
    # 3. 准备AI工具
    tools = [
        FindAgentTool(session_id=session_id, user_id=user_id),
        RunAgentTool(session_id=session_id, user_id=user_id),
    ]
    
    # 4. 调用OpenAI API
    async with openai_client.stream(
        model="gpt-4o-mini",
        messages=session.to_openai_messages(),
        tools=tools,
        tool_choice="auto",
    ) as stream:
        async for chunk in stream:
            # 处理流式响应
            yield from handle_stream_chunk(chunk, session, tools)
```

**工具调用处理：**
```python
async def handle_tool_calls(
    tool_calls: list[ChatCompletionMessageToolCallParam],
    session: ChatSession,
    tools: list[BaseTool],
) -> AsyncGenerator[StreamBaseResponse, None]:
    """处理AI工具调用"""
    
    for tool_call in tool_calls:
        tool_name = tool_call.function.name
        tool_args = json.loads(tool_call.function.arguments)
        
        # 查找对应的工具
        tool = next((t for t in tools if t.name == tool_name), None)
        if not tool:
            yield ErrorResponse(
                message=f"Unknown tool: {tool_name}",
                session_id=session.session_id,
            )
            continue
        
        try:
            # 执行工具
            result = await tool.execute(**tool_args)
            
            # 添加工具响应到会话
            tool_msg = ChatMessage(
                role="tool",
                content=json.dumps(result.model_dump()),
                tool_call_id=tool_call.id,
            )
            session.messages.append(tool_msg)
            
            # 发送响应
            yield result
            
        except Exception as e:
            yield ErrorResponse(
                message=f"Tool execution failed: {str(e)}",
                session_id=session.session_id,
            )
```

#### 1.2 聊天数据模型 (`chat/model.py`)

**核心数据结构：**

**聊天消息模型：**
```python
class ChatMessage(BaseModel):
    role: str  # user, assistant, system, tool, function
    content: str | None = None
    name: str | None = None
    tool_call_id: str | None = None
    refusal: str | None = None
    tool_calls: list[dict] | None = None
    function_call: dict | None = None
```

**聊天会话模型：**
```python
class ChatSession(BaseModel):
    session_id: str
    user_id: str | None
    messages: list[ChatMessage]
    usage: list[Usage]  # Token使用统计
    credentials: dict[str, dict] = {}  # 用户凭证
    started_at: datetime
    updated_at: datetime
    successful_agent_runs: dict[str, int] = {}  # 成功执行的智能体统计
    successful_agent_schedules: dict[str, int] = {}  # 成功调度的智能体统计
```

**会话管理功能：**
```python
async def get_chat_session(
    session_id: str,
    user_id: str | None,
) -> ChatSession | None:
    """从Redis获取聊天会话"""
    redis_key = f"chat:session:{session_id}"
    async_redis = await get_redis_async()
    
    raw_session = await async_redis.get(redis_key)
    if raw_session is None:
        return None
    
    session = ChatSession.model_validate_json(raw_session)
    
    # 验证用户权限
    if session.user_id is not None and session.user_id != user_id:
        return None
    
    return session

async def upsert_chat_session(session: ChatSession) -> ChatSession:
    """保存聊天会话到Redis"""
    redis_key = f"chat:session:{session.session_id}"
    async_redis = await get_redis_async()
    
    await async_redis.setex(
        redis_key, 
        config.session_ttl, 
        session.model_dump_json()
    )
    
    return session
```

#### 1.3 AI工具实现

**FindAgentTool - 智能体发现工具：**
```python
class FindAgentTool(BaseTool):
    name = "find_agent"
    description = "Discover agents from the marketplace based on capabilities and user needs."
    
    async def execute(self, query: str) -> StreamBaseResponse:
        """执行智能体搜索"""
        
        # 1. 参数验证
        if not query.strip():
            return ErrorResponse(message="Please provide a search query")
        
        # 2. 搜索智能体
        store_results = await store_db.get_store_agents(
            search_query=query,
            page_size=5,
        )
        
        # 3. 转换结果格式
        agents = []
        for agent in store_results.agents:
            agent_id = f"{agent.creator}/{agent.slug}"
            agents.append(AgentInfo(
                id=agent_id,
                name=agent.agent_name,
                description=agent.description or "",
                source="marketplace",
                in_library=False,
                creator=agent.creator,
                category="general",
                rating=agent.rating,
                runs=agent.runs,
                is_featured=False,
            ))
        
        # 4. 返回结果
        if agents:
            return AgentCarouselResponse(
                message=f"Found {len(agents)} agent{'s' if len(agents) != 1 else ''} for '{query}'",
                title=f"Found {len(agents)} agent{'s' if len(agents) != 1 else ''} for '{query}'",
                agents=agents,
                count=len(agents),
                session_id=self.session_id,
            )
        else:
            return NoResultsResponse(
                message=f"No agents found matching '{query}'",
                session_id=self.session_id,
                suggestions=[
                    "Try more general terms",
                    "Browse categories in the marketplace",
                    "Check spelling",
                ],
            )
```

**RunAgentTool - 智能体执行工具：**
```python
class RunAgentTool(BaseTool):
    name = "run_agent"
    description = """Run or schedule an agent from the marketplace.
    
    The tool automatically handles the setup flow:
    - Returns missing inputs if required fields are not provided
    - Returns missing credentials if user needs to configure them
    - Executes immediately if all requirements are met
    - Schedules execution if cron expression is provided"""
    
    async def execute(
        self, 
        agent_id: str,
        inputs: dict[str, Any] | None = None,
        cron: str | None = None,
        schedule_name: str | None = None,
        user_timezone: str | None = None,
    ) -> StreamBaseResponse:
        """执行智能体"""
        
        # 1. 解析智能体ID
        try:
            creator, slug = agent_id.split("/", 1)
        except ValueError:
            return ErrorResponse(message="Invalid agent ID format")
        
        # 2. 获取智能体信息
        graph = await get_graph(creator, slug, version=0)
        if not graph:
            return ErrorResponse(message="Agent not found")
        
        # 3. 检查用户凭证
        graph_credentials, missing_creds = await match_user_credentials_to_graph(
            self.user_id, graph
        )
        
        if missing_creds:
            return CredentialsSetupResponse(
                message="Please configure the required credentials to run this agent",
                credentials=missing_creds,
                session_id=self.session_id,
            )
        
        # 4. 检查输入参数
        required_fields = set(graph.input_schema.get("required", []))
        provided_inputs = set(inputs.keys() if inputs else [])
        missing_inputs = required_fields - provided_inputs
        
        if missing_inputs:
            return MissingInputsResponse(
                message="Please provide the required inputs to run this agent",
                inputs=graph.input_schema,
                missing=list(missing_inputs),
                session_id=self.session_id,
            )
        
        # 5. 创建或获取库副本
        library_agent = await get_or_create_library_agent(graph, self.user_id)
        
        # 6. 执行或调度
        if cron:
            # 定时执行
            result = await get_scheduler_client().add_execution_schedule(
                user_id=self.user_id,
                graph_id=library_agent.graph_id,
                graph_version=library_agent.graph_version,
                name=schedule_name or f"Scheduled {graph.name}",
                cron=cron,
                input_data=inputs or {},
                input_credentials=graph_credentials,
                user_timezone=user_timezone,
            )
            
            return ScheduleCreatedResponse(
                message="Agent scheduled successfully",
                schedule_id=result.schedule_id,
                session_id=self.session_id,
            )
        else:
            # 立即执行
            execution = await execution_utils.add_graph_execution(
                graph_id=library_agent.graph_id,
                user_id=self.user_id,
                inputs=inputs or {},
                graph_credentials_inputs=graph_credentials,
            )
            
            return ExecutionStartedResponse(
                message="Agent execution started",
                execution_id=execution.id,
                graph_id=library_agent.graph_id,
                graph_version=library_agent.graph_version,
                session_id=self.session_id,
            )
```

### 2. 智能体库服务模块 (Library Service)

#### 2.1 智能体管理核心功能

**智能体获取和创建：**
```python
async def get_or_create_library_agent(
    graph: GraphModel,
    user_id: str,
) -> AgentModel:
    """获取或创建用户库中的智能体副本"""
    
    # 1. 检查是否已存在
    existing_agent = await agent_db.get_agent_by_graph_id_and_user(
        graph_id=graph.id,
        user_id=user_id,
    )
    
    if existing_agent:
        return existing_agent
    
    # 2. 创建新副本
    new_agent = AgentModel(
        id=str(uuid.uuid4()),
        graph_id=graph.id,
        graph_version=graph.version,
        user_id=user_id,
        name=graph.name,
        description=graph.description,
        is_active=True,
        is_archived=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    
    return await agent_db.create_agent(new_agent)
```

**智能体搜索和筛选：**
```python
async def get_library_agents(
    user_id: str,
    search_query: str | None = None,
    category: str | None = None,
    is_favorite: bool | None = None,
    is_active: bool | None = None,
    sort_by: str = "updated_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 20,
) -> PaginatedAgentsResponse:
    """获取用户智能体库列表"""
    
    # 1. 构建查询条件
    filters = {"user_id": user_id}
    if search_query:
        filters["search_query"] = search_query
    if category:
        filters["category"] = category
    if is_favorite is not None:
        filters["is_favorite"] = is_favorite
    if is_active is not None:
        filters["is_active"] = is_active
    
    # 2. 执行查询
    agents, total = await agent_db.get_agents_paginated(
        filters=filters,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )
    
    # 3. 转换结果
    agent_list = []
    for agent in agents:
        # 获取执行统计
        execution_stats = await execution_db.get_agent_execution_stats(
            agent.graph_id, user_id
        )
        
        agent_list.append(AgentInfo(
            id=agent.id,
            name=agent.name,
            description=agent.description or "",
            source="library",
            in_library=True,
            creator="user",
            category=agent.category or "general",
            rating=agent.rating or 0.0,
            runs=execution_stats.run_count,
            is_featured=False,
            is_favorite=agent.is_favorite,
            is_active=agent.is_active,
            last_run=execution_stats.last_run,
            created_at=agent.created_at,
            updated_at=agent.updated_at,
        ))
    
    return PaginatedAgentsResponse(
        agents=agent_list,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )
```

#### 2.2 智能体执行管理

**执行状态跟踪：**
```python
async def get_agent_execution_status(
    execution_id: str,
    user_id: str,
) -> ExecutionStatusResponse:
    """获取智能体执行状态"""
    
    # 1. 获取执行记录
    execution = await execution_db.get_execution(execution_id, user_id)
    if not execution:
        return ErrorResponse(message="Execution not found")
    
    # 2. 获取执行日志
    logs = await execution_db.get_execution_logs(execution_id)
    
    # 3. 获取执行结果
    result = await execution_db.get_execution_result(execution_id)
    
    return ExecutionStatusResponse(
        execution_id=execution.id,
        status=execution.status,
        started_at=execution.started_at,
        completed_at=execution.completed_at,
        duration=execution.duration,
        logs=logs,
        result=result,
        error_message=execution.error_message,
    )
```

### 3. 市场服务模块 (Store Service)

#### 3.1 智能体市场管理

**市场智能体搜索：**
```python
async def get_store_agents(
    search_query: str | None = None,
    category: str | None = None,
    creators: list[str] | None = None,
    featured: bool = False,
    sort_by: str = "updated_at",
    page: int = 1,
    page_size: int = 20,
) -> PaginatedStoreAgentsResponse:
    """搜索市场智能体"""
    
    # 1. 构建SQL查询
    where_parts = ["is_available = true"]
    params: list[Any] = []
    
    if search_query:
        # 全文搜索
        where_parts.append("search @@ plainto_tsquery('english', $1)")
        params.append(search_query)
    
    if category:
        where_parts.append("$2 = ANY(categories)")
        params.append(category)
    
    if creators:
        where_parts.append("creator_username = ANY($3)")
        params.append(creators)
    
    if featured:
        where_parts.append("featured = true")
    
    # 2. 构建排序
    order_by_clause = {
        "rating": "rating DESC, ts_rank_cd(search, plainto_tsquery('english', $1)) DESC",
        "runs": "runs DESC, ts_rank_cd(search, plainto_tsquery('english', $1)) DESC",
        "name": "agent_name ASC, ts_rank_cd(search, plainto_tsquery('english', $1)) ASC",
        "updated_at": "updated_at DESC, ts_rank_cd(search, plainto_tsquery('english', $1)) DESC",
    }.get(sort_by, "updated_at DESC")
    
    # 3. 执行查询
    query = f"""
        SELECT 
            slug, agent_name, agent_image, creator_username,
            creator_avatar, sub_heading, description, runs, rating,
            categories, featured, is_available, updated_at,
            ts_rank_cd(search, plainto_tsquery('english', $1)) AS rank
        FROM store_agents
        WHERE {' AND '.join(where_parts)}
        ORDER BY {order_by_clause}
        LIMIT ${len(params) + 1} OFFSET ${len(params) + 2}
    """
    
    params.extend([page_size, (page - 1) * page_size])
    
    agents = await db.execute_query(query, params)
    total = await db.get_count("store_agents", {' AND '.join(where_parts)}, params[:-2])
    
    return PaginatedStoreAgentsResponse(
        agents=[StoreAgentInfo(**agent) for agent in agents],
        total=total,
        page=page,
        page_size=page_size,
    )
```

#### 3.2 智能体版本管理

**版本控制：**
```python
async def create_graph_version(
    graph_id: str,
    version_data: dict[str, Any],
    user_id: str,
) -> GraphVersionModel:
    """创建智能体新版本"""
    
    # 1. 获取当前版本
    current_version = await graph_db.get_latest_version(graph_id)
    
    # 2. 创建新版本
    new_version = GraphVersionModel(
        id=str(uuid.uuid4()),
        graph_id=graph_id,
        version=current_version.version + 1,
        name=version_data.get("name"),
        description=version_data.get("description"),
        input_schema=version_data.get("input_schema", {}),
        output_schema=version_data.get("output_schema", {}),
        credentials_input_schema=version_data.get("credentials_input_schema", {}),
        nodes=version_data.get("nodes", []),
        edges=version_data.get("edges", []),
        is_active=True,
        created_by=user_id,
        created_at=datetime.now(UTC),
    )
    
    # 3. 保存版本
    await graph_db.create_version(new_version)
    
    # 4. 更新智能体状态
    await graph_db.update_graph(graph_id, {"updated_at": datetime.now(UTC)})
    
    return new_version
```

### 4. 执行服务模块 (Execution Service)

#### 4.1 智能体执行引擎

**执行管理：**
```python
async def add_graph_execution(
    graph_id: str,
    user_id: str,
    inputs: dict[str, Any],
    graph_credentials_inputs: dict[str, dict] | None = None,
) -> ExecutionModel:
    """添加智能体执行任务"""
    
    # 1. 创建执行记录
    execution = ExecutionModel(
        id=str(uuid.uuid4()),
        graph_id=graph_id,
        user_id=user_id,
        status="pending",
        inputs=inputs,
        graph_credentials_inputs=graph_credentials_inputs or {},
        started_at=datetime.now(UTC),
        created_at=datetime.now(UTC),
    )
    
    # 2. 保存到数据库
    await execution_db.create_execution(execution)
    
    # 3. 发送到执行队列
    await execution_queue.send({
        "execution_id": execution.id,
        "graph_id": graph_id,
        "user_id": user_id,
        "inputs": inputs,
        "credentials": graph_credentials_inputs or {},
    })
    
    return execution
```

**执行处理器：**
```python
async def process_execution(execution_data: dict[str, Any]) -> None:
    """处理智能体执行"""
    
    execution_id = execution_data["execution_id"]
    graph_id = execution_data["graph_id"]
    user_id = execution_data["user_id"]
    inputs = execution_data["inputs"]
    credentials = execution_data["credentials"]
    
    try:
        # 1. 更新执行状态
        await execution_db.update_execution(
            execution_id, 
            {"status": "running", "started_at": datetime.now(UTC)}
        )
        
        # 2. 获取智能体定义
        graph = await graph_db.get_graph(graph_id)
        if not graph:
            raise ValueError(f"Graph {graph_id} not found")
        
        # 3. 创建执行环境
        executor = GraphExecutor(
            graph=graph,
            inputs=inputs,
            credentials=credentials,
            user_id=user_id,
        )
        
        # 4. 执行智能体
        result = await executor.execute()
        
        # 5. 保存结果
        await execution_db.update_execution(
            execution_id,
            {
                "status": "completed",
                "completed_at": datetime.now(UTC),
                "result": result,
                "duration": (datetime.now(UTC) - execution.started_at).total_seconds(),
            }
        )
        
    except Exception as e:
        # 错误处理
        await execution_db.update_execution(
            execution_id,
            {
                "status": "failed",
                "completed_at": datetime.now(UTC),
                "error_message": str(e),
                "duration": (datetime.now(UTC) - execution.started_at).total_seconds(),
            }
        )
        
        # 发送错误通知
        await notification_service.send_error_notification(user_id, execution_id, str(e))
```

#### 4.2 调度服务

**定时任务调度：**
```python
async def add_execution_schedule(
    user_id: str,
    graph_id: str,
    graph_version: int,
    name: str,
    cron: str,
    input_data: dict[str, Any],
    input_credentials: dict[str, dict],
    user_timezone: str | None = None,
) -> ScheduleModel:
    """添加定时执行任务"""
    
    # 1. 验证cron表达式
    try:
        croniter(cron)
    except ValueError as e:
        raise ValueError(f"Invalid cron expression: {e}")
    
    # 2. 计算下次执行时间
    cron_obj = croniter(cron, datetime.now(UTC))
    next_run = cron_obj.get_next(datetime)
    
    # 3. 创建调度记录
    schedule = ScheduleModel(
        id=str(uuid.uuid4()),
        user_id=user_id,
        graph_id=graph_id,
        graph_version=graph_version,
        name=name,
        cron=cron,
        input_data=input_data,
        input_credentials=input_credentials,
        is_active=True,
        next_run=next_run,
        user_timezone=user_timezone,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    
    # 4. 保存调度
    await scheduler_db.create_schedule(schedule)
    
    # 5. 添加到调度队列
    await scheduler_queue.schedule(schedule.id, next_run)
    
    return schedule
```

### 5. 用户管理模块 (User Service)

#### 5.1 身份验证和授权

**用户认证：**
```python
async def authenticate_user(
    token: str,
) -> UserModel | None:
    """验证用户身份"""
    
    try:
        # 1. 解析JWT令牌
        payload = jwt.decode(token, config.jwt_secret, algorithms=["HS256"])
        user_id = payload.get("sub")
        
        if not user_id:
            return None
        
        # 2. 获取用户信息
        user = await user_db.get_user(user_id)
        if not user or not user.is_active:
            return None
        
        # 3. 检查令牌有效期
        if payload.get("exp", 0) < time.time():
            return None
        
        return user
        
    except jwt.PyJWTError:
        return None
```

**权限管理：**
```python
async def check_user_permission(
    user_id: str,
    resource_type: str,
    resource_id: str,
    action: str,
) -> bool:
    """检查用户权限"""
    
    # 1. 获取用户角色
    user_roles = await user_db.get_user_roles(user_id)
    
    # 2. 检查资源所有权
    if resource_type == "agent":
        agent = await agent_db.get_agent(resource_id)
        if agent and agent.user_id == user_id:
            return True
    
    # 3. 检查角色权限
    for role in user_roles:
        permissions = await role_db.get_role_permissions(role.role_id)
        if any(
            p.resource_type == resource_type 
            and p.action == action 
            for p in permissions
        ):
            return True
    
    return False
```

#### 5.2 凭证管理

**凭证存储：**
```python
async def store_user_credential(
    user_id: str,
    provider: str,
    credential_data: dict[str, Any],
) -> CredentialModel:
    """存储用户凭证"""
    
    # 1. 加密敏感数据
    encrypted_data = encrypt_credential(credential_data)
    
    # 2. 创建凭证记录
    credential = CredentialModel(
        id=str(uuid.uuid4()),
        user_id=user_id,
        provider=provider,
        encrypted_data=encrypted_data,
        is_active=True,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    
    # 3. 保存到数据库
    await credential_db.create_credential(credential)
    
    return credential

async def get_user_credentials(
    user_id: str,
    provider: str | None = None,
) -> list[CredentialModel]:
    """获取用户凭证"""
    
    credentials = await credential_db.get_user_credentials(user_id, provider)
    
    # 解密数据
    for cred in credentials:
        cred.data = decrypt_credential(cred.encrypted_data)
    
    return credentials
```

### 6. 通知服务模块 (Notification Service)

#### 6.1 实时通知

**WebSocket通知：**
```python
async def send_websocket_notification(
    user_id: str,
    notification_type: str,
    data: dict[str, Any],
) -> None:
    """发送WebSocket实时通知"""
    
    # 1. 获取用户连接
    connections = await connection_manager.get_user_connections(user_id)
    
    # 2. 构建通知消息
    message = {
        "type": notification_type,
        "data": data,
        "timestamp": datetime.now(UTC).isoformat(),
    }
    
    # 3. 发送到所有连接
    for connection in connections:
        await connection.send_json(message)
```

**邮件通知：**
```python
async def send_email_notification(
    user_id: str,
    template: str,
    data: dict[str, Any],
) -> None:
    """发送邮件通知"""
    
    # 1. 获取用户邮箱
    user = await user_db.get_user(user_id)
    if not user or not user.email:
        return
    
    # 2. 渲染邮件模板
    html_content = await render_email_template(template, data)
    
    # 3. 发送邮件
    await email_service.send(
        to=user.email,
        subject=data.get("subject", "AutoGPT Notification"),
        html=html_content,
    )
```

## 系统核心功能总结

### 1. 智能对话系统
- **自然语言交互**：支持多轮对话和上下文理解
- **流式响应**：实时显示AI回复，提升用户体验
- **工具集成**：AI可以调用各种工具来完成任务
- **会话管理**：持久化会话状态，支持会话恢复

### 2. 智能体发现和推荐
- **智能搜索**：基于PostgreSQL全文搜索的智能体发现
- **个性化推荐**：根据用户历史和偏好推荐智能体
- **分类浏览**：按类别、创建者、评分等多维度筛选
- **实时更新**：智能体状态和信息的实时同步

### 3. 智能体执行引擎
- **多种执行模式**：立即执行、定时调度、事件触发
- **状态跟踪**：实时监控执行状态和进度
- **错误处理**：完善的错误处理和重试机制
- **资源管理**：智能的资源分配和调度

### 4. 用户管理和安全
- **身份认证**：JWT令牌认证和会话管理
- **权限控制**：基于角色的访问控制(RBAC)
- **凭证安全**：加密存储和安全的凭证管理
- **审计日志**：完整的操作审计和日志记录

### 5. 实时通信和通知
- **WebSocket**：实时双向通信
- **Server-Sent Events**：服务器推送事件
- **多渠道通知**：WebSocket、邮件、应用内通知
- **消息队列**：可靠的消息传递和处理

### 6. 数据管理和分析
- **数据持久化**：PostgreSQL关系型数据库
- **缓存优化**：Redis缓存提升性能
- **数据分析**：使用统计和行为分析
- **备份恢复**：数据备份和灾难恢复

## 技术特色和创新点

### 1. AI驱动的智能体发现
- 结合OpenAI GPT模型的智能理解能力
- 自动分析用户需求并推荐合适的智能体
- 持续学习和优化的推荐算法

### 2. 流式处理技术
- 基于SSE的流式响应，提供实时用户体验
- 分块传输和增量更新，减少延迟
- 优雅的错误处理和状态恢复

### 3. 模块化架构设计
- 高内聚、低耦合的模块设计
- 微服务架构支持水平扩展
- 清晰的接口定义和文档

### 4. 安全性设计
- 多层安全防护机制
- 数据加密和访问控制
- 安全的凭证管理和传输

### 5. 用户体验优化
- 直观的用户界面设计
- 响应式布局支持多设备
- 丰富的交互反馈和引导

这个系统通过精心设计的前后端模块协作，实现了从用户自然语言输入到智能体自动发现、配置和执行的完整流程，为用户提供了强大而易用的AI自动化平台。

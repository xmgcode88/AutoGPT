/**
 * Maps internal tool names to user-friendly display names with emojis.
 * @deprecated Use getToolActionPhrase or getToolCompletionPhrase for status messages
 *
 * @param toolName - The internal tool name from the backend
 * @returns A user-friendly display name with an emoji prefix
 */
export function getToolDisplayName(toolName: string): string {
  const toolDisplayNames: Record<string, string> = {
    find_agent: "🔍 搜索市场",
    get_agent_details: "📋 获取智能体详情",
    check_credentials: "🔑 检查凭据",
    setup_agent: "⚙️ 设置智能体",
    run_agent: "▶️ 运行智能体",
    get_required_setup_info: "📝 获取设置要求",
  };
  return toolDisplayNames[toolName] || toolName;
}

/**
 * Maps internal tool names to human-friendly action phrases (present continuous).
 * Used for tool call messages to indicate what action is currently happening.
 *
 * @param toolName - The internal tool name from the backend
 * @returns A human-friendly action phrase in present continuous tense
 */
export function getToolActionPhrase(toolName: string): string {
  const toolActionPhrases: Record<string, string> = {
    find_agent: "正在市场中搜索智能体",
    agent_carousel: "正在市场中搜索智能体",
    get_agent_details: "正在了解智能体",
    check_credentials: "正在检查您的凭据",
    setup_agent: "正在设置智能体",
    execution_started: "正在运行智能体",
    run_agent: "正在运行智能体",
    get_required_setup_info: "正在获取设置要求",
    schedule_agent: "正在调度智能体运行",
  };

  // Return mapped phrase or generate human-friendly fallback
  return toolActionPhrases[toolName] || toolName;
}

/**
 * Maps internal tool names to human-friendly completion phrases (past tense).
 * Used for tool response messages to indicate what action was completed.
 *
 * @param toolName - The internal tool name from the backend
 * @returns A human-friendly completion phrase in past tense
 */
export function getToolCompletionPhrase(toolName: string): string {
  const toolCompletionPhrases: Record<string, string> = {
    find_agent: "已完成市场搜索",
    get_agent_details: "已获取智能体详情",
    check_credentials: "已检查凭据",
    setup_agent: "智能体设置完成",
    run_agent: "智能体执行已开始",
    get_required_setup_info: "已获取设置要求",
  };

  // Return mapped phrase or generate human-friendly fallback
  return (
    toolCompletionPhrases[toolName] ||
    `Finished ${toolName.replace(/_/g, " ").replace("...", "")}`
  );
}

/** Validate UUID v4 format */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

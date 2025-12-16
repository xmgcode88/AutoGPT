import type { ErrorCardI18n } from "@/components/molecules/ErrorCard/ErrorCard";

function normalizeBuilderKey(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

const exceptionMap: Record<string, string> = {
  "Auto Gpt": "AutoGPT",
  Gpt: "GPT",
  Creds: "Credentials",
  Id: "ID",
  Openai: "OpenAI",
  Api: "API",
  Url: "URL",
  Http: "HTTP",
  Json: "JSON",
  Ai: "AI",
  "You Tube": "YouTube",
};

function applyExceptions(str: string): string {
  for (const [key, value] of Object.entries(exceptionMap)) {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    str = str.replace(regex, value);
  }
  return str;
}

function beautifyBuilderLabel(value: string): string {
  const result = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return applyExceptions(result);
}

const BUILDER_BLOCK_CATEGORY_LABEL_ZH: Record<string, string> = {
  all: "全部",
  ai: "人工智能",
  agent: "智能体",
  basic: "基础",
  communication: "通讯",
  crm: "客户管理",
  data: "数据",
  developer_tools: "开发者工具",
  hardware: "硬件",
  input: "输入",
  issue_tracking: "问题跟踪",
  logic: "逻辑",
  marketing: "营销",
  multimedia: "多媒体",
  multimedia_output: "多媒体输出",
  multimediaoutput: "多媒体输出",
  output: "输出",
  productivity: "效率",
  safety: "安全",
  search: "搜索",
  social: "社交",
  socialtext: "社交文本",
  social_text: "社交文本",
  text: "文本",
};

export function localizeBlockCategoryName(category: string): string {
  const normalized = normalizeBuilderKey(category);
  return (
    BUILDER_BLOCK_CATEGORY_LABEL_ZH[normalized] ??
    beautifyBuilderLabel(category)
  );
}

const BUILDER_INTEGRATION_NAME_ZH: Record<string, string> = {
  developer_tools: "开发者工具",
  hardware: "硬件",
  input: "输入",
  issue_tracking: "问题跟踪",
  issuetracking: "问题跟踪",
  logic: "逻辑",
  marketing: "营销",
  productivity: "效率",
  multimedia_output: "多媒体输出",
  multimediaoutput: "多媒体输出",
  socialtext: "社交文本",
  social_text: "社交文本",
};

export function localizeIntegrationName(integrationName: string): string {
  if (!integrationName) return "";
  const normalized = normalizeBuilderKey(integrationName);
  return (
    BUILDER_INTEGRATION_NAME_ZH[normalized] ??
    beautifyBuilderLabel(integrationName)
  );
}

const BUILDER_BLOCK_NAME_ZH: Record<string, string> = {
  add_lead_to_campaign: "添加线索到活动",
  baas_bot_join_meeting: "BaaS 机器人加入会议",
  baas_bot_leave_meeting: "BaaS 机器人离开会议",
  ai_ad_maker_video_creator: "AI 广告视频生成器",
  ai_condition: "AI 条件判断",
  al_ad_maker_video_creator: "AI 广告视频生成器",
  al_condition: "AI 条件判断",
  ai_image_customizer: "AI 图片定制器",
  ai_image_generator: "AI 图片生成器",
  ai_music_generator: "AI 音乐生成器",
  ai_screenshot_to_video_ad: "AI 截图转视频广告",
  ai_shortform_video_creator: "AI 短视频生成器",
  // Logic
  calculator: "计算器",
  condition: "条件判断",
  if_input_matches: "输入匹配判断",
  count_items: "统计数量",
  data_sampling: "数据采样",
  step_through_items: "逐项遍历",
  exa_webset_ready_check: "Exa Webset 就绪检查",
  pinecone_init: "Pinecone 初始化",
  pinecone_insert: "Pinecone 写入数据",
  pinecone_query: "Pinecone 查询",
  // Issue tracking / Productivity
  linear_create_comment: "Linear 创建评论",
  linear_create_issue: "Linear 创建 Issue",
  linear_get_project_issues: "Linear 获取项目 Issue",
  linear_search_projects: "Linear 搜索项目",
  google_calendar_create_event: "创建 Google 日历事件",
  notion_create_page: "Notion 创建页面",
  notion_read_database: "Notion 读取数据库",
  notion_read_page: "Notion 读取页面",
  notion_read_page_markdown: "Notion 读取页面（Markdown）",
  notion_search: "Notion 搜索",
  todoist_close_task: "Todoist 关闭任务",
  todoist_create_comment: "Todoist 创建评论",
  todoist_create_label: "Todoist 创建标签",
  todoist_create_project: "Todoist 创建项目",
  todoist_create_task: "Todoist 创建任务",
  todoist_delete_comment: "Todoist 删除评论",
  todoist_delete_label: "Todoist 删除标签",
  todoist_delete_project: "Todoist 删除项目",
  todoist_delete_section: "Todoist 删除分区",
  todoist_delete_task: "Todoist 删除任务",
  todoist_get_comment: "Todoist 获取评论",
  todoist_get_comments: "Todoist 获取评论列表",
  todoist_get_label: "Todoist 获取标签",
  todoist_get_project: "Todoist 获取项目",
  todoist_get_section: "Todoist 获取分区",
  todoist_get_shared_labels: "Todoist 获取共享标签",
  todoist_get_task: "Todoist 获取任务",
  todoist_get_tasks: "Todoist 获取任务列表",
  todoist_list_collaborators: "Todoist 列出协作者",
  todoist_list_labels: "Todoist 列出标签",
  todoist_list_projects: "Todoist 列出项目",
  todoist_list_sections: "Todoist 列出分区",
  todoist_remove_shared_labels: "Todoist 移除共享标签",
  todoist_rename_shared_labels: "Todoist 重命名共享标签",
  todoist_reopen_task: "Todoist 重新打开任务",
  todoist_update_comment: "Todoist 更新评论",
  todoist_update_label: "Todoist 更新标签",
  todoist_update_project: "Todoist 更新项目",
  todoist_update_task: "Todoist 更新任务",
  // Multimedia
  add_audio_to_video: "为视频添加音频",
  loop_video: "循环视频",
  media_duration: "获取媒体时长",
  create_dictionary: "创建字典",
  add_to_dictionary: "添加到字典",
  find_in_dictionary: "在字典中查找",
  remove_from_dictionary: "从字典中移除",
  replace_dictionary_value: "替换字典值",
  dictionary_is_empty: "字典是否为空",
  create_list: "创建列表",
  add_to_list: "添加到列表",
  find_in_list: "在列表中查找",
  get_list_item: "获取列表元素",
  remove_from_list: "从列表中移除",
  replace_list_item: "替换列表元素",
  list_is_empty: "列表是否为空",
  file_store: "文件存储",
  firecrawl_search: "Firecrawl 网络搜索",
  firecrawl_extract: "Firecrawl 数据提取",
  firecrawl_map_website: "Firecrawl 网站地图",
  firecrawl_scrape: "Firecrawl 网页抓取",
  firecrawl_crawl: "Firecrawl 网站爬取",
  get_wikipedia_summary: "获取 Wikipedia 摘要",
  google_maps_search: "Google Maps 商家搜索",
  store_value: "存储值",
  print_to_console: "打印到控制台",
  note: "便签",
  perplexity_realtime_search: "Perplexity 实时搜索",
  search_people: "Apollo 搜索人员",
  search_organizations: "Apollo 搜索组织",
  search_memory: "搜索记忆",
  search_store_agents: "搜索商店智能体",
  search_the_web: "网络搜索",
  twitter_search_recent_tweets: "Twitter 搜索最新推文",
  twitter_search_spaces: "Twitter 搜索 Spaces",
  linear_search_issues: "Linear 搜索 Issues",
  linear_search_projects_2: "Linear 搜索项目",
  universal_type_converter: "通用类型转换",
  reverse_list_order: "反转列表顺序",
  human_in_the_loop: "人工审核",
  block_installation: "Block 安装",
  get_store_agent_details: "获取商店智能体详情",
  add_to_library_from_store: "从商店添加到库",
  list_library_agents: "列出库内智能体",
  agent_input: "智能体输入",
  agent_output: "智能体输出",
  agent_short_text_input: "短文本输入",
  agent_long_text_input: "长文本输入",
  agent_number_input: "数字输入",
  agent_date_input: "日期输入",
  agent_time_input: "时间输入",
  agent_file_input: "文件输入",
  agent_dropdown_input: "下拉选择输入",
  agent_toggle_input: "开关输入",
  agent_table_input: "表格输入",
  agent_google_drive_file_input: "Google Drive 文件选择",
  create_campaign: "创建活动",
  developer_tools: "开发者工具",
  gmail_add_label: "Gmail 添加标签",
  gmail_create_draft: "Gmail 创建草稿邮件",
  gmail_draft_reply: "Gmail 创建草稿回复",
  gmail_forward: "Gmail 转发邮件",
  gmail_get_profile: "Gmail 获取用户资料",
  gmail_get_thread: "Gmail 获取线程",
  gmail_list_labels: "Gmail 列出标签",
  gmail_read: "Gmail 读取邮件",
  gmail_remove_label: "Gmail 移除标签",
  gmail_reply: "Gmail 回复邮件",
  gmail_send: "Gmail 发送邮件",
  hardware: "硬件",
  hub_spot_company: "HubSpot 公司",
  hub_spot_contact: "HubSpot 联系人",
  hub_spot_engagement: "HubSpot 互动",
  input: "输入",
  issue_tracking: "问题跟踪",
  issuetracking: "问题跟踪",
  logic: "逻辑",
  marketing: "营销",
  productivity: "效率",
  multimedia_output: "多媒体输出",
  multimediaoutput: "多媒体输出",
  safety: "安全",
  save_campaign_sequences: "保存活动序列",
  nvidia_deepfake_detect: "Nvidia Deepfake 检测",
  search: "搜索",
  socialtext: "社交文本",
  social_text: "社交文本",
  airtable_create_base: "Airtable 创建 Base",
  airtable_create_field: "Airtable 添加字段",
  airtable_create_records: "Airtable 创建记录",
  airtable_create_table: "Airtable 创建表",
  airtable_delete_records: "Airtable 删除记录",
  airtable_get_record: "Airtable 获取记录",
  airtable_list_bases: "Airtable Base 列表",
  airtable_list_records: "Airtable 查询记录",
  airtable_list_schema: "Airtable 获取架构",
  airtable_update_field: "Airtable 更新字段",
  airtable_update_records: "Airtable 更新记录",
  airtable_update_table: "Airtable 更新表",
  airtable_webhook_trigger: "Airtable Webhook 触发器",
  baas_bot_delete_recording: "BaaS 删除会议录制",
  baas_bot_fetch_meeting_data: "BaaS 获取会议录制数据",
  data_for_seo_keyword_suggestions: "DataForSEO 关键词建议",
  data_for_seo_related_keywords: "DataForSEO 相关关键词",
  exa_create_import: "Exa 创建导入任务",
  exa_delete_import: "Exa 删除导入",
  exa_export_webset: "Exa 导出 Webset 数据",
  exa_get_import: "Exa 获取导入详情",
  exa_get_new_items: "Exa 获取新增项",
  exa_list_imports: "Exa 列出导入记录",
  file_read: "读取文件",
  google_calendar_read_events: "读取 Google 日历事件",
  google_sheets_append: "追加 Google 表格数据",
  google_sheets_batch_operations: "Google 表格批量操作",
  google_sheets_clear: "清除 Google 表格区域",
  google_sheets_create_spreadsheet: "创建 Google 表格",
  google_sheets_find: "Google 表格查找",
  google_sheets_find_replace: "Google 表格查找替换",
  google_sheets_format: "Google 表格格式化区域",
  google_sheets_manage_sheet: "管理 Google 工作表",
  google_sheets_metadata: "获取 Google 表格元数据",
  google_sheets_read: "读取 Google 表格",
  google_sheets_update_cell: "更新 Google 表格单元格",
  google_sheets_write: "写入 Google 表格",
  keyword_suggestion_extractor: "关键词建议字段提取",
  persist_information: "存储信息",
  read_spreadsheet: "解析表格文件",
  related_keyword_extractor: "相关关键词字段提取",
  retrieve_information: "读取信息",
  screenshot_web_page: "网页截图",
  compass_ai_trigger: "Compass AI 触发器",
  // Developer tools
  code_generation: "代码生成",
  execute_code: "执行代码",
  instantiate_code_sandbox: "创建代码沙箱",
  execute_code_step: "执行代码步骤",
  exa_code_context: "Exa 代码上下文",
  github_create_check_run: "创建检查运行",
  github_update_check_run: "更新检查运行",
  github_get_ci_results: "获取 CI 结果",
  github_comment: "发表评论",
  github_update_comment: "更新评论",
  github_list_comments: "列出评论",
  github_make_issue: "创建 Issue",
  github_read_issue: "读取 Issue",
  github_list_issues: "列出 Issue",
  github_add_label: "添加标签",
  github_remove_label: "移除标签",
  github_assign_issue: "分配 Issue 负责人",
  github_unassign_issue: "取消 Issue 负责人",
  github_list_pull_requests: "列出 Pull Request",
  github_make_pull_request: "创建 Pull Request",
  github_read_pull_request: "读取 Pull Request",
  github_assign_pr_reviewer: "指派评审人",
  github_unassign_pr_reviewer: "移除评审人",
  github_list_pr_reviewers: "列出评审人",
  github_list_tags: "列出标签",
  github_list_branches: "列出分支",
  github_list_discussions: "列出讨论",
  github_list_releases: "列出发布",
  github_read_file: "读取文件",
  github_read_folder: "读取文件夹",
  github_make_branch: "创建分支",
  github_delete_branch: "删除分支",
  github_create_file: "创建文件",
  github_update_file: "更新文件",
  github_create_repository: "创建仓库",
  github_list_stargazers: "列出 Star 用户",
  github_create_pr_review: "创建 PR 评审",
  github_list_pr_reviews: "列出 PR 评审",
  github_submit_pending_review: "提交待处理评审",
  github_resolve_review_discussion: "处理评审讨论",
  github_get_pr_review_comments: "获取 PR 评审评论",
  github_create_comment_object: "生成评论对象",
  github_create_status: "创建提交状态",
  github_pull_request_trigger: "Pull Request 触发器",
  // Discord
  read_discord_messages: "读取Discord消息",
  send_discord_message: "发送Discord消息",
  send_discord_dm: "发送Discord私信",
  send_discord_embed: "发送Discord嵌入消息",
  send_discord_file: "发送Discord文件",
  reply_to_discord_message: "回复Discord消息",
  discord_user_info: "获取Discord用户信息",
  discord_channel_info: "获取Discord频道信息",
  create_discord_thread: "创建Discord主题",
  discord_get_current_user: "获取当前Discord用户",
  // LinkedIn
  get_linkedin_profile: "获取LinkedIn个人资料",
  linkedin_person_lookup: "LinkedIn人员查找",
  linkedin_role_lookup: "LinkedIn职位查找",
  get_linkedin_profile_picture: "获取LinkedIn头像",
  // Twitter
  twitter_post_tweet: "发布推文",
  twitter_delete_tweet: "删除推文",
  twitter_like_tweet: "点赞推文",
  twitter_retweet: "转推",
  twitter_follow_user: "关注用户",
  twitter_get_user: "获取用户信息",
  twitter_get_tweet: "获取推文",
  // Social Media Posting (Ayrshare)
  post_to_facebook: "发布到Facebook",
  post_to_instagram: "发布到Instagram",
  post_to_x: "发布到X(Twitter)",
  post_to_linkedin: "发布到LinkedIn",
  post_to_tiktok: "发布到TikTok",
  post_to_youtube: "发布到YouTube",
  post_to_threads: "发布到Threads",
  post_to_telegram: "发布到Telegram",
  post_to_pinterest: "发布到Pinterest",
  post_to_snapchat: "发布到Snapchat",
  post_to_reddit: "发布到Reddit",
  post_to_bluesky: "发布到Bluesky",
  post_to_gmb: "发布到Google My Business",
  exa_code_context_search: "Exa 代码上下文搜索",
  smart_decision_maker_tool: "AI智能决策工具",
  get_weather_info: "获取天气信息",
  ai_conversation: "AI 会话",
  ai_image_editor: "AI 图片编辑器",
  ai_list_generator: "AI 列表生成器",
  ai_structured_response_generator: "AI 结构化响应生成器",
  ai_text_generator: "AI 文本生成器",
  ai_text_summarizer: "AI 文本摘要",
  ai_video_generator: "AI 视频生成器",
  ask_wolfram: "询问 Wolfram Alpha",
  bannerbear_text_overlay: "Bannerbear 文字叠加",
  create_talking_avatar_video: "口播头像视频生成",
  exa_answer: "Exa 问答",
  exa_create_enrichment: "Exa 创建 Enrichment",
  exa_search: "Exa 高级网络搜索",
  exa_create_research: "Exa 创建研究",
  exa_create_webset_search: "Exa 创建 Webset 搜索",
  exa_get_webset_search: "Exa 获取 Webset 搜索",
  exa_cancel_webset_search: "Exa 取消 Webset 搜索",
  exa_find_or_create_search: "Exa 查找或创建搜索",
  exa_wait_for_search: "Exa 等待搜索完成",
  exa_get_research: "Exa 获取研究结果",
  exa_wait_for_research: "Exa 等待研究完成",
  exa_list_research: "Exa 列出研究任务",
  exa_bulk_webset_items: "Exa 批量处理 Webset 项目",
  exa_cancel_enrichment: "Exa 取消 Enrichment",
  exa_cancel_webset: "Exa 取消 Webset",
  exa_wait_for_enrichment: "Exa 等待 Enrichment 完成",
  exa_wait_for_webset: "Exa 等待 Webset 完成",
  exa_webset_webhook: "Exa Webset Webhook",
  // Text processing blocks
  get_current_time: "获取当前时间",
  get_current_date: "获取当前日期",
  get_current_date_and_time: "获取当前日期和时间",
  countdown_timer: "倒计时器",
  ideogram_model: "Ideogram 模型",
  jina_chunking: "Jina 文本分块",
  jina_embedding: "Jina 向量嵌入",
  perplexity: "Perplexity 问答",
  replicate_flux_advanced_model: "Replicate Flux（高级）",
  replicate_model: "Replicate 模型",
  smart_decision_maker: "智能决策器",
  unreal_text_to_speech: "Unreal 文本转语音",
  slant3_d_order_webhook: "Slant3D 订单 Webhook",
  stagehand_observe: "Stagehand 观察",
  stagehand_act: "Stagehand 执行动作",
  stagehand_extract: "Stagehand 数据提取",
  // Text processing components
  text_decoder: "文本解码器",
  match_text_pattern: "文本模式匹配",
  extract_text_information: "文本信息提取",
  fill_text_template: "文本模板填充",
  combine_texts: "文本合并",
  text_split: "文本分割",
  text_replace: "文本替换",
  code_extraction: "代码提取器",
  count_words_and_char: "词数统计",
};

function stripTrailingBlockSuffix(value: string): string {
  return value.replace(/(?:\s|_|-)?block$/i, "").trim();
}

export function localizeBlockName(blockName: string): string {
  if (!blockName) return "";
  const normalized = normalizeBuilderKey(stripTrailingBlockSuffix(blockName));
  return (
    BUILDER_BLOCK_NAME_ZH[normalized] ??
    beautifyBuilderLabel(stripTrailingBlockSuffix(blockName))
  );
}

const BUILDER_BLOCK_DESCRIPTION_ZH_BY_ID: Record<string, string> = {
  // CreateCampaignBlock
  "8865699f-9188-43c4-89b0-79c84cfaa03e": "在 SmartLead 中创建活动",
  // AddLeadToCampaignBlock
  "fb8106a4-1a8f-42f9-a502-f6d07e6fe0ec": "在 SmartLead 中将线索添加到活动",
  // SaveCampaignSequencesBlock
  "e7d9f41c-dc10-4f39-98ba-a432abd128c0": "在 SmartLead 活动中保存序列",
  // BaasBotJoinMeetingBlock
  "377d1a6a-a99b-46cf-9af3-1d1b12758e04": "部署机器人加入并录制会议",
  // BaasBotLeaveMeetingBlock
  "bf77d128-8b25-4280-b5c7-2d553ba7e482": "将机器人从正在进行的会议中移除",
  // HubSpotCompanyBlock
  "3ae02219-d540-47cd-9c78-3ad6c7d9820a":
    "管理 HubSpot 公司：创建、更新和获取公司信息",
  // HubSpotContactBlock
  "5267326e-c4c1-4016-9f54-4e72ad02f813":
    "管理 HubSpot 联系人：创建、更新和获取联系人信息",
  // HubSpotEngagementBlock
  "c6524385-7d87-49d6-a470-248bd29ca765":
    "管理 HubSpot 互动：发送邮件并追踪互动指标",
  // GmailReadBlock
  "25310c70-b89b-43ba-b25c-4dfa7e2a481c": "从 Gmail 读取邮件",
  // GmailSendBlock
  "6c27abc2-e51d-499e-a85f-5a0041ba94f0":
    "通过 Gmail 发送邮件，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  // GmailCreateDraftBlock
  "e1eeead4-46cb-491e-8281-17b6b9c44a55":
    "在 Gmail 中创建草稿邮件，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  // GmailListLabelsBlock
  "3e1c2c1c-c689-4520-b956-1f3bf4e02bb7": "列出 Gmail 中的所有标签",
  // GmailAddLabelBlock
  "f884b2fb-04f4-4265-9658-14f433926ac9": "为 Gmail 邮件添加标签",
  // GmailRemoveLabelBlock
  "0afc0526-aba1-4b2b-888e-a22b7c3f359d": "从 Gmail 邮件移除标签",
  // GmailGetThreadBlock
  "21a79166-9df7-4b5f-9f36-96f639d86112": "根据 ID 获取完整 Gmail 会话线程",
  // GmailReplyBlock
  "12bf5a24-9b90-4f40-9090-4e86e6995e60":
    "回复 Gmail 线程，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  // GmailDraftReplyBlock
  "d7a9f3e2-8b4c-4d6f-9e1a-3c5b7f8d2a6e":
    "创建 Gmail 线程的草稿回复，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  // GmailGetProfileBlock
  "04b0d996-0908-4a4b-89dd-b9697ff253d3":
    "获取已认证用户的 Gmail 资料，包括邮箱地址和消息统计",
  // GmailForwardBlock
  "64d2301c-b3f5-4174-8ac0-111ca1e1a7c0":
    "转发 Gmail 邮件给其他收件人，自动识别 HTML 并正确格式化；保留原线程与附件",
  // AIShortformVideoCreatorBlock
  "361697fb-0c4f-4feb-aed3-8320c88c771b": "使用 revid.ai 创建短视频",
  // AIAdMakerVideoCreatorBlock
  "58bd2a19-115d-4fd1-8ca4-13b9e37fa6a0":
    "创建由 AI 生成的 30 秒广告（文字 + 图片）",
  // AIConditionBlock
  "553ec5b8-6c45-4299-8d75-b394d05f72ff":
    "使用 AI 评估自然语言条件，并提供条件输出",
  // AIImageCustomizerBlock
  "d76bbe4c-930e-4894-8469-b66775511f71":
    "使用 Google Gemini 2.5 的 Nano-Banana 模型生成并编辑自定义图片",
  // AIImageGeneratorBlock
  "ed1ae7a0-b770-4089-b520-1f0005fad19a":
    "通过统一接口调用多种 AI 模型生成图片",
  // AIMusicGeneratorBlock
  "44f6c8ad-d75c-4ae1-8209-aad1c0326928":
    "使用 Replicate 上的 Meta MusicGen 模型生成音乐",
  // AIScreenshotToVideoAdBlock
  "0f3e4635-e810-43d9-9e81-49e6f4e83b7c":
    "将截图转为引人入胜的 AI 头像配音广告视频",
  // CreateDictionaryBlock
  "b924ddf4-de4f-4b56-9a85-358930dcbc91":
    "使用指定的键值对创建字典，适用于一次性创建并填充所有值的场景",
  // AddToDictionaryBlock
  "31d1064e-7446-4693-a7d4-65e5ca1180d1":
    "向字典添加新的键值对。如果未提供字典，则会创建一个新的字典。",
  // FindInDictionaryBlock
  "0e50422c-6dee-4145-83d6-3a5a392f65de":
    "在输入的字典/对象/列表中查找指定键，并返回对应的值",
  // RemoveFromDictionaryBlock
  "46afe2ea-c613-43f8-95ff-6692c3ef6876": "从字典中移除指定的键值对",
  // ReplaceDictionaryValueBlock
  "27e31876-18b6-44f3-ab97-f6226d8b3889": "替换字典中指定键对应的值",
  // DictionaryIsEmptyBlock
  "a3cf3f64-6bb9-4cc6-9900-608a0b3359b0": "检查字典是否为空",
  // CreateListBlock
  "a912d5c7-6e00-4542-b2a9-8034136930e4":
    "使用指定的值创建列表，可根据最大数量或 token 上限分批输出列表",
  // AddToListBlock
  "aeb08fc1-2fc1-4141-bc8e-f758f183a822":
    "向列表添加新的元素（任意类型）。如果未提供列表，则会创建一个新的列表。",
  // FindInListBlock
  "5e2c6d0a-1e37-489f-b1d0-8e1812b23333": "查找值在列表中的索引位置",
  // GetListItemBlock
  "262ca24c-1025-43cf-a578-534e23234e97": "返回列表中指定索引的元素",
  // RemoveFromListBlock
  "d93c5a93-ac7e-41c1-ae5c-ef67e6e9b826": "按值或索引从列表中移除元素",
  // ReplaceListItemBlock
  "fbf62922-bea1-4a3d-8bac-23587f810b38": "替换列表中指定索引处的元素",
  // ListIsEmptyBlock
  "896ed73b-27d0-41be-813c-c1c1dc856c03": "检查列表是否为空",
  // FileStoreBlock
  "cbb50872-625b-42f0-8203-a2ae78242d8a": "将输入文件存储到临时目录中",
  // StoreValueBlock
  "1ff065e9-88e8-4358-9d82-8dc91f622ba9": "将输入值原样输出，便于在流程中复用",
  // PrintToConsoleBlock
  "f3b1c1b2-4c4f-4f0d-8d2f-4c4f0d8d2f4c": "将给定内容打印到控制台（用于调试）",
  // NoteBlock
  "cc10ff7b-7753-4ff2-9af6-9399b1a7eddc": "显示包含指定文本的便签",
  // UniversalTypeConverterBlock
  "95d1b990-ce13-4d88-9737-ba5c2070c97b":
    "将值转换为指定的通用类型（字符串/数字/布尔/列表/字典）",
  // ReverseListOrderBlock
  "422cb708-3109-4277-bfe3-bc2ae5812777": "反转列表元素的顺序",
  // HumanInTheLoopBlock
  "8b2a7b3c-6e9d-4a5f-8c1b-2e3f4a5b6c7d": "暂停执行，等待人工审批或修改数据",
  // BlockInstallationBlock
  "45e78db5-03e9-447f-9395-308d712f5f08":
    "给定一段代码字符串，验证并将对应的 block 安装到系统中",
  // GetStoreAgentDetailsBlock
  "b604f0ec-6e0d-40a7-bf55-9fd09997cced": "从商店获取智能体的详细信息",
  // SearchStoreAgentsBlock
  "39524701-026c-4328-87cc-1b88c8e2cb4c": "在商店中搜索智能体",
  // AddToLibraryFromStoreBlock
  "2602a7b1-3f4d-4e5f-9c8b-1a2b3c4d5e6f": "将商店中的智能体添加到你的个人库中",
  // ListLibraryAgentsBlock
  "082602d3-a74d-4600-9e9c-15b3af7eae98": "列出你个人库中的所有智能体",
  // AgentInputBlock
  "c0a8e994-ebf1-4a9c-a4d8-89d09c86741b": "用于用户输入的基础 block",
  // AgentOutputBlock
  "363ae599-353e-4804-937e-b2ee3cef3da4": "将流程输出保存以便用户查看",
  // AgentShortTextInputBlock
  "7fcd3bcb-8e1b-4e69-903d-32d3d4a92158": "单行短文本输入 block",
  // AgentLongTextInputBlock
  "90a56ffb-7024-4b2b-ab50-e26c5e5ab8ba": "多行长文本输入 block",
  // AgentNumberInputBlock
  "96dae2bb-97a2-41c2-bd2f-13a3b5a8ea98": "数字输入 block",
  // AgentDateInputBlock
  "7e198b09-4994-47db-8b4d-952d98241817": "日期输入 block",
  // AgentTimeInputBlock
  "2a1c757e-86cf-4c7e-aacf-060dc382e434": "时间输入 block",
  // AgentFileInputBlock
  "95ead23f-8283-4654-aef3-10c053b74a31":
    "文件上传输入 block（示例为字符串路径）",
  // AgentDropdownInputBlock
  "655d6fdf-a334-421c-b733-520549c07cd1": "下拉选择输入 block",
  // AgentToggleInputBlock
  "cbf36ab5-df4a-43b6-8a7f-f7ed8652116e": "布尔开关输入 block",
  // AgentTableInputBlock
  "5603b273-f41e-4020-af7d-fbc9c6a8d928": "支持自定义表头的表格数据输入 block",
  // AgentGoogleDriveFileInputBlock
  "d3b32f15-6fd7-40e3-be52-e083f51b19a2":
    "用于从 Google Drive 选择文件的输入 block",
  // Developer tools
  // CodeGenerationBlock
  "86a2a099-30df-47b4-b7e4-34ae5f83e0d5":
    "使用 OpenAI Codex（Responses API）生成或重构代码。",
  // ExecuteCodeBlock
  "0b02b072-abe7-11ef-8372-fb5d162dd712":
    "在具备联网能力的沙箱环境中执行代码。",
  // InstantiateCodeSandboxBlock
  "ff0861c9-1726-4aec-9e5b-bf53f3622112":
    "创建可联网的沙箱环境，供 Execute Code Step 模块运行代码。",
  // ExecuteCodeStepBlock
  "82b59b8e-ea10-4d57-9161-8b169b0adba6": "在已有的沙箱实例中执行代码。",
  // ExaCodeContextBlock
  "8f9e0d1c-2b3a-4567-8901-23456789abcd":
    "在 GitHub 仓库、文档与 Stack Overflow 中搜索相关代码示例。",
  // GithubCreateCheckRunBlock
  "2f45e89a-3b7d-4f22-b89e-6c4f5c7e1234":
    "为指定仓库的特定提交创建新的检查运行。",
  // GithubUpdateCheckRunBlock
  "8a23c567-9d01-4e56-b789-0c12d3e45678": "更新 GitHub 仓库中已有的检查运行。",
  // GithubGetCIResultsBlock
  "8ad9e103-78f2-4fdb-ba12-3571f2c95e98":
    "获取指定提交或 PR 的 CI 结果，并可在日志中查找特定错误/警告。",
  // GithubCommentBlock
  "a8db4d8d-db1c-4a25-a1b0-416a8c33602b":
    "在指定的 GitHub Issue 或 Pull Request 上发表评论。",
  // GithubUpdateCommentBlock
  "b3f4d747-10e3-4e69-8c51-f2be1d99c9a7":
    "更新指定的 GitHub Issue 或 Pull Request 上的评论。",
  // GithubListCommentsBlock
  "c4b5fb63-0005-4a11-b35a-0c2467bd6b59":
    "列出指定 GitHub Issue 或 Pull Request 的全部评论。",
  // GithubMakeIssueBlock
  "691dad47-f494-44c3-a1e8-05b7990f2dab":
    "在指定的 GitHub 仓库中创建新的 Issue。",
  // GithubReadIssueBlock
  "6443c75d-032a-4772-9c08-230c707c8acc":
    "读取指定 GitHub Issue 的正文、标题和创建者。",
  // GithubListIssuesBlock
  "c215bfd7-0e57-4573-8f8c-f7d4963dcd74":
    "列出指定 GitHub 仓库中的所有 Issue。",
  // GithubAddLabelBlock
  "98bd6b77-9506-43d5-b669-6b9733c4b1f1":
    "为指定的 GitHub Issue 或 Pull Request 添加标签。",
  // GithubRemoveLabelBlock
  "78f050c5-3e3a-48c0-9e5b-ef1ceca5589c":
    "移除指定 GitHub Issue 或 Pull Request 的标签。",
  // GithubAssignIssueBlock
  "90507c72-b0ff-413a-886a-23bbbd66f542": "为指定的 GitHub Issue 分配负责人。",
  // GithubUnassignIssueBlock
  "d154002a-38f4-46c2-962d-2488f2b05ece": "取消指定 GitHub Issue 的负责人。",
  // GithubListPullRequestsBlock
  "ffef3c4c-6cd0-48dd-817d-459f975219f4":
    "列出指定 GitHub 仓库的所有 Pull Request。",
  // GithubMakePullRequestBlock
  "dfb987f8-f197-4b2e-bf19-111812afd692":
    "在指定的 GitHub 仓库中创建新的 Pull Request。",
  // GithubReadPullRequestBlock
  "bf94b2a4-1a30-4600-a783-a8a44ee31301":
    "读取指定 Pull Request 的正文、标题、提交者和变更内容。",
  // GithubAssignPRReviewerBlock
  "c0d22c5e-e688-43e3-ba43-d5faba7927fd": "为指定的 Pull Request 指派评审人。",
  // GithubUnassignPRReviewerBlock
  "9637945d-c602-4875-899a-9c22f8fd30de": "从指定的 Pull Request 移除评审人。",
  // GithubListPRReviewersBlock
  "2646956e-96d5-4754-a3df-034017e7ed96":
    "列出指定 Pull Request 的全部评审人。",
  // GithubListTagsBlock
  "358924e7-9a11-4d1a-a0f2-13c67fe59e2e": "列出指定 GitHub 仓库的所有标签。",
  // GithubListBranchesBlock
  "74243e49-2bec-4916-8bf4-db43d44aead5": "列出指定 GitHub 仓库的所有分支。",
  // GithubListDiscussionsBlock
  "3ef1a419-3d76-4e07-b761-de9dad4d51d7": "列出指定 GitHub 仓库的最新讨论。",
  // GithubListReleasesBlock
  "3460367a-6ba7-4645-8ce6-47b05d040b92":
    "列出指定 GitHub 仓库的所有发布版本。",
  // GithubReadFileBlock
  "87ce6c27-5752-4bbc-8e26-6da40a3dcfd3": "读取指定 GitHub 仓库中文件的内容。",
  // GithubReadFolderBlock
  "1355f863-2db3-4d75-9fba-f91e8a8ca400":
    "读取指定 GitHub 仓库中某个文件夹的内容。",
  // GithubMakeBranchBlock
  "944cc076-95e7-4d1b-b6b6-b15d8ee5448d": "从指定源分支创建新的分支。",
  // GithubDeleteBranchBlock
  "0d4130f7-e0ab-4d55-adc3-0a40225e80f4": "删除指定的分支。",
  // GithubCreateFileBlock
  "8fd132ac-b917-428a-8159-d62893e8a3fe": "在 GitHub 仓库中创建新文件。",
  // GithubUpdateFileBlock
  "30be12a4-57cb-4aa4-baf5-fcc68d136076": "更新 GitHub 仓库中的现有文件。",
  // GithubCreateRepositoryBlock
  "029ec3b8-1cfd-46d3-b6aa-28e4a706efd1": "创建新的 GitHub 仓库。",
  // GithubListStargazersBlock
  "a4b9c2d1-e5f6-4g7h-8i9j-0k1l2m3n4o5p":
    "列出对指定 GitHub 仓库点过 Star 的全部用户。",
  // GithubCreatePRReviewBlock
  "84754b30-97d2-4c37-a3b8-eb39f268275b":
    "在 Pull Request 上创建评审，可选添加行内评论，支持草稿或直接提交。行内评论的 position 应对应 diff 中的行号（从首个 @@ 块开始计数）。",
  // GithubListPRReviewsBlock
  "f79bc6eb-33c0-4099-9c0f-d664ae1ba4d0":
    "列出指定 Pull Request 的所有评审记录。",
  // GithubSubmitPendingReviewBlock
  "2e468217-7ca0-4201-9553-36e93eb9357a":
    "提交指定 Pull Request 的待处理（草稿）评审。",
  // GithubResolveReviewDiscussionBlock
  "b4b8a38c-95ae-4c91-9ef8-c2cffaf2b5d1":
    "在 Pull Request 中解决或重新打开评审讨论线程。",
  // GithubGetPRReviewCommentsBlock
  "1d34db7f-10c1-45c1-9d43-749f743c8bd4":
    "获取指定 Pull Request 的全部评审评论，或提取指定评审下的评论。",
  // GithubCreateCommentObjectBlock
  "b7d5e4f2-8c3a-4e6b-9f1d-7a8b9c5e4d3f":
    "创建用于 GitHub 模块的评论对象。注意：用于评审评论时仅使用 path、body、position 字段，side 仅用于独立 PR 评论。",
  // GithubCreateStatusBlock
  "3d67f123-a4b5-4c89-9d01-2e34f5c67890": "在 GitHub 仓库中创建新的提交状态。",
  // GithubPullRequestTriggerBlock
  "6c60ec01-8128-419e-988f-96a063ee2fea":
    "监听 Pull Request 事件，并输出事件类型与载荷。",
  // Slant3DOrderWebhookBlock
  "8a74c2ad-0104-4640-962f-26c6b69e58cd":
    "在接收到 Slant3D 订单状态更新时触发，输出事件详情及发货追踪信息。",
  // StagehandObserveBlock
  "d3863944-0eaf-45c4-a0c9-63e0fe1ee8b9": "为工作流提供可执行动作建议。",
  // StagehandActBlock
  "86eba68b-9549-4c0b-a0db-47d85a56cc27":
    "通过在网页上执行操作与页面交互，用于构建可自愈、可预测并能适应站点变更的自动化流程。",
  // StagehandExtractBlock
  "fd3c0b18-2ba6-46ae-9339-fcb40537ad98": "从网页中提取结构化数据。",
  // AIConversationBlock
  "32a87eab-381e-4dd4-bdb8-4c47151be35a":
    "高级 LLM 调用：传入消息列表并发送给语言模型",
  // AIImageEditorBlock
  "3fd9c73d-4370-4925-a1ff-1b86b99fabfa":
    "使用 BlackForest Labs Flux Kontext 模型编辑图片",
  // AIListGeneratorBlock
  "9c0b0450-d199-458b-a731-072189dd6593":
    "调用大语言模型（LLM），根据提示生成值列表",
  // AIStructuredResponseGeneratorBlock
  "ed55ac19-356e-4243-a6cb-bc599e9b716f":
    "调用大语言模型（LLM），根据提示生成结构化对象",
  // AITextGeneratorBlock
  "1f292d4a-41a4-4977-9684-7c8d560b9f91":
    "调用大语言模型（LLM），根据提示生成文本",
  // AITextSummarizerBlock
  "a0a69be1-4528-491c-a85a-a4ab6873e3f0":
    "调用大语言模型（LLM）对长文本生成摘要",
  // AIVideoGeneratorBlock
  "530cf046-2ce0-4854-ae2c-659db17c7a46": "使用 FAL 的 AI 模型生成视频",
  // BannerbearTextOverlayBlock
  "c7d3a5c2-05fc-450e-8dce-3b0e04626009":
    "使用 Bannerbear 模板为图片添加文字叠加",
  // CreateTalkingAvatarVideoBlock
  "98c6f503-8c47-4b1c-a96d-351fc7c87dab":
    "集成 D-ID 创建口播头像视频并获取视频 URL",
  // ExaAnswerBlock
  "b79ca4cc-9d5e-47d1-9d4f-e3a2d7f28df5": "结合 Exa 搜索结果获取 LLM 问答",
  // ExaCreateEnrichmentBlock
  "71146ae8-0cb1-4a15-8cde-eae30de71cb6":
    "为 webset 条目创建 enrichment，提取更多结构化数据",
  // ExaCreateResearchBlock
  "a1f2e3d4-c5b6-4a78-9012-3456789abcde":
    "创建研究任务（可选等待）：探索网页并生成带引用的结论",
  // IdeogramModelBlock
  "6ab085e2-20b3-4055-bc3e-08036e01eca6": "以简单或高级设置运行 Ideogram 模型",
  // JinaChunkingBlock
  "806fb15e-830f-4796-8692-557d300ff43c":
    "使用 Jina AI 的分段服务对文本进行分块",
  // JinaEmbeddingBlock
  "7c56b3ab-62e7-43a2-a2dc-4ec4245660b6": "使用 Jina AI 生成向量嵌入",
  // PerplexityBlock
  "c8a5f2e9-8b3d-4a7e-9f6c-1d5e3c9b7a4f":
    "调用 Perplexity sonar 模型进行实时联网搜索，并返回带来源引用的回复",
  // ReplicateFluxAdvancedModelBlock
  "90f8c45e-e983-4644-aa0b-b4ebe2f531bc":
    "以高级设置在 Replicate 上运行 Flux 模型",
  // ReplicateModelBlock
  "c40d75a2-d0ea-44c9-a4f6-634bb3bdab1a": "同步运行 Replicate 模型",
  // SmartDecisionMakerBlock
  "3b191d9f-356f-482d-8238-ba04b6d18381": "使用 AI 智能决定要使用的工具",
  // UnrealTextToSpeechBlock
  "4ff1ff6d-cc40-4caa-ae69-011daa20c378":
    "使用 Unreal Speech API 将文本转为语音",
  // CalculatorBlock
  "b1ab9b19-67a6-406d-abf5-2dba76d00c79": "对两个数字执行数学运算",
  // ConditionBlock
  "715696a0-e1da-45c8-b209-c2fa9c3b0be6": "基于比较运算符执行条件判断",
  // IfInputMatchesBlock
  "6dbbc4b3-ca6c-42b6-b508-da52d23e13f2": "根据比较运算符判断输入是否匹配条件",
  // CountItemsBlock
  "3c9c2f42-b0c3-435f-ba35-05f7a25c772a": "统计集合中的条目数量",
  // DataSamplingBlock
  "4a448883-71fa-49cf-91cf-70d793bd7d87":
    "使用多种采样方法从给定数据集中抽取样本数据",
  // ExaWebsetReadyCheckBlock
  "faf9f0f3-e659-4264-b33b-284a02166bec":
    "检查 webset 是否已就绪，便于进行条件分支控制",
  // PineconeInitBlock
  "48d8fdab-8f03-41f3-8407-8107ba11ec9b": "初始化 Pinecone 索引",
  // PineconeInsertBlock
  "477f2168-cd91-475a-8146-9499a5982434": "向 Pinecone 索引写入数据",
  // PineconeQueryBlock
  "9ad93d0f-91b4-4c9c-8eb1-82e26b4a01c5": "在 Pinecone 索引中执行向量检索",
  // StepThroughItemsBlock
  "f66a3543-28d3-4ab5-8945-9b336371e2ce": "遍历列表或字典，并逐项输出每个元素",
  // LinearCreateCommentBlock
  "8f7d3a2e-9b5c-4c6a-8f1d-7c8b3e4a5d6c": "在 Linear Issue 下创建新评论",
  // LinearCreateIssueBlock
  "f9c68f55-dcca-40a8-8771-abf9601680aa": "在 Linear 中创建新 Issue",
  // LinearGetProjectIssuesBlock
  "c7d3f1e8-45a9-4b2c-9f81-3e6a8d7c5b1a":
    "获取 Linear 项目中的 Issue，可按状态与负责人过滤",
  // LinearSearchProjectsBlock
  "446a1d35-9d8f-4ac5-83ea-7684ec50e6af": "在 Linear 中搜索项目",
  // GoogleCalendarCreateEventBlock
  "ed2ec950-fbff-4204-94c0-023fb1d625e0":
    "在 Google 日历中创建新事件（支持自定义参数）",
  // GoogleCalendarReadEventsBlock
  "80bc3ed1-e9a4-449e-8163-a8fc86f74f6a":
    "从 Google 日历读取即将发生的事件，可按筛选条件过滤",
  // NotionCreatePageBlock
  "c15febe0-66ce-4c6f-aebd-5ab351653804":
    "在 Notion 中创建新页面（需提供父页面 ID 或父数据库 ID），支持 Markdown 内容",
  // NotionReadDatabaseBlock
  "fcd53135-88c9-4ba3-be50-cc6936286e6c":
    "查询 Notion 数据库，可选筛选与排序，返回结构化条目",
  // NotionReadPageBlock
  "5246cc1d-34b7-452b-8fc5-3fb25fd8f542":
    "按 ID 读取 Notion 页面并返回原始 JSON",
  // NotionReadPageMarkdownBlock
  "d1312c4d-fae2-4e70-893d-f4d07cce1d4e":
    "读取 Notion 页面并转换为 Markdown，保留标题、列表、链接和富文本格式",
  // NotionSearchBlock
  "313515dd-9848-46ea-9cd6-3c627c892c56":
    "在 Notion 工作区中按文本搜索页面和数据库",
  // TodoistCloseTaskBlock
  "29fac798-de15-11ef-b839-32d3674e8b7e": "关闭 Todoist 任务",
  // TodoistCreateCommentBlock
  "1bba7e54-2310-4a31-8e6f-54d5f9ab7459": "为 Todoist 任务或项目创建评论",
  // TodoistCreateLabelBlock
  "7288a968-de14-11ef-8997-32d3674e8b7e": "在 Todoist 中创建标签（同名会失败）",
  // TodoistCreateProjectBlock
  "ade60136-de14-11ef-b5e5-32d3674e8b7e": "在 Todoist 中创建项目",
  // TodoistCreateTaskBlock
  "fde4f458-de14-11ef-bf0c-32d3674e8b7e": "在 Todoist 项目中创建任务",
  // TodoistDeleteCommentBlock
  "bda4c020-ddf2-11ef-b114-32d3674e8b7e": "删除 Todoist 评论",
  // TodoistDeleteLabelBlock
  "901b8f86-de14-11ef-98b8-32d3674e8b7e": "删除 Todoist 个人标签",
  // TodoistDeleteProjectBlock
  "c2893acc-de14-11ef-a113-32d3674e8b7e": "删除 Todoist 项目及其所有内容",
  // TodoistDeleteSectionBlock
  "f0e52eee-de14-11ef-9b12-32d3674e8b7e": "删除 Todoist 分区及其中所有任务",
  // TodoistDeleteTaskBlock
  "33c29ada-de15-11ef-bcbb-32d3674e8b7e": "删除 Todoist 任务",
  // TodoistGetCommentBlock
  "a809d264-ddf2-11ef-9764-32d3674e8b7e": "获取一条 Todoist 评论",
  // TodoistGetCommentsBlock
  "9972d8ae-ddf2-11ef-a9b8-32d3674e8b7e": "获取 Todoist 任务或项目的全部评论",
  // TodoistGetLabelBlock
  "7f236514-de14-11ef-bd7a-32d3674e8b7e": "通过 ID 获取 Todoist 个人标签",
  // TodoistGetProjectBlock
  "b435b5ea-de14-11ef-8b51-32d3674e8b7e": "获取指定 Todoist 项目的详情",
  // TodoistGetSectionBlock
  "ea5580e2-de14-11ef-a5d3-32d3674e8b7e": "通过 ID 获取 Todoist 分区",
  // TodoistGetSharedLabelsBlock
  "55fba510-de15-11ef-aed2-32d3674e8b7e": "获取所有 Todoist 共享标签",
  // TodoistGetTaskBlock
  "16d7dc8c-de15-11ef-8ace-32d3674e8b7e": "获取一个活跃的 Todoist 任务",
  // TodoistGetTasksBlock
  "0b706e86-de15-11ef-a113-32d3674e8b7e": "获取活跃的 Todoist 任务列表",
  // TodoistListCollaboratorsBlock
  "c99c804e-de14-11ef-9f47-32d3674e8b7e": "列出指定 Todoist 项目的所有协作者",
  // TodoistListLabelsBlock
  "776dd750-de14-11ef-b927-32d3674e8b7e": "列出所有 Todoist 个人标签",
  // TodoistListProjectsBlock
  "5f3e1d5b-6bc5-40e3-97ee-1318b3f38813": "列出所有 Todoist 项目及其详情",
  // TodoistListSectionsBlock
  "d6a116d8-de14-11ef-a94c-32d3674e8b7e": "列出所有 Todoist 分区及其详情",
  // TodoistRemoveSharedLabelsBlock
  "a6c5cbde-de14-11ef-8863-32d3674e8b7e": "移除共享标签的所有实例",
  // TodoistRenameSharedLabelsBlock
  "9d63ad9a-de14-11ef-ab3f-32d3674e8b7e": "重命名共享标签的所有实例",
  // TodoistReopenTaskBlock
  "2e6bf6f8-de15-11ef-ae7c-32d3674e8b7e": "重新打开 Todoist 任务",
  // TodoistUpdateCommentBlock
  "b773c520-ddf2-11ef-9f34-32d3674e8b7e": "更新 Todoist 评论",
  // TodoistUpdateLabelBlock
  "8755614c-de14-11ef-9b56-32d3674e8b7e": "更新 Todoist 个人标签",
  // TodoistUpdateProjectBlock
  "ba41a20a-de14-11ef-91d7-32d3674e8b7e": "更新现有 Todoist 项目",
  // TodoistUpdateTaskBlock
  "1eee6d32-de15-11ef-a2ff-32d3674e8b7e": "更新现有 Todoist 任务",
  // AddAudioToVideoBlock
  "3503748d-62b6-4425-91d6-725b064af509":
    "使用 moviepy 将音频文件添加到视频文件中",
  // LoopVideoBlock
  "8bf9eef6-5451-4213-b265-25306446e94b": "将视频循环到指定时长或重复次数",
  // MediaDurationBlock
  "d8b91fd4-da26-42d4-8ecb-8b196c6d84b6": "获取媒体文件的时长",
  // Text Decoder Block
  "2570e8fe-8447-43ed-84c7-70d657923231": "将包含转义字符的字符串解码为实际文本",
  // Match Text Pattern Block
  "3060088f-6ed9-4928-9ba7-9c92823a7ccd": "使用正则表达式匹配文本，并根据匹配结果将数据转发到正输出或负输出",
  // Extract Text Information Block
  "3146e4fe-2cdd-4f29-bd12-0c9d5bb4deb0": "使用正则表达式模式从给定文本中提取信息",
  // Fill Text Template Block
  "db7d8f02-2f44-4c55-ab7a-eae0941f0c30": "使用格式模板和给定值格式化文本，支持Jinja2语法",
  // Combine Texts Block
  "e30a4d42-7b7d-4e6a-b36e-1f9b8e3b7d85": "将多个输入文本合并为单个输出文本",
  // Text Split Block
  "d5ea33c8-a575-477a-b42f-2fe3be5055ec": "使用分隔符将文本分割为字符串列表",
  // Text Replace Block
  "7e7c87ab-3469-4bcc-9abe-67705091b713": "将文本中的指定内容替换为新内容",
  // File Read Block
  "3735a31f-7e18-4aca-9e90-08a7120674bc": "读取文件内容并以字符串形式返回，支持按分隔符和大小限制分块",
  // Send Web Request Block
  "6595ae1f-b924-42cb-9a41-551a0611c4b4": "发送HTTP请求（支持JSON/表单/多部分格式）",
  // Send Authenticated Web Request Block
  "fff86bcd-e001-4bad-a7f6-2eae4720c8dc": "使用主机范围的凭据发送认证HTTP请求（支持JSON/表单/多部分格式）",
  // Post to Telegram Block
  "47bc74eb-4af2-452c-b933-af377c7287df": "通过Ayrshare发布内容到Telegram",
  // Code Extraction Block
  "d3a7d896-3b78-4f44-8b4b-48fbf4f0bcd8": "从文本中提取代码块并识别编程语言",
  // Count Words and Characters Block
  "ab2a782d-22cf-4587-8a70-55b59b3f9f90": "统计给定文本中的单词数和字符数",
  // Send Email Block (SMTP)
  "4335878a-394e-4e67-adf2-919877ff49ae": "使用提供的SMTP凭据发送邮件",
  // Validate Emails Block
  "e3950439-fa0b-40e8-b19f-e0dca0bf5853": "验证邮件地址的有效性",
};

const BUILDER_BLOCK_DESCRIPTION_ZH_BY_KEY: Record<string, string> = {
  add_lead_to_campaign: "在 SmartLead 中将线索添加到活动",
  baas_bot_join_meeting: "部署机器人加入并录制会议",
  baas_bot_leave_meeting: "将机器人从正在进行的会议中移除",
  ai_shortform_video_creator: "使用 revid.ai 创建短视频",
  ai_ad_maker_video_creator: "创建由 AI 生成的 30 秒广告（文字 + 图片）",
  ai_condition: "使用 AI 评估自然语言条件，并提供条件输出",
  exa_code_context: "在GitHub仓库、文档与StackOverflow中搜索相关代码示例",
  smart_decision_maker_ai: "使用AI智能决定要使用的工具",
  get_weather_information: "使用OpenWeatherMap API获取指定地点的天气信息",
  ai_conversation: "高级 LLM 调用：传入消息列表并发送给语言模型",
  ai_image_editor: "使用 BlackForest Labs Flux Kontext 模型编辑图片",
  ai_list_generator: "调用大语言模型（LLM），根据提示生成值列表",
  ai_structured_response_generator:
    "调用大语言模型（LLM），根据提示生成结构化对象",
  ai_text_generator: "调用大语言模型（LLM），根据提示生成文本",
  ai_text_summarizer: "调用大语言模型（LLM）对长文本生成摘要",
  ai_video_generator: "使用 FAL 的 AI 模型生成视频",
  ask_wolfram: "向 Wolfram Alpha 提问并获取答案",
  bannerbear_text_overlay: "使用 Bannerbear 模板为图片添加文字叠加",
  code_generation: "使用 OpenAI Codex（Responses API）生成或重构代码",
  create_talking_avatar_video: "集成 D-ID 创建口播头像视频并获取视频 URL",
  exa_answer: "结合 Exa 搜索结果获取 LLM 问答",
  exa_create_enrichment: "为 webset 条目创建 enrichment，提取更多结构化数据",
  exa_search: "使用 Exa 的高级搜索 API 搜索网络内容",
  exa_create_webset_search: "在 Exa Webset 中创建搜索任务",
  exa_get_webset_search: "获取 Exa Webset 搜索的结果",
  exa_cancel_webset_search: "取消 Exa Webset 搜索任务",
  exa_find_or_create_search: "查找或创建 Exa 搜索任务",
  exa_wait_for_search: "等待 Exa Webset 搜索完成",
  exa_create_research: "创建研究任务（可选等待）：探索网页并生成带引用的结论",
  exa_get_research: "获取 Exa 研究任务的结果",
  exa_wait_for_research: "等待 Exa 研究任务完成",
  exa_list_research: "列出所有的 Exa 研究任务",
  exa_bulk_webset_items: "批量处理 Exa Webset 中的项目",
  exa_cancel_enrichment: "取消 Exa Enrichment 任务",
  exa_cancel_webset: "取消 Exa Webset 任务",
  exa_code_context_search_github: "在 GitHub 仓库、文档与 Stack Overflow 中搜索相关代码示例",
  exa_contents: "获取网页的完整内容",
  exa_create_import: "创建 Exa 数据导入任务",
  exa_create_monitor: "创建 Exa Webset 监控",
  exa_create_or_find_webset: "创建或查找 Exa Webset",
  exa_create_webset: "创建新的 Exa Webset",
  exa_delete_enrichment: "删除 Exa Enrichment 任务",
  exa_delete_import: "删除 Exa 导入任务",
  exa_delete_monitor: "删除 Exa 监控",
  exa_delete_webset: "删除 Exa Webset",
  exa_delete_webset_item: "删除 Exa Webset 中的项目",
  exa_export_webset: "导出 Exa Webset 数据",
  exa_find_similar: "查找与给定内容相似的网页",
  exa_get_enrichment: "获取 Exa Enrichment 结果",
  exa_get_import: "获取 Exa 导入任务详情",
  exa_get_monitor: "获取 Exa 监控详情",
  exa_get_new_items: "获取 Exa Webset 中的新增项目",
  exa_get_webset: "获取 Exa Webset 详情",
  exa_get_webset_item: "获取 Exa Webset 项目详情",
  exa_list_imports: "列出所有 Exa 导入任务",
  exa_list_monitors: "列出所有 Exa 监控",
  exa_list_webset_items: "列出 Exa Webset 中的所有项目",
  exa_list_websets: "列出所有 Exa Websets",
  exa_preview_webset: "预览 Exa Webset 的搜索结果",
  exa_update_enrichment: "更新 Exa Enrichment 任务",
  exa_update_monitor: "更新 Exa 监控设置",
  exa_update_webset: "更新 Exa Webset 配置",
  exa_wait_for_enrichment: "等待 Exa Enrichment 任务完成",
  exa_wait_for_webset: "等待 Exa Webset 任务完成",
  exa_webset_items_summary: "获取 Exa Webset 项目的摘要统计",
  exa_webset_ready_check: "检查 Exa Webset 是否就绪",
  exa_webset_status: "获取 Exa Webset 的状态信息",
  exa_webset_summary: "获取 Exa Webset 的详细摘要",
  exa_webset_webhook: "处理 Exa Webset 的 Webhook 事件",
  ideogram_model: "以简单或高级设置运行 Ideogram 模型",
  jina_chunking: "使用 Jina AI 的分段服务对文本进行分块",
  jina_embedding: "使用 Jina AI 生成向量嵌入",
  replicate_flux_advanced_model: "以高级设置在 Replicate 上运行 Flux 模型",
  replicate_model: "同步运行 Replicate 模型",
  smart_decision_maker: "使用 AI 智能决定要使用的工具",
  stagehand_observe: "为工作流提供可执行动作建议",
  stagehand_act:
    "通过在网页上执行操作与页面交互，用于构建可自愈、可预测并能适应站点变更的自动化流程",
  stagehand_extract: "从网页中提取结构化数据",
  unreal_text_to_speech: "使用 Unreal Speech API 将文本转为语音",
  al_ad_maker_video_creator: "创建由 AI 生成的 30 秒广告（文字 + 图片）",
  al_condition: "使用 AI 评估自然语言条件，并提供条件输出",
  ai_image_customizer:
    "使用 Google Gemini 2.5 的 Nano-Banana 模型生成并编辑自定义图片",
  ai_image_generator: "通过统一接口调用多种 AI 模型生成图片",
  ai_music_generator: "使用 Replicate 上的 Meta MusicGen 模型生成音乐",
  ai_screenshot_to_video_ad: "将截图转为引人入胜的 AI 头像配音广告视频",
  create_campaign: "在 SmartLead 中创建活动",
  gmail_add_label: "为 Gmail 邮件添加标签",
  gmail_create_draft:
    "在 Gmail 中创建草稿邮件，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  gmail_draft_reply:
    "创建 Gmail 线程的草稿回复，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  gmail_forward:
    "转发 Gmail 邮件给其他收件人，自动识别 HTML 并正确格式化；保留原线程与附件",
  gmail_get_profile: "获取已认证用户的 Gmail 资料，包括邮箱地址和消息统计",
  gmail_get_thread: "根据 ID 获取完整 Gmail 会话线程",
  gmail_list_labels: "列出 Gmail 中的所有标签",
  gmail_read: "从 Gmail 读取邮件",
  gmail_remove_label: "从 Gmail 邮件移除标签",
  gmail_reply:
    "回复 Gmail 线程，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  gmail_send:
    "通过 Gmail 发送邮件，自动识别 HTML 并正确格式化（纯文本不强制 78 字符换行）",
  hub_spot_company: "管理 HubSpot 公司：创建、更新和获取公司信息",
  hub_spot_contact: "管理 HubSpot 联系人：创建、更新和获取联系人信息",
  hub_spot_engagement: "管理 HubSpot 互动：发送邮件并追踪互动指标",
  create_dictionary:
    "使用指定的键值对创建字典，适用于一次性创建并填充所有值的场景",
  add_to_dictionary:
    "向字典添加新的键值对。如果未提供字典，则会创建一个新的字典。",
  find_in_dictionary: "在输入的字典/对象/列表中查找指定键，并返回对应的值",
  remove_from_dictionary: "从字典中移除指定的键值对",
  replace_dictionary_value: "替换字典中指定键对应的值",
  dictionary_is_empty: "检查字典是否为空",
  create_list: "使用指定的值创建列表，可根据最大数量或 token 上限分批输出列表",
  add_to_list:
    "向列表添加新的元素（任意类型）。如果未提供列表，则会创建一个新的列表。",
  find_in_list: "查找值在列表中的索引位置",
  get_list_item: "返回列表中指定索引的元素",
  remove_from_list: "按值或索引从列表中移除元素",
  replace_list_item: "替换列表中指定索引处的元素",
  list_is_empty: "检查列表是否为空",
  file_store: "将输入文件存储到临时目录中",
  firecrawl_search: "使用 Firecrawl API 搜索网络内容",
  firecrawl_extract: "使用 Firecrawl 爬取网站并提取结构化数据，绕过反爬虫机制",
  firecrawl_map_website: "使用 Firecrawl 映射网站以提取所有链接和页面信息",
  firecrawl_scrape: "使用 Firecrawl 抓取单个网页内容，支持多种输出格式",
  firecrawl_crawl: "使用 Firecrawl 爬取多个页面，获取完整网站内容",
  get_wikipedia_summary: "从 Wikipedia 获取指定主题的摘要",
  google_maps_search: "使用 Google Maps API 搜索本地商家",
  store_value: "将输入值原样输出，便于在流程中复用",
  print_to_console: "将给定内容打印到控制台（用于调试）",
  note: "显示包含指定文本的便签",
  notion_search: "在 Notion 工作区中搜索页面和数据库",
  perplexity:
    "调用 Perplexity sonar 模型进行实时联网搜索，并返回带来源引用的回复",
  search_the_web: "使用 Jina AI 搜索互联网内容",
  search_people: "在 Apollo 中搜索人员信息",
  search_organizations: "在 Apollo 中搜索组织信息",
  search_memory: "在 Mem0 中搜索记忆",
  search_store_agents: "在商店中搜索智能体",
  twitter_search_recent_tweets: "搜索 Twitter 上的最新推文",
  twitter_search_spaces: "搜索 Twitter Spaces",
  linear_search_issues: "在 Linear 中搜索 Issues",
  linear_search_projects: "在 Linear 中搜索项目",
  universal_type_converter:
    "将值转换为指定的通用类型（字符串/数字/布尔/列表/字典）",
  reverse_list_order: "反转列表元素的顺序",
  human_in_the_loop: "暂停执行，等待人工审批或修改数据",
  block_installation: "给定一段代码字符串，验证并将对应的 block 安装到系统中",
  get_store_agent_details: "从商店获取智能体的详细信息",
  search_store_agents_desc: "在商店中搜索智能体",
  add_to_library_from_store: "将商店中的智能体添加到你的个人库中",
  list_library_agents: "列出你个人库中的所有智能体",
  agent_input: "用于用户输入的基础 block",
  agent_output: "将流程输出保存以便用户查看",
  agent_short_text_input: "单行短文本输入 block",
  agent_long_text_input: "多行长文本输入 block",
  agent_number_input: "数字输入 block",
  agent_date_input: "日期输入 block",
  agent_time_input: "时间输入 block",
  agent_file_input: "文件上传输入 block（示例为字符串路径）",
  agent_dropdown_input: "下拉选择输入 block",
  agent_toggle_input: "布尔开关输入 block",
  agent_table_input: "支持自定义表头的表格数据输入 block",
  agent_google_drive_file_input: "用于从 Google Drive 选择文件的输入 block",
  save_campaign_sequences: "在 SmartLead 活动中保存序列",
  nvidia_deepfake_detect: "使用 Nvidia AI API 检测图像中的深度伪造内容",
  airtable_create_base: "在 Airtable 中创建或查找 Base",
  airtable_list_bases: "列出你在 Airtable 中可访问的所有 Base",
  airtable_create_table: "在 Airtable Base 中创建新表",
  airtable_update_table: "更新 Airtable 表的名称、描述等属性",
  airtable_create_field: "向 Airtable 表中新增字段",
  airtable_update_field: "更新 Airtable 表字段的配置",
  airtable_list_schema: "获取 Airtable Base 的完整架构（表、字段、视图）",
  airtable_list_records: "从 Airtable 表中获取记录，可筛选、排序与分页",
  airtable_get_record: "按 ID 获取 Airtable 表中的单条记录",
  airtable_create_records: "在 Airtable 表中创建一条或多条记录",
  airtable_update_records: "批量更新 Airtable 表中的记录",
  airtable_delete_records: "删除 Airtable 表中的一条或多条记录",
  airtable_webhook_trigger: "当 Airtable 触发 webhook 事件时启动流程",
  baas_bot_fetch_meeting_data: "获取会议的录制数据",
  baas_bot_delete_recording: "永久删除会议的录制数据",
  data_for_seo_keyword_suggestions:
    "通过 DataForSEO Labs Google API 获取关键词建议",
  data_for_seo_related_keywords:
    "通过 DataForSEO Labs Google API 获取相关关键词",
  file_read_chunked: "读取文件内容为字符串，支持按分隔符和大小切分",
  google_calendar_read_events:
    "从 Google 日历读取即将发生的事件，可按筛选条件过滤",
  google_sheets_read: "从 Google 表格读取数据",
  google_sheets_write: "向 Google 表格写入数据",
  google_sheets_append: "向 Google 表格追加行数据，自动写入下一空行",
  google_sheets_clear: "清除 Google 表格中指定范围的数据",
  google_sheets_metadata: "获取 Google 表格的工作表名称和属性元数据",
  google_sheets_manage_sheet: "创建、删除或复制工作表",
  google_sheets_batch_operations: "在单个批量请求里对 Google 表格执行多个操作",
  google_sheets_find_replace: "在 Google 表格中查找并替换文本",
  google_sheets_find: "在 Google 表格中查找文本并返回位置与数量",
  google_sheets_format: "格式化 Google 表格中的指定范围",
  google_sheets_create_spreadsheet: "创建包含指定工作表的新 Google 表格",
  google_sheets_update_cell: "更新 Google 表格中的单个单元格",
  keyword_suggestion_extractor: "从 KeywordSuggestion 对象提取各字段",
  read_spreadsheet: "读取 CSV/Excel，输出字典列表并逐行返回",
  persist_information: "为当前用户持久化键值信息",
  related_keyword_extractor: "从 RelatedKeyword 对象提取各字段",
  retrieve_information: "为当前用户读取已保存的键值信息",
  screenshot_web_page: "使用 ScreenshotOne API 截取指定网页的截图",
  compass_ai_trigger: "输出 Compass AI 转录的内容",
  // Text processing blocks
  text_decoder: "将包含转义字符的字符串解码为实际文本",
  match_text_pattern: "使用正则表达式匹配文本，并根据匹配结果将数据转发到正输出或负输出",
  extract_text_information: "使用正则表达式模式从给定文本中提取信息",
  fill_text_template: "使用格式模板和给定值格式化文本，支持Jinja2语法",
  combine_texts: "将多个输入文本合并为单个输出文本",
  text_split: "使用分隔符将文本分割为字符串列表",
  text_replace: "将文本中的指定内容替换为新内容",
  get_current_time: "输出当前时间，支持多种格式和时区",
  get_current_date: "输出当前日期，支持可选的天数偏移和多种格式",
  get_current_date_and_time: "输出当前日期和时间，支持多种格式和时区",
  countdown_timer: "在指定的持续时间后触发，支持天、小时、分钟、秒",
  file_read_split: "读取文件内容并以字符串形式返回，支持按分隔符和大小限制分块",
  send_web_request: "发送HTTP请求（支持JSON/表单/多部分格式）",
  send_authenticated_web_request: "使用主机范围的凭据发送认证HTTP请求（支持JSON/表单/多部分格式）",
  send_email: "使用提供的SMTP凭据发送邮件",
  validate_emails: "验证邮件地址的有效性和可送达性",
  post_to_telegram: "通过Ayrshare发布内容到Telegram",
  code_extraction: "从文本中提取代码块并识别编程语言",
  count_words_and_char: "统计给定文本中的单词数和字符数",

  // Discord Blocks
  "df06086a-d5ac-4abb-9996-2ad0acb2eff7": "使用机器人令牌读取Discord频道中的消息",
  "d0822ab5-9f8a-44a3-8971-531dd0178b6b": "使用机器人令牌向Discord频道发送消息",
  "40d71a5a-e268-4060-9ee0-38ae6f225682": "使用Discord用户ID向其发送直接消息",
  "c76293f4-9ae8-454d-a029-0a3f8c5bc499": "向Discord频道发送富媒体嵌入消息",
  "b1628cf2-4622-49bf-80cf-10e55826e247": "向Discord频道发送文件附件",
  "7226cb99-6e7b-4672-b6b2-acec95336eec": "回复特定的Discord消息",
  "9aeed32a-6ebf-49b8-a0a3-e2e509d86120": "通过Discord用户ID获取用户信息",
  "592f815e-35c3-4fed-96cd-a69966b45c8f": "解析Discord频道名称到ID及反之",
  "e8f3c9a2-7b5d-4f1e-9c6a-3d8e2b4f7a1c": "在Discord频道中创建新的主题帖",
  "8c7e39b8-4e9d-4f3a-b4e1-2a8c9d5f6e3b": "使用OAuth2获取当前认证Discord用户的信息",

  // LinkedIn Blocks
  "f6e0ac73-4f1d-4acb-b4b7-b67066c5984e": "使用Enrichlayer API获取LinkedIn个人资料数据",
  "d237a98a-5c4b-4a1c-b9e3-e6f9a6c81df7": "通过人员信息使用Enrichlayer API查找LinkedIn资料",
  "3b9fc742-06d4-49c7-b5ce-7e302dd7c8a7": "通过公司中的职位使用Enrichlayer API查找LinkedIn资料",
  "68d5a942-9b3f-4e9a-b7c1-d96ea4321f0d": "使用Enrichlayer API获取LinkedIn头像",

  // Firecrawl Blocks
  "d1774756-4d9e-40e6-bab1-47ec0ccd81b2": "使用Firecrawl爬取网站并提取综合数据，绕过反爬虫机制",
  "f0f43e2b-c943-48a0-a7f1-40136ca4d3b9": "使用Firecrawl映射网站以提取所有链接和页面信息",
  "ac444320-cf5e-4697-b586-2604c17a3e75": "使用Firecrawl抓取单个网页内容，支持多种输出格式",
  "f8d2f28d-b3a1-405b-804e-418c087d288b": "使用Firecrawl进行网络搜索并获取搜索结果",
  "bdbbaba0-03b7-4971-970e-699e2de6015e": "使用Firecrawl爬取多个页面，获取完整的网站内容",

  // Other Important Blocks
  "8f9e0d1c-2b3a-4567-8901-23456789abcd": "在GitHub仓库、文档与StackOverflow中搜索相关代码示例",
  "3b191d9f-356f-482d-8238-ba04b6d18381": "使用AI智能决定要使用的工具",
  "f7a8b2c3-6d4e-5f8b-9e7f-6d4e5f8b9e7f": "使用OpenWeatherMap API获取指定地点的天气信息",

  // Social Media Posting Blocks (Ayrshare)
  "3352f512-3524-49ed-a08f-003042da2fc1": "使用Ayrshare发布内容到Facebook",
  "89b02b96-a7cb-46f4-9900-c48b32fe1552": "使用Ayrshare发布内容到Instagram，支持图片、视频、故事和Reels",
  "9e8f844e-b4a5-4b25-80f2-9e1dd7d67625": "使用Ayrshare发布推文到X(Twitter)",
  "589af4e4-507f-42fd-b9ac-a67ecef25811": "使用Ayrshare发布专业内容到LinkedIn",
  "7faf4b27-96b0-4f05-bf64-e0de54ae74e1": "使用Ayrshare发布短视频到TikTok",
  "0082d712-ff1b-4c3d-8a8d-6c7721883b83": "使用Ayrshare发布视频到YouTube",
  "f8c3b2e1-9d4a-4e5f-8c7b-6a9e8d2f1c3b": "使用Ayrshare发布内容到Threads",
  "47bc74eb-4af2-452c-b933-af377c7287df": "使用Ayrshare发送消息到Telegram频道",
  "3ca46e05-dbaa-4afb-9e95-5a429c4177e6": "使用Ayrshare发布图片到Pinterest",
  "a9d7f854-2c83-4e96-b3a1-7f2e9c5d4b8e": "使用Ayrshare发布内容到Snapchat",
  "c7733580-3c72-483e-8e47-a8d58754d853": "使用Ayrshare发布帖子到Reddit社区",
  "cbd52c2a-06d2-43ed-9560-6576cc163283": "使用Ayrshare发布内容到Bluesky",
  "2c38c783-c484-4503-9280-ef5d1d345a7e": "使用Ayrshare发布内容到Google My Business",
};

export function localizeBlockDescription({
  id,
  name,
  description,
}: {
  id?: string | null;
  name?: string | null;
  description?: string | null;
}): string {
  if (id && BUILDER_BLOCK_DESCRIPTION_ZH_BY_ID[id]) {
    return BUILDER_BLOCK_DESCRIPTION_ZH_BY_ID[id];
  }

  if (name) {
    const normalized = normalizeBuilderKey(stripTrailingBlockSuffix(name));
    if (BUILDER_BLOCK_DESCRIPTION_ZH_BY_KEY[normalized]) {
      return BUILDER_BLOCK_DESCRIPTION_ZH_BY_KEY[normalized];
    }
  }

  return description ?? "";
}

export const BUILDER_ERROR_CARD_I18N: ErrorCardI18n = {
  title: "出错了",
  intro: (context) => `获取${context || "数据"}时发生错误：`,
  retryButton: "重试",
  reportButton: "反馈问题",
  helpButton: "获取帮助",
};

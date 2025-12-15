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
  store_value: "存储值",
  print_to_console: "打印到控制台",
  note: "便签",
  universal_type_converter: "通用类型转换",
  reverse_list_order: "反转列表顺序",
  human_in_the_loop: "人工审核",
  block_installation: "Block 安装",
  get_store_agent_details: "获取商店智能体详情",
  search_store_agents: "搜索商店智能体",
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
  ai_conversation: "AI 会话",
  ai_image_editor: "AI 图片编辑器",
  ai_list_generator: "AI 列表生成器",
  ai_structured_response_generator: "AI 结构化响应生成器",
  ai_text_generator: "AI 文本生成器",
  ai_text_summarizer: "AI 文本摘要",
  ai_video_generator: "AI 视频生成器",
  bannerbear_text_overlay: "Bannerbear 文字叠加",
  create_talking_avatar_video: "口播头像视频生成",
  exa_answer: "Exa 问答",
  exa_create_enrichment: "Exa 创建 Enrichment",
  exa_create_research: "Exa 创建研究",
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
};

const BUILDER_BLOCK_DESCRIPTION_ZH_BY_KEY: Record<string, string> = {
  add_lead_to_campaign: "在 SmartLead 中将线索添加到活动",
  baas_bot_join_meeting: "部署机器人加入并录制会议",
  baas_bot_leave_meeting: "将机器人从正在进行的会议中移除",
  ai_shortform_video_creator: "使用 revid.ai 创建短视频",
  ai_ad_maker_video_creator: "创建由 AI 生成的 30 秒广告（文字 + 图片）",
  ai_condition: "使用 AI 评估自然语言条件，并提供条件输出",
  ai_conversation: "高级 LLM 调用：传入消息列表并发送给语言模型",
  ai_image_editor: "使用 BlackForest Labs Flux Kontext 模型编辑图片",
  ai_list_generator: "调用大语言模型（LLM），根据提示生成值列表",
  ai_structured_response_generator:
    "调用大语言模型（LLM），根据提示生成结构化对象",
  ai_text_generator: "调用大语言模型（LLM），根据提示生成文本",
  ai_text_summarizer: "调用大语言模型（LLM）对长文本生成摘要",
  ai_video_generator: "使用 FAL 的 AI 模型生成视频",
  bannerbear_text_overlay: "使用 Bannerbear 模板为图片添加文字叠加",
  code_generation: "使用 OpenAI Codex（Responses API）生成或重构代码",
  create_talking_avatar_video: "集成 D-ID 创建口播头像视频并获取视频 URL",
  exa_answer: "结合 Exa 搜索结果获取 LLM 问答",
  exa_create_enrichment: "为 webset 条目创建 enrichment，提取更多结构化数据",
  exa_create_research: "创建研究任务（可选等待）：探索网页并生成带引用的结论",
  ideogram_model: "以简单或高级设置运行 Ideogram 模型",
  jina_chunking: "使用 Jina AI 的分段服务对文本进行分块",
  jina_embedding: "使用 Jina AI 生成向量嵌入",
  perplexity:
    "调用 Perplexity sonar 模型进行实时联网搜索，并返回带来源引用的回复",
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
  store_value: "将输入值原样输出，便于在流程中复用",
  print_to_console: "将给定内容打印到控制台（用于调试）",
  note: "显示包含指定文本的便签",
  universal_type_converter:
    "将值转换为指定的通用类型（字符串/数字/布尔/列表/字典）",
  reverse_list_order: "反转列表元素的顺序",
  human_in_the_loop: "暂停执行，等待人工审批或修改数据",
  block_installation: "给定一段代码字符串，验证并将对应的 block 安装到系统中",
  get_store_agent_details: "从商店获取智能体的详细信息",
  search_store_agents: "在商店中搜索智能体",
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
  exa_create_import: "导入 CSV 数据，以便在 webset 中做定向搜索",
  exa_get_import: "获取导入任务的状态与详情",
  exa_list_imports: "分页列出所有导入任务",
  exa_delete_import: "删除指定导入任务",
  exa_export_webset: "将 webset 数据导出为 JSON、CSV 或 JSONL",
  exa_get_new_items: "按游标获取新增条目，便于增量处理",
  file_read: "读取文件内容为字符串，支持按分隔符和大小切分",
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

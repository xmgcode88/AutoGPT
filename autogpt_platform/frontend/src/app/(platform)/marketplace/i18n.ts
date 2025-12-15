import type { ErrorCardI18n } from "@/components/molecules/ErrorCard/ErrorCard";

const MARKETPLACE_CATEGORY_LABEL_ZH: Record<string, string> = {
  productivity: "效率",
  writing: "写作与内容",
  development: "开发",
  data: "数据与分析",
  marketing: "市场与 SEO",
  research: "研究与学习",
  creative: "创意与设计",
  business: "商业与金融",
  personal: "个人助手",
  other: "其他",
  seo: "SEO",
  "content creation": "内容创作",
  automation: "自动化",
  fun: "趣味",
};

export function getMarketplaceCategoryLabelZh(category: string): string {
  const normalized = category.trim().toLowerCase();
  return MARKETPLACE_CATEGORY_LABEL_ZH[normalized] ?? category;
}

const MARKETPLACE_SEARCH_TERM_LABEL_ZH: Record<string, string> = {
  marketing: "营销",
  seo: "SEO",
  "content creation": "内容创作",
  automation: "自动化",
  fun: "趣味",
};

export function getMarketplaceSearchTermLabelZh(term: string): string {
  const normalized = term.trim().toLowerCase();
  return MARKETPLACE_SEARCH_TERM_LABEL_ZH[normalized] ?? term;
}

export const MARKETPLACE_ERROR_CARD_I18N: ErrorCardI18n = {
  title: "出错了",
  intro: (context) => `在获取${context || "数据"}时发生了以下错误：`,
  retryButton: "重试",
  reportButton: "反馈问题",
  helpButton: "获取帮助",
};


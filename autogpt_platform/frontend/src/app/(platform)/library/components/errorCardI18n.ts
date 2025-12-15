import type { ErrorCardI18n } from "@/components/molecules/ErrorCard/ErrorCard";

const CONTEXT_LABELS: Record<string, string> = {
  agent: "智能体",
  run: "运行",
  runs: "运行",
  schedules: "定时任务",
  schedule: "定时任务",
};

export const LIBRARY_ERROR_CARD_I18N: ErrorCardI18n = {
  title: "出了点问题",
  intro: (context) => {
    const key = (context ?? "").trim();
    const label = CONTEXT_LABELS[key] ?? (key || "数据");
    return `获取${label}时发生错误：`;
  },
  retryButton: "重试",
  reportButton: "报告错误",
  helpButton: "寻求帮助",
};

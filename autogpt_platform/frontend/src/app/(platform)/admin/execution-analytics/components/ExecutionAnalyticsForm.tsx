"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/__legacy__/ui/input";
import { Label } from "@/components/__legacy__/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/__legacy__/ui/select";
import { Textarea } from "@/components/__legacy__/ui/textarea";
import { Checkbox } from "@/components/__legacy__/ui/checkbox";
import { Collapsible } from "@/components/molecules/Collapsible/Collapsible";
import { useToast } from "@/components/molecules/Toast/use-toast";
import {
  usePostV2GenerateExecutionAnalytics,
  useGetV2GetExecutionAnalyticsConfiguration,
} from "@/app/api/__generated__/endpoints/admin/admin";
import type { ExecutionAnalyticsRequest } from "@/app/api/__generated__/models/executionAnalyticsRequest";
import type { ExecutionAnalyticsResponse } from "@/app/api/__generated__/models/executionAnalyticsResponse";

// Use the generated type with minimal adjustment for form handling
interface FormData extends Omit<ExecutionAnalyticsRequest, "created_after"> {
  created_after?: string; // Keep as string for datetime-local input
  // All other fields use the generated types as-is
}
import { AnalyticsResultsTable } from "./AnalyticsResultsTable";

export function ExecutionAnalyticsForm() {
  const [results, setResults] = useState<ExecutionAnalyticsResponse | null>(
    null,
  );
  const { toast } = useToast();

  // Fetch configuration from API
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = useGetV2GetExecutionAnalyticsConfiguration();

  const generateAnalytics = usePostV2GenerateExecutionAnalytics({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 200) {
          throw new Error("出错了！");
        }
        const result = res.data;
        setResults(result);
        toast({
          title: "分析已生成",
          description: `已处理 ${result.processed_executions} 次执行。成功 ${result.successful_analytics}，失败 ${result.failed_analytics}，跳过 ${result.skipped_executions}。`,
          variant: "default",
        });
      },
      onError: (error: any) => {
        console.error("Analytics generation error:", error);
        toast({
          title: "分析生成失败",
          description:
            error?.message || error?.detail || "发生未知错误",
          variant: "destructive",
        });
      },
    },
  });

  const [formData, setFormData] = useState<FormData>({
    graph_id: "",
    model_name: "", // Will be set from config
    batch_size: 10, // Fixed internal value
    skip_existing: true, // Default to skip existing
    system_prompt: "", // Will use config default when empty
    user_prompt: "", // Will use config default when empty
  });

  // Update form defaults when config loads
  useEffect(() => {
    if (config?.data && config.status === 200 && !formData.model_name) {
      setFormData((prev) => ({
        ...prev,
        model_name: config.data.recommended_model,
      }));
    }
  }, [config, formData.model_name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.graph_id.trim()) {
      toast({
        title: "校验错误",
        description: "必须填写图 ID",
        variant: "destructive",
      });
      return;
    }

    setResults(null);

    // Prepare the request payload
    const payload: ExecutionAnalyticsRequest = {
      graph_id: formData.graph_id.trim(),
      model_name: formData.model_name,
      batch_size: formData.batch_size,
      skip_existing: formData.skip_existing,
    };

    if (formData.graph_version) {
      payload.graph_version = formData.graph_version;
    }

    if (formData.user_id?.trim()) {
      payload.user_id = formData.user_id.trim();
    }

    if (
      formData.created_after &&
      typeof formData.created_after === "string" &&
      formData.created_after.trim()
    ) {
      payload.created_after = new Date(formData.created_after.trim());
    }

    if (formData.system_prompt?.trim()) {
      payload.system_prompt = formData.system_prompt.trim();
    }

    if (formData.user_prompt?.trim()) {
      payload.user_prompt = formData.user_prompt.trim();
    }

    generateAnalytics.mutate({ data: payload });
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  // Show loading state while config loads
  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">正在加载配置...</div>
      </div>
    );
  }

  // Show error state if config fails to load
  if (configError || !config?.data || config.status !== 200) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">加载配置失败</div>
      </div>
    );
  }

  const configData = config.data;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="graph_id">
              图 ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="graph_id"
              value={formData.graph_id}
              onChange={(e) => handleInputChange("graph_id", e.target.value)}
              placeholder="输入图/智能体 ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="graph_version">图版本</Label>
            <Input
              id="graph_version"
              type="number"
              value={formData.graph_version || ""}
              onChange={(e) =>
                handleInputChange(
                  "graph_version",
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              placeholder="可选 - 留空表示所有版本"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id">用户 ID</Label>
            <Input
              id="user_id"
              value={formData.user_id || ""}
              onChange={(e) => handleInputChange("user_id", e.target.value)}
              placeholder="可选 - 留空表示所有用户"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="created_after">创建时间晚于</Label>
            <Input
              id="created_after"
              type="datetime-local"
              value={formData.created_after || ""}
              onChange={(e) =>
                handleInputChange("created_after", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_name">AI 模型</Label>
            <Select
              value={formData.model_name}
              onValueChange={(value) => handleInputChange("model_name", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择 AI 模型" />
              </SelectTrigger>
              <SelectContent>
                {configData.available_models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Options Section - Collapsible */}
        <div className="border-t pt-6">
          <Collapsible
            trigger={
              <h3 className="text-lg font-semibold text-gray-700">
                高级选项
              </h3>
            }
            defaultOpen={false}
            className="space-y-4"
          >
            <div className="space-y-4 pt-4">
              {/* Skip Existing Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip_existing"
                  checked={formData.skip_existing}
                  onCheckedChange={(checked) =>
                    handleInputChange("skip_existing", checked)
                  }
                />
                <Label htmlFor="skip_existing" className="text-sm">
                  跳过已包含活动状态与正确性评分的执行
                </Label>
              </div>

              {/* Custom System Prompt */}
              <div className="space-y-2">
                <Label htmlFor="system_prompt">
                  自定义系统提示词（可选）
                </Label>
                <Textarea
                  id="system_prompt"
                  value={formData.system_prompt || ""}
                  onChange={(e) =>
                    handleInputChange("system_prompt", e.target.value)
                  }
                  placeholder={configData.default_system_prompt}
                  rows={6}
                  className="resize-y"
                />
                <p className="text-sm text-gray-600">
                  自定义 AI 评估执行成功与失败的方式。留空则使用上方默认提示词。
                </p>
              </div>

              {/* Custom User Prompt */}
              <div className="space-y-2">
                <Label htmlFor="user_prompt">
                  自定义用户提示词模板（可选）
                </Label>
                <Textarea
                  id="user_prompt"
                  value={formData.user_prompt || ""}
                  onChange={(e) =>
                    handleInputChange("user_prompt", e.target.value)
                  }
                  placeholder={configData.default_user_prompt}
                  rows={8}
                  className="resize-y"
                />
                <p className="text-sm text-gray-600">
                  自定义分析指令。使用{" "}
                  <code className="rounded bg-gray-100 px-1">
                    {"{{GRAPH_NAME}}"}
                  </code>{" "}
                  和{" "}
                  <code className="rounded bg-gray-100 px-1">
                    {"{{EXECUTION_DATA}}"}
                  </code>{" "}
                  作为占位符。留空则使用上方默认模板。
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    handleInputChange(
                      "system_prompt",
                      configData.default_system_prompt,
                    );
                  }}
                >
                  重置系统提示词
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    handleInputChange(
                      "user_prompt",
                      configData.default_user_prompt,
                    );
                  }}
                >
                  重置用户提示词
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    handleInputChange("system_prompt", "");
                    handleInputChange("user_prompt", "");
                  }}
                >
                  清空所有提示词
                </Button>
              </div>
            </div>
          </Collapsible>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={generateAnalytics.isPending}
          >
            {generateAnalytics.isPending
              ? "处理中..."
              : "生成分析"}
          </Button>
        </div>
      </form>

      {results && <AnalyticsResultsTable results={results} />}
    </div>
  );
}

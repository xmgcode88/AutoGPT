"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { StepHeader } from "../StepHeader";
import { Input } from "@/components/atoms/Input/Input";
import { Select } from "@/components/atoms/Select/Select";
import { Form, FormField } from "@/components/__legacy__/ui/form";
import { CronExpressionDialog } from "@/app/(platform)/library/agents/[id]/components/OldAgentLibraryView/components/cron-scheduler-dialog";
import { humanizeCronExpression } from "@/lib/cron-expression-utils";
import { CalendarClockIcon } from "lucide-react";
import { Props, useAgentInfoStep } from "./useAgentInfoStep";
import { ThumbnailImages } from "./components/ThumbnailImages";

export function AgentInfoStep({
  onBack,
  onSuccess,
  selectedAgentId,
  selectedAgentVersion,
  initialData,
}: Props) {
  const {
    form,
    agentId,
    initialImages,
    initialSelectedImage,
    handleImagesChange,
    handleSubmit,
    isSubmitting,
  } = useAgentInfoStep({
    onBack,
    onSuccess,
    selectedAgentId,
    selectedAgentVersion,
    initialData,
  });

  const [cronScheduleDialogOpen, setCronScheduleDialogOpen] =
    React.useState(false);

  const handleScheduleChange = (cronExpression: string) => {
    form.setValue("recommendedScheduleCron", cronExpression);
  };

  const categoryOptions = [
    { value: "productivity", label: "效率" },
    { value: "writing", label: "写作与内容" },
    { value: "development", label: "开发" },
    { value: "data", label: "数据与分析" },
    { value: "marketing", label: "市场与 SEO" },
    { value: "research", label: "研究与学习" },
    { value: "creative", label: "创意与设计" },
    { value: "business", label: "商业与金融" },
    { value: "personal", label: "个人助手" },
    { value: "other", label: "其他" },
  ];

  return (
    <div className="mx-auto flex w-full flex-col rounded-3xl">
      <StepHeader title="发布智能体" description="填写一些关于智能体的信息" />

      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <Input
                id={field.name}
                label="标题"
                type="text"
                placeholder="智能体名称"
                error={form.formState.errors.title?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="subheader"
            render={({ field }) => (
              <Input
                id={field.name}
                label="副标题"
                type="text"
                placeholder="一句话介绍你的智能体"
                error={form.formState.errors.subheader?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <Input
                id={field.name}
                label="Slug（链接标识）"
                type="text"
                placeholder="用于 URL 的名称（小写字母/数字/连字符）"
                error={form.formState.errors.slug?.message}
                {...field}
              />
            )}
          />

          <ThumbnailImages
            agentId={agentId}
            onImagesChange={handleImagesChange}
            initialImages={initialImages}
            initialSelectedImage={initialSelectedImage}
            errorMessage={form.formState.errors.root?.message}
          />

          <FormField
            control={form.control}
            name="youtubeLink"
            render={({ field }) => (
              <Input
                id={field.name}
                label="YouTube 视频链接"
                type="url"
                placeholder="在此粘贴视频链接"
                error={form.formState.errors.youtubeLink?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select
                id={field.name}
                label="分类"
                placeholder="请选择分类"
                value={field.value}
                onValueChange={field.onChange}
                error={form.formState.errors.category?.message}
                options={categoryOptions}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <Input
                id={field.name}
                label="描述"
                type="textarea"
                placeholder="介绍你的智能体及其功能"
                error={form.formState.errors.description?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <Input
                id={field.name}
                label="使用说明"
                type="textarea"
                placeholder="告诉用户如何运行这个智能体以及需要注意什么"
                error={form.formState.errors.instructions?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="recommendedScheduleCron"
            render={({ field }) => (
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">推荐计划</label>
                <p className="text-xs text-gray-600">
                  建议用户在什么时候运行这个智能体以获得最佳效果
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCronScheduleDialogOpen(true)}
                  className="w-full justify-start text-sm"
                >
                  <CalendarClockIcon className="mr-2 h-4 w-4" />
                  {field.value
                    ? humanizeCronExpression(field.value, "zh-CN")
                    : "设置计划"}
                </Button>
              </div>
            )}
          />

          <div className="flex justify-between gap-4 pt-6">
            <Button
              type="button"
              onClick={onBack}
              variant="secondary"
              className="w-full"
            >
              返回
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={
                Object.keys(form.formState.errors).length > 0 || isSubmitting
              }
              loading={isSubmitting}
            >
              提交审核
            </Button>
          </div>
        </form>
      </Form>

      <CronExpressionDialog
        open={cronScheduleDialogOpen}
        setOpen={setCronScheduleDialogOpen}
        onSubmit={handleScheduleChange}
        defaultCronExpression={form.getValues("recommendedScheduleCron") || ""}
        title="推荐计划"
      />
    </div>
  );
}

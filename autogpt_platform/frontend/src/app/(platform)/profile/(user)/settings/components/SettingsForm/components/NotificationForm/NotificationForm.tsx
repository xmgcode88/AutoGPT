"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/__legacy__/ui/form";
import { Text } from "@/components/atoms/Text/Text";
import { Button } from "@/components/atoms/Button/Button";
import { NotificationPreference } from "@/app/api/__generated__/models/notificationPreference";
import { User } from "@supabase/supabase-js";
import { useNotificationForm } from "./useNotificationForm";
import { Switch } from "@/components/atoms/Switch/Switch";

type NotificationFormProps = {
  preferences: NotificationPreference;
  user: User;
};

export function NotificationForm({ preferences, user }: NotificationFormProps) {
  const { form, onSubmit, onCancel, isLoading } = useNotificationForm({
    preferences,
    user,
  });

  return (
    <div>
      <Text variant="h3" size="large-semibold">
        通知设置
      </Text>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-10"
        >
          {/* Agent Notifications */}
          <div className="flex flex-col gap-6">
            <Text variant="h4" size="body-medium" className="text-slate-400">
              代理通知
            </Text>
            <FormField
              control={form.control}
              name="notifyOnAgentRun"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      代理运行通知
                    </Text>
                    <Text variant="body">
                      当代理启动或完成运行时接收通知
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnBlockExecutionFailed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      模块执行失败
                    </Text>
                    <Text variant="body">
                      当代理运行期间模块执行失败时获得通知
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnContinuousAgentError"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      连续代理错误
                    </Text>
                    <Text variant="body">
                      当代理遇到重复错误时接收警报
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Store Notifications */}
          <div className="flex flex-col gap-6">
            <Text variant="h4" size="body-medium" className="text-slate-400">
              商店通知
            </Text>
            <FormField
              control={form.control}
              name="notifyOnAgentApproved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      代理已批准
                    </Text>
                    <Text variant="body">
                      当您提交的代理被商店批准时获得通知
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnAgentRejected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      代理已拒绝
                    </Text>
                    <Text variant="body">
                      当您的代理提交需要更新时接收通知
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Balance Notifications */}
          <div className="flex flex-col gap-4">
            <Text variant="h4" size="body-medium" className="text-slate-400">
              余额通知
            </Text>
            <FormField
              control={form.control}
              name="notifyOnZeroBalance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      零余额警报
                    </Text>
                    <Text variant="body">
                      当您的账户余额降至零时获得通知
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnLowBalance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      低余额警告
                    </Text>
                    <Text variant="body">
                      当您的余额不足时接收警告
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Summary Reports */}
          <div className="flex flex-col gap-4">
            <Text variant="h4" size="body-medium" className="text-slate-400">
              摘要报告
            </Text>
            <FormField
              control={form.control}
              name="notifyOnDailySummary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <Text variant="h4" size="body-medium">
                      每日摘要
                    </Text>
                    <Text variant="body">
                      接收您账户活动的每日摘要
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnWeeklySummary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      每周摘要
                    </Text>
                    <Text variant="body">
                      获取您账户表现的每周概览
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnMonthlySummary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Text variant="h4" size="body-medium">
                      每月摘要
                    </Text>
                    <Text variant="body">
                      接收您账户的月度综合报告
                    </Text>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-8">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="min-w-[10rem]"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="min-w-[10rem]"
              loading={isLoading}
            >
              {isLoading ? "保存中..." : "保存偏好"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

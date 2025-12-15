import { useGetV1GetUserTimezone } from "@/app/api/__generated__/endpoints/auth/auth";
import { usePostV1CreateExecutionSchedule } from "@/app/api/__generated__/endpoints/schedules/schedules";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { getTimezoneDisplayName } from "@/lib/timezone-utils";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

export const useCronSchedulerDialog = ({
  open,
  setOpen,
  inputs,
  credentials,
  defaultCronExpression = "",
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  inputs: Record<string, any>;
  credentials: Record<string, any>;
  defaultCronExpression?: string;
}) => {
  const { toast } = useToast();
  const [cronExpression, setCronExpression] = useState<string>("");
  const [scheduleName, setScheduleName] = useState<string>("");

  const [{ flowID, flowVersion }] = useQueryStates({
    flowID: parseAsString,
    flowVersion: parseAsInteger,
    flowExecutionID: parseAsString,
  });

  const { data: userTimezone } = useGetV1GetUserTimezone({
    query: {
      select: (res) => (res.status === 200 ? res.data.timezone : undefined),
    },
  });
  const timezoneDisplay = getTimezoneDisplayName(userTimezone || "UTC");

  const { mutateAsync: createSchedule, isPending: isCreatingSchedule } =
    usePostV1CreateExecutionSchedule({
      mutation: {
        onSuccess: (response) => {
          if (response.status === 200) {
            setOpen(false);
            toast({
              title: "计划已创建",
              description: "已成功创建计划",
            });
          }
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "创建计划失败",
            description: (error.detail as string) ?? "发生未知错误。",
          });
        },
      },
    });

  useEffect(() => {
    if (open) {
      setCronExpression(defaultCronExpression);
    }
  }, [open, defaultCronExpression]);

  const handleCreateSchedule = async () => {
    if (!cronExpression || cronExpression.trim() === "") {
      toast({
        variant: "destructive",
        title: "无效的计划",
        description: "请输入有效的 Cron 表达式",
      });
      return;
    }

    await createSchedule({
      graphId: flowID || "",
      data: {
        name: scheduleName,
        graph_version: flowID ? flowVersion : undefined,
        cron: cronExpression,
        inputs: inputs,
        credentials: credentials,
      },
    });
    setOpen(false);
  };

  return {
    cronExpression,
    setCronExpression,
    userTimezone,
    timezoneDisplay,
    handleCreateSchedule,
    setScheduleName,
    scheduleName,
    isCreatingSchedule,
  };
};

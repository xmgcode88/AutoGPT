"use client";

import { getGetV1ListGraphExecutionsInfiniteQueryOptions } from "@/app/api/__generated__/endpoints/graphs/graphs";
import { getGetV1ListExecutionSchedulesForAGraphQueryKey } from "@/app/api/__generated__/endpoints/schedules/schedules";
import type { GraphExecutionJobInfo } from "@/app/api/__generated__/models/graphExecutionJobInfo";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  parseCronToForm,
  validateSchedule,
} from "../../../../modals/ScheduleAgentModal/components/ModalScheduleSection/helpers";

export function useEditScheduleModal(
  graphId: string,
  schedule: GraphExecutionJobInfo,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(schedule.name);

  const parsed = useMemo(() => parseCronToForm(schedule.cron), [schedule.cron]);
  const [repeat, setRepeat] = useState<string>(parsed?.repeat || "daily");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    parsed?.selectedDays || [],
  );
  const [time, setTime] = useState<string>(parsed?.time || "00:00");
  const [errors, setErrors] = useState<{
    scheduleName?: string;
    time?: string;
  }>({});

  const repeatOptions = useMemo(
    () => [
      { value: "daily", label: "每天" },
      { value: "weekly", label: "每周" },
    ],
    [],
  );

  const dayItems = useMemo(
    () => [
      { value: "0", label: "日" },
      { value: "1", label: "一" },
      { value: "2", label: "二" },
      { value: "3", label: "三" },
      { value: "4", label: "四" },
      { value: "5", label: "五" },
      { value: "6", label: "六" },
    ],
    [],
  );

  function humanizeToCron(): string {
    const [hh, mm] = time.split(":");
    const minute = Number(mm || 0);
    const hour = Number(hh || 0);
    if (repeat === "weekly") {
      const dow = selectedDays.length ? selectedDays.join(",") : "*";
      return `${minute} ${hour} * * ${dow}`;
    }
    return `${minute} ${hour} * * *`;
  }

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["patchSchedule", schedule.id],
    mutationFn: async () => {
      const errorsNow = validateSchedule({ scheduleName: name, time });
      setErrors(errorsNow);
      if (Object.keys(errorsNow).length > 0) throw new Error("表单无效");

      const cron = humanizeToCron();
      const res = await fetch(`/api/schedules/${schedule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cron }),
      });
      if (!res.ok) {
        let message = "更新定时任务失败";
        try {
          const data = await res.json();
          message = data?.message || data?.detail || message;
        } catch {
          try {
            message = await res.text();
          } catch {}
        }
        throw new Error(message);
      }
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getGetV1ListExecutionSchedulesForAGraphQueryKey(graphId),
      });
      const runsKey = getGetV1ListGraphExecutionsInfiniteQueryOptions(graphId)
        .queryKey as any;
      await queryClient.invalidateQueries({ queryKey: runsKey });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ 更新定时任务失败",
        description: error?.message || "发生未知错误。",
        variant: "destructive",
      });
    },
  });

  return {
    isOpen,
    setIsOpen,
    name,
    setName,
    repeat,
    setRepeat,
    selectedDays,
    setSelectedDays,
    time,
    setTime,
    errors,
    repeatOptions,
    dayItems,
    mutateAsync,
    isPending,
  } as const;
}

"use client";

import { useToast } from "@/components/molecules/Toast/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteV1DeleteExecutionSchedule,
  getGetV1ListExecutionSchedulesForAGraphQueryOptions,
} from "@/app/api/__generated__/endpoints/schedules/schedules";

export function useScheduleDetailHeader(
  agentGraphId: string,
  scheduleId?: string,
  agentGraphVersion?: number | string,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useDeleteV1DeleteExecutionSchedule({
    mutation: {
      onSuccess: () => {
        toast({ title: "定时任务已删除" });
        queryClient.invalidateQueries({
          queryKey:
            getGetV1ListExecutionSchedulesForAGraphQueryOptions(agentGraphId)
              .queryKey,
        });
      },
      onError: (error: any) =>
        toast({
          title: "删除定时任务失败",
          description: error?.message || "发生未知错误。",
          variant: "destructive",
        }),
    },
  });

  function deleteSchedule() {
    if (!scheduleId) return;
    deleteMutation.mutate({ scheduleId });
  }

  const openInBuilderHref = `/build?flowID=${agentGraphId}&flowVersion=${agentGraphVersion}`;

  return {
    deleteSchedule,
    isDeleting: deleteMutation.isPending,
    openInBuilderHref,
  } as const;
}

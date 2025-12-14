"use client";

import { useToast } from "@/components/molecules/Toast/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePostV1StopGraphExecution,
  getGetV1ListGraphExecutionsInfiniteQueryOptions,
  useDeleteV1DeleteGraphExecution,
  usePostV1ExecuteGraphAgent,
} from "@/app/api/__generated__/endpoints/graphs/graphs";
import type { GraphExecution } from "@/app/api/__generated__/models/graphExecution";
import { useState } from "react";

export function useRunDetailHeader(
  agentGraphId: string,
  run?: GraphExecution,
  onSelectRun?: (id: string) => void,
  onClearSelectedRun?: () => void,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canStop = run?.status === "RUNNING" || run?.status === "QUEUED";

  const { mutateAsync: stopRun, isPending: isStopping } =
    usePostV1StopGraphExecution();

  const { mutateAsync: deleteRun, isPending: isDeleting } =
    useDeleteV1DeleteGraphExecution();

  const { mutateAsync: executeRun, isPending: isRunningAgain } =
    usePostV1ExecuteGraphAgent();

  async function handleDeleteRun() {
    try {
      await deleteRun({ graphExecId: run?.id ?? "" });

      toast({ title: "运行已删除" });

      await queryClient.refetchQueries({
        queryKey:
          getGetV1ListGraphExecutionsInfiniteQueryOptions(agentGraphId)
            .queryKey,
      });

      if (onClearSelectedRun) onClearSelectedRun();

      setShowDeleteDialog(false);
    } catch (error: unknown) {
      toast({
        title: "删除运行失败",
        description: error instanceof Error ? error.message : "发生未知错误。",
        variant: "destructive",
      });
    }
  }

  async function handleStopRun() {
    try {
      await stopRun({
        graphId: run?.graph_id ?? "",
        graphExecId: run?.id ?? "",
      });

      toast({ title: "运行已停止" });

      await queryClient.invalidateQueries({
        queryKey:
          getGetV1ListGraphExecutionsInfiniteQueryOptions(agentGraphId)
            .queryKey,
      });
    } catch (error: unknown) {
      toast({
        title: "停止运行失败",
        description: error instanceof Error ? error.message : "发生未知错误。",
        variant: "destructive",
      });
    }
  }

  async function handleRunAgain() {
    if (!run) {
      toast({
        title: "未找到运行",
        description: "未找到运行",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({ title: "运行已开始" });

      const res = await executeRun({
        graphId: run.graph_id,
        graphVersion: run.graph_version,
        data: {
          inputs: (run as any).inputs || {},
          credentials_inputs: (run as any).credential_inputs || {},
        },
      });

      const newRunId = res?.status === 200 ? (res?.data?.id ?? "") : "";

      await queryClient.invalidateQueries({
        queryKey:
          getGetV1ListGraphExecutionsInfiniteQueryOptions(agentGraphId)
            .queryKey,
      });

      if (newRunId && onSelectRun) onSelectRun(newRunId);
    } catch (error: unknown) {
      toast({
        title: "启动运行失败",
        description: error instanceof Error ? error.message : "发生未知错误。",
        variant: "destructive",
      });
    }
  }

  function handleShowDeleteDialog(open: boolean) {
    setShowDeleteDialog(open);
  }

  // Open in builder URL helper
  const openInBuilderHref = run
    ? `/build?flowID=${run.graph_id}&flowVersion=${run.graph_version}&flowExecutionID=${run.id}`
    : undefined;

  return {
    openInBuilderHref,
    showDeleteDialog,
    canStop,
    isStopping,
    isDeleting,
    isRunning: run?.status === "RUNNING",
    isRunningAgain,
    handleShowDeleteDialog,
    handleDeleteRun,
    handleStopRun,
    handleRunAgain,
  } as const;
}

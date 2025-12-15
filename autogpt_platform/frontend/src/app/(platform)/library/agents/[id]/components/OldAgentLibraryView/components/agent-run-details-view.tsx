"use client";
import React, { useCallback, useMemo, useEffect } from "react";

import {
  Graph,
  GraphExecution,
  GraphExecutionID,
  GraphExecutionMeta,
  LibraryAgent,
} from "@/lib/autogpt-server-api";
import { useBackendAPI } from "@/lib/autogpt-server-api/context";

import ActionButtonGroup from "@/components/__legacy__/action-button-group";
import type { ButtonAction } from "@/components/__legacy__/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/__legacy__/ui/card";
import {
  IconRefresh,
  IconSquare,
  IconCircleAlert,
} from "@/components/__legacy__/ui/icons";
import { Input } from "@/components/__legacy__/ui/input";
import LoadingBox from "@/components/__legacy__/ui/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/atoms/Tooltip/BaseTooltip";
import { toast } from "@/components/molecules/Toast/use-toast";

import { AgentRunStatus, agentRunStatusMap } from "./agent-run-status-chip";
import useCredits from "@/hooks/useCredits";
import { AgentRunOutputView } from "./agent-run-output-view";
import { analytics } from "@/services/analytics";
import { useOnboarding } from "@/providers/onboarding/onboarding-provider";
import { PendingReviewsList } from "@/components/organisms/PendingReviewsList/PendingReviewsList";
import { usePendingReviewsForExecution } from "@/hooks/usePendingReviews";
import { formatDurationSeconds, formatRelativeTime } from "@/lib/utils/time";

const runStatusLabelMap: Record<AgentRunStatus, string> = {
  draft: "草稿",
  queued: "排队中",
  running: "运行中",
  review: "审核中",
  success: "成功",
  stopped: "已停止",
  failed: "失败",
  scheduled: "定时",
};

export function AgentRunDetailsView({
  agent,
  graph,
  run,
  agentActions,
  onRun,
  doDeleteRun,
  doCreatePresetFromRun,
}: {
  agent: LibraryAgent;
  graph: Graph;
  run: GraphExecution | GraphExecutionMeta;
  agentActions: ButtonAction[];
  onRun: (runID: GraphExecutionID) => void;
  doDeleteRun: () => void;
  doCreatePresetFromRun: () => void;
}): React.ReactNode {
  const api = useBackendAPI();
  const { formatCredits } = useCredits();

  const runStatus: AgentRunStatus = useMemo(
    () => agentRunStatusMap[run.status],
    [run],
  );

  const { completeStep } = useOnboarding();

  const {
    pendingReviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = usePendingReviewsForExecution(run.id);

  const toastOnFail = useCallback(
    (action: string) => (error: any) => {
      const err = error as Error;
      toast({
        title: `无法${action}`,
        description: err.message ?? "发生未知错误。",
        variant: "destructive",
        duration: 10000,
      });
    },
    [],
  );

  // Refetch pending reviews when execution status changes to REVIEW
  useEffect(() => {
    if (runStatus === "review" && run.id) {
      refetchReviews();
    }
  }, [runStatus, run.id, refetchReviews]);

  const infoStats: { label: string; value: React.ReactNode }[] = useMemo(() => {
    if (!run) return [];
    return [
      {
        label: "状态",
        value: runStatusLabelMap[runStatus],
      },
      {
        label: "开始",
        value: `${formatRelativeTime(run.started_at, "zh-CN")}，${new Date(
          run.started_at,
        ).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`,
      },
      ...(run.stats
        ? [
            {
              label: "时长",
              value: formatDurationSeconds(run.stats.duration, "zh-CN"),
            },
            { label: "步骤", value: run.stats.node_exec_count },
            { label: "费用", value: formatCredits(run.stats.cost) },
          ]
        : []),
    ];
  }, [run, runStatus, formatCredits]);

  const agentRunInputs:
    | Record<
        string,
        {
          title?: string;
          /* type: BlockIOSubType; */
          value: string | number | undefined;
        }
      >
    | undefined = useMemo(() => {
    if (!run.inputs) return undefined;
    // TODO: show (link to) preset - https://github.com/Significant-Gravitas/AutoGPT/issues/9168

    // Add type info from agent input schema
    return Object.fromEntries(
      Object.entries(run.inputs).map(([k, v]) => [
        k,
        {
          title: graph.input_schema.properties[k]?.title,
          // type: graph.input_schema.properties[k].type, // TODO: implement typed graph inputs
          value: typeof v == "object" ? JSON.stringify(v, undefined, 2) : v,
        },
      ]),
    );
  }, [graph, run]);

  const runAgain = useCallback(() => {
    if (
      !run.inputs ||
      !(graph.credentials_input_schema?.required ?? []).every(
        (k) => k in (run.credential_inputs ?? {}),
      )
    )
      return;

    if (run.preset_id) {
      return api
        .executeLibraryAgentPreset(
          run.preset_id,
          run.inputs!,
          run.credential_inputs!,
        )
        .then(({ id }) => {
          analytics.sendDatafastEvent("run_agent", {
            name: graph.name,
            id: graph.id,
          });
          onRun(id);
        })
        .catch(toastOnFail("执行智能体预设"));
    }

    return api
      .executeGraph(
        graph.id,
        graph.version,
        run.inputs!,
        run.credential_inputs!,
      )
      .then(({ id }) => {
        analytics.sendDatafastEvent("run_agent", {
          name: graph.name,
          id: graph.id,
        });
        completeStep("RE_RUN_AGENT");
        onRun(id);
      })
      .catch(toastOnFail("执行智能体"));
  }, [api, graph, run, onRun, toastOnFail]);

  const stopRun = useCallback(
    () => api.stopGraphExecution(graph.id, run.id),
    [api, graph.id, run.id],
  );

  const agentRunOutputs:
    | Record<
        string,
        {
          title?: string;
          /* type: BlockIOSubType; */
          values: Array<React.ReactNode>;
        }
      >
    | null
    | undefined = useMemo(() => {
    if (!("outputs" in run)) return undefined;
    if (!["running", "success", "failed", "stopped"].includes(runStatus))
      return null;

    // Add type info from agent input schema
    return Object.fromEntries(
      Object.entries(run.outputs).map(([k, vv]) => [
        k,
        {
          title: graph.output_schema.properties[k].title,
          /* type: agent.output_schema.properties[k].type */
          values: vv.map((v) =>
            typeof v == "object" ? JSON.stringify(v, undefined, 2) : v,
          ),
        },
      ]),
    );
  }, [graph, run, runStatus]);

  const runActions: ButtonAction[] = useMemo(
    () => [
      ...(["running", "queued"].includes(runStatus)
        ? ([
            {
              label: (
                <>
                  <IconSquare className="mr-2 size-4" />
                  停止运行
                </>
              ),
              variant: "secondary",
              callback: stopRun,
            },
          ] satisfies ButtonAction[])
        : []),
      ...(["success", "failed", "stopped"].includes(runStatus) &&
      !graph.has_external_trigger &&
      (graph.credentials_input_schema?.required ?? []).every(
        (k) => k in (run.credential_inputs ?? {}),
      )
        ? [
            {
              label: (
                <>
                  <IconRefresh className="mr-2 size-4" />
                  再次运行
                </>
              ),
              callback: runAgain,
              dataTestId: "run-again-button",
            },
          ]
        : []),
      ...(agent.can_access_graph
        ? [
            {
              label: "在构建器中打开",
              href: `/build?flowID=${run.graph_id}&flowVersion=${run.graph_version}&flowExecutionID=${run.id}`,
            },
          ]
        : []),
      { label: "从本次运行创建预设", callback: doCreatePresetFromRun },
      { label: "删除运行", variant: "secondary", callback: doDeleteRun },
    ],
    [
      runStatus,
      runAgain,
      stopRun,
      doDeleteRun,
      doCreatePresetFromRun,
      graph.has_external_trigger,
      graph.credentials_input_schema?.required,
      agent.can_access_graph,
      run.graph_id,
      run.graph_version,
      run.id,
    ],
  );

  return (
    <div className="agpt-div flex gap-6">
      <div className="flex flex-1 flex-col gap-4">
        <Card className="agpt-box">
          <CardHeader>
            <CardTitle className="font-poppins text-lg">信息</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-stretch gap-4">
              {infoStats.map(({ label, value }) => (
                <div key={label} className="flex-1">
                  <p className="text-sm font-medium text-black">{label}</p>
                  <p className="text-sm text-neutral-600">{value}</p>
                </div>
              ))}
            </div>
            {run.status === "FAILED" && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>错误：</strong>{" "}
                  {run.stats?.error ||
                    "The execution failed due to an internal error. You can re-run the agent to retry."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Agent Execution Summary */}
        {run.stats?.activity_status && (
          <Card className="agpt-box">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins text-lg">
                任务摘要
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconCircleAlert className="size-4 cursor-help text-neutral-500 hover:text-neutral-700" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        该摘要由 AI
                        自动生成，用于描述智能体如何处理你的任务。此功能仍处于实验阶段，可能偶尔不准确。
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-neutral-700">
                {run.stats.activity_status}
              </p>

              {/* Correctness Score */}
              {typeof run.stats.correctness_score === "number" && (
                <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-600">
                      成功率预估：
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative h-2 w-16 overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className={`h-full transition-all ${
                            run.stats.correctness_score >= 0.8
                              ? "bg-green-500"
                              : run.stats.correctness_score >= 0.6
                                ? "bg-yellow-500"
                                : run.stats.correctness_score >= 0.4
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.round(run.stats.correctness_score * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(run.stats.correctness_score * 100)}%
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconCircleAlert className="size-4 cursor-help text-neutral-400 hover:text-neutral-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          AI
                          生成的预估分数，用于衡量本次执行达到预期目标的程度。该分数表示：
                          {run.stats.correctness_score >= 0.8
                            ? "智能体非常成功。"
                            : run.stats.correctness_score >= 0.6
                              ? "智能体基本成功，但存在一些小问题。"
                              : run.stats.correctness_score >= 0.4
                                ? "智能体部分成功，但仍有一些缺口。"
                                : "智能体成功率较低，存在明显问题。"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {agentRunOutputs !== null && (
          <AgentRunOutputView agentRunOutputs={agentRunOutputs} />
        )}

        {/* Pending Reviews Section */}
        {runStatus === "review" && (
          <Card className="agpt-box">
            <CardHeader>
              <CardTitle className="font-poppins text-lg">
                待处理评审（{pendingReviews.length}）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <LoadingBox spinnerSize={12} className="h-24" />
              ) : pendingReviews.length > 0 ? (
                <PendingReviewsList
                  reviews={pendingReviews}
                  onReviewComplete={refetchReviews}
                  emptyMessage="此执行没有待处理的评审"
                />
              ) : (
                <div className="py-4 text-neutral-600">
                  此执行没有待处理的评审
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="agpt-box">
          <CardHeader>
            <CardTitle className="font-poppins text-lg">输入</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {agentRunInputs !== undefined ? (
              Object.entries(agentRunInputs).map(([key, { title, value }]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">{title || key}</label>
                  <Input value={value} className="rounded-full" disabled />
                </div>
              ))
            ) : (
              <LoadingBox spinnerSize={12} className="h-24" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Run / Agent Actions */}
      <aside className="w-48 xl:w-56">
        <div className="flex flex-col gap-8">
          <ActionButtonGroup title="运行操作" actions={runActions} />

          <ActionButtonGroup title="智能体操作" actions={agentActions} />
        </div>
      </aside>
    </div>
  );
}

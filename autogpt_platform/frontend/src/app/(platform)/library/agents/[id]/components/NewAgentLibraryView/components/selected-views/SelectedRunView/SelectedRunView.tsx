"use client";

import { AgentExecutionStatus } from "@/app/api/__generated__/models/agentExecutionStatus";
import type { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Skeleton } from "@/components/__legacy__/ui/skeleton";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { LIBRARY_ERROR_CARD_I18N } from "@/app/(platform)/library/components/errorCardI18n";
import {
  TabsLine,
  TabsLineContent,
  TabsLineList,
  TabsLineTrigger,
} from "@/components/molecules/TabsLine/TabsLine";
import { PendingReviewsList } from "@/components/organisms/PendingReviewsList/PendingReviewsList";
import { usePendingReviewsForExecution } from "@/hooks/usePendingReviews";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { AgentInputsReadOnly } from "../../modals/AgentInputsReadOnly/AgentInputsReadOnly";
import { RunDetailCard } from "../RunDetailCard/RunDetailCard";
import { RunDetailHeader } from "../RunDetailHeader/RunDetailHeader";
import { RunOutputs } from "./components/RunOutputs";
import { useSelectedRunView } from "./useSelectedRunView";

interface Props {
  agent: LibraryAgent;
  runId: string;
  onSelectRun?: (id: string) => void;
  onClearSelectedRun?: () => void;
}

export function SelectedRunView({
  agent,
  runId,
  onSelectRun,
  onClearSelectedRun,
}: Props) {
  const { run, isLoading, responseError, httpError } = useSelectedRunView(
    agent.graph_id,
    runId,
  );

  const {
    pendingReviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = usePendingReviewsForExecution(runId);

  // Tab state management
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("output"),
  );

  useEffect(() => {
    if (run?.status === AgentExecutionStatus.REVIEW && runId) {
      refetchReviews();
    }
  }, [run?.status, runId, refetchReviews]);

  if (responseError || httpError) {
    return (
      <ErrorCard
        responseError={responseError ?? undefined}
        httpError={httpError ?? undefined}
        context="运行"
        i18n={LIBRARY_ERROR_CARD_I18N}
      />
    );
  }

  if (isLoading && !run) {
    return (
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <RunDetailHeader
        agent={agent}
        run={run}
        onSelectRun={onSelectRun}
        onClearSelectedRun={onClearSelectedRun}
      />

      {/* Content */}
      <TabsLine value={activeTab} onValueChange={setActiveTab}>
        <TabsLineList>
          <TabsLineTrigger value="output">输出</TabsLineTrigger>
          <TabsLineTrigger value="input">输入</TabsLineTrigger>
          {run?.status === AgentExecutionStatus.REVIEW && (
            <TabsLineTrigger value="reviews">
              评审（{pendingReviews.length}）
            </TabsLineTrigger>
          )}
        </TabsLineList>

        <TabsLineContent value="output">
          <RunDetailCard>
            {isLoading ? (
              <div className="text-neutral-500">加载中…</div>
            ) : run && "outputs" in run ? (
              <RunOutputs outputs={run.outputs as any} />
            ) : (
              <div className="text-neutral-600">此运行没有输出。</div>
            )}
          </RunDetailCard>
        </TabsLineContent>

        <TabsLineContent value="input">
          <RunDetailCard>
            <AgentInputsReadOnly
              agent={agent}
              inputs={(run as any)?.inputs}
              credentialInputs={(run as any)?.credential_inputs}
            />
          </RunDetailCard>
        </TabsLineContent>

        {run?.status === AgentExecutionStatus.REVIEW && (
          <TabsLineContent value="reviews">
            <RunDetailCard>
              {reviewsLoading ? (
                <div className="text-neutral-500">正在加载评审…</div>
              ) : pendingReviews.length > 0 ? (
                <PendingReviewsList
                  reviews={pendingReviews}
                  onReviewComplete={refetchReviews}
                  emptyMessage="此执行没有待处理的评审"
                />
              ) : (
                <div className="text-neutral-600">此执行没有待处理的评审</div>
              )}
            </RunDetailCard>
          </TabsLineContent>
        )}
      </TabsLine>
    </div>
  );
}

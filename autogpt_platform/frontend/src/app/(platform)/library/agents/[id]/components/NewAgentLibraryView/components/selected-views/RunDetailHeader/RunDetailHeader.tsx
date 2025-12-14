import { GraphExecution } from "@/app/api/__generated__/models/graphExecution";
import { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import { Flag, useGetFlag } from "@/services/feature-flags/use-get-flag";
import {
  ArrowSquareOutIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { AgentActionsDropdown } from "../AgentActionsDropdown";
import { RunStatusBadge } from "../SelectedRunView/components/RunStatusBadge";
import { ShareRunButton } from "../ShareRunButton/ShareRunButton";
import { FloatingSafeModeToggle } from "@/components/molecules/FloatingSafeModeToggle/FloatingSafeModeToggle";
import { formatDurationSeconds, formatRelativeTime } from "@/lib/utils/time";
import { useRunDetailHeader } from "./useRunDetailHeader";

type Props = {
  agent: LibraryAgent;
  run: GraphExecution | undefined;
  scheduleRecurrence?: string;
  onSelectRun?: (id: string) => void;
  onClearSelectedRun?: () => void;
};

export function RunDetailHeader({
  agent,
  run,
  scheduleRecurrence,
  onSelectRun,
  onClearSelectedRun,
}: Props) {
  const shareExecutionResultsEnabled = useGetFlag(Flag.SHARE_EXECUTION_RESULTS);

  const {
    canStop,
    isStopping,
    isDeleting,
    isRunning,
    isRunningAgain,
    openInBuilderHref,
    showDeleteDialog,
    handleStopRun,
    handleRunAgain,
    handleDeleteRun,
    handleShowDeleteDialog,
  } = useRunDetailHeader(agent.graph_id, run, onSelectRun, onClearSelectedRun);

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full flex-col gap-0">
          <div className="flex w-full flex-col flex-wrap items-start justify-between gap-2 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-2 md:flex-row md:items-center">
              {run?.status ? <RunStatusBadge status={run.status} /> : null}
              <Text
                variant="h3"
                className="truncate text-ellipsis !font-normal"
              >
                {agent.name}
              </Text>
            </div>
            {run ? (
              <div className="my-4 flex flex-wrap items-center gap-2 md:my-2 lg:my-0">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleRunAgain}
                  loading={isRunningAgain}
                >
                  <PlayIcon size={16} /> 再次运行
                </Button>
                {shareExecutionResultsEnabled && (
                  <ShareRunButton
                    graphId={agent.graph_id}
                    executionId={run.id}
                    isShared={run.is_shared}
                    shareToken={run.share_token}
                  />
                )}
                <FloatingSafeModeToggle
                  graph={agent}
                  variant="white"
                  fullWidth={false}
                />
                {!isRunning ? (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleShowDeleteDialog(true)}
                  >
                    <TrashIcon size={16} /> 删除运行
                  </Button>
                ) : null}
                {openInBuilderHref ? (
                  <Button
                    variant="secondary"
                    size="small"
                    as="NextLink"
                    href={openInBuilderHref}
                    target="_blank"
                  >
                    <ArrowSquareOutIcon size={16} /> 编辑运行
                  </Button>
                ) : null}
                {canStop ? (
                  <Button
                    variant="destructive"
                    size="small"
                    onClick={handleStopRun}
                    disabled={isStopping}
                  >
                    <StopIcon size={14} /> 停止智能体
                  </Button>
                ) : null}
                <AgentActionsDropdown agent={agent} />
              </div>
            ) : null}
          </div>
          {run ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 gap-y-1 text-zinc-600">
              <Text variant="small" className="!text-zinc-600">
                开始于 {formatRelativeTime(run.started_at, "zh-CN")}
              </Text>
              <span className="mx-1 inline-block text-zinc-200">|</span>
              <Text variant="small" className="!text-zinc-600">
                版本：{run.graph_version}
              </Text>
              {run.stats?.node_exec_count !== undefined && (
                <>
                  <span className="mx-1 inline-block text-zinc-200">|</span>
                  <Text variant="small" className="!text-zinc-600">
                    步骤：{run.stats.node_exec_count}
                  </Text>
                </>
              )}
              {run.stats?.duration !== undefined && (
                <>
                  <span className="mx-1 inline-block text-zinc-200">|</span>
                  <Text variant="small" className="!text-zinc-600">
                    时长：{formatDurationSeconds(run.stats.duration, "zh-CN")}
                  </Text>
                </>
              )}
              {run.stats?.cost !== undefined && (
                <>
                  <span className="mx-1 inline-block text-zinc-200">|</span>
                  <Text variant="small" className="!text-zinc-600">
                    费用：${(run.stats.cost / 100).toFixed(2)}
                  </Text>
                </>
              )}
              {run.stats?.activity_status && (
                <>
                  <span className="mx-1 inline-block text-zinc-200">|</span>
                  <Text variant="small" className="!text-zinc-600">
                    {String(run.stats.activity_status)}
                  </Text>
                </>
              )}
            </div>
          ) : scheduleRecurrence ? (
            <Text variant="small" className="mt-1 !text-zinc-600">
              {scheduleRecurrence}
            </Text>
          ) : null}
        </div>
      </div>

      <Dialog
        controlled={{
          isOpen: showDeleteDialog,
          set: handleShowDeleteDialog,
        }}
        styling={{ maxWidth: "32rem" }}
        title="删除运行"
      >
        <Dialog.Content>
          <div>
            <Text variant="large">确定要删除这次运行吗？此操作无法撤销。</Text>
            <Dialog.Footer>
              <Button
                variant="secondary"
                disabled={isDeleting}
                onClick={() => handleShowDeleteDialog(false)}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteRun}
                loading={isDeleting}
              >
                删除
              </Button>
            </Dialog.Footer>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

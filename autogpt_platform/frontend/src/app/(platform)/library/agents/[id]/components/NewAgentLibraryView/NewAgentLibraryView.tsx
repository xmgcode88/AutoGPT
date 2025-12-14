"use client";

import { Button } from "@/components/atoms/Button/Button";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs/Breadcrumbs";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { LIBRARY_ERROR_CARD_I18N } from "@/app/(platform)/library/components/errorCardI18n";
import { PlusIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { RunAgentModal } from "./components/modals/RunAgentModal/RunAgentModal";
import { AgentRunsLoading } from "./components/other/AgentRunsLoading";
import { EmptyAgentRuns } from "./components/other/EmptyAgentRuns";
import { SelectedRunView } from "./components/selected-views/SelectedRunView/SelectedRunView";
import { SelectedScheduleView } from "./components/selected-views/SelectedScheduleView/SelectedScheduleView";
import { AgentRunsLists } from "./components/sidebar/AgentRunsLists/AgentRunsLists";
import { useNewAgentLibraryView } from "./useNewAgentLibraryView";

export function NewAgentLibraryView() {
  const {
    agent,
    hasAnyItems,
    ready,
    error,
    agentId,
    selectedRun,
    sidebarLoading,
    handleSelectRun,
    handleCountsChange,
    handleClearSelectedRun,
  } = useNewAgentLibraryView();

  useEffect(() => {
    if (agent) {
      document.title = `${agent.name} - 资源库 - AutoGPT Platform`;
    }
  }, [agent]);

  if (error) {
    return (
      <ErrorCard
        isSuccess={false}
        responseError={error || undefined}
        context="智能体"
        i18n={LIBRARY_ERROR_CARD_I18N}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!ready || !agent) {
    return <AgentRunsLoading />;
  }

  const shouldShowSidebar = sidebarLoading || hasAnyItems;

  return (
    <div
      className={
        shouldShowSidebar
          ? "grid h-full grid-cols-1 gap-0 pt-3 md:gap-4 lg:grid-cols-[25%_70%]"
          : "grid h-full grid-cols-1 gap-0 pt-3 md:gap-4"
      }
    >
      {shouldShowSidebar && (
        <div className="p-4 pl-5">
          <div className="mb-4">
            <RunAgentModal
              triggerSlot={
                <Button variant="primary" size="large" className="w-full">
                  <PlusIcon size={20} /> 新建运行
                </Button>
              }
              agent={agent}
              agentId={agent.id.toString()}
              onRunCreated={(execution) => handleSelectRun(execution.id)}
              onScheduleCreated={(schedule) =>
                handleSelectRun(`schedule:${schedule.id}`)
              }
            />
          </div>

          <AgentRunsLists
            agent={agent}
            selectedRunId={selectedRun}
            onSelectRun={handleSelectRun}
            onCountsChange={handleCountsChange}
          />
        </div>
      )}

      {/* Main Content - 70% */}
      <div className="flex min-h-0 flex-col gap-4 p-4">
        <div className={!shouldShowSidebar ? "px-2" : ""}>
          <Breadcrumbs
            items={[
              { name: "我的资源库", link: "/library" },
              { name: agent.name, link: `/library/agents/${agentId}` },
            ]}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          {selectedRun ? (
            selectedRun.startsWith("schedule:") ? (
              <SelectedScheduleView
                agent={agent}
                scheduleId={selectedRun.replace("schedule:", "")}
                onClearSelectedRun={handleClearSelectedRun}
              />
            ) : (
              <SelectedRunView
                agent={agent}
                runId={selectedRun}
                onSelectRun={handleSelectRun}
                onClearSelectedRun={handleClearSelectedRun}
              />
            )
          ) : sidebarLoading ? (
            // Show loading state while sidebar is loading to prevent flash of empty state
            <div className="text-gray-600">正在加载运行记录...</div>
          ) : hasAnyItems ? (
            <div className="text-gray-600">选择一个运行以查看详情</div>
          ) : (
            <EmptyAgentRuns agent={agent} />
          )}
        </div>
      </div>
    </div>
  );
}

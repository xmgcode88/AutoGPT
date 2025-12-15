import React from "react";
import { UGCAgentBlock } from "../UGCAgentBlock";
import { useMyAgentsContent } from "./useMyAgentsContent";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { InfiniteScroll } from "@/components/contextual/InfiniteScroll/InfiniteScroll";
import { blockMenuContainerStyle } from "../style";
import { BUILDER_ERROR_CARD_I18N } from "@/app/(platform)/build/i18n";

export const MyAgentsContent = () => {
  const {
    allAgents,
    agentLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    error,
    status,
    refetch,
    handleAddBlock,
    isGettingAgentDetails,
    selectedAgentId,
  } = useMyAgentsContent();

  if (agentLoading) {
    return (
      <div className={blockMenuContainerStyle}>
        {Array.from({ length: 5 }).map((_, index) => (
          <UGCAgentBlock.Skeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full p-4">
        <ErrorCard
          isSuccess={false}
          i18n={BUILDER_ERROR_CARD_I18N}
          context="模块菜单"
          responseError={error || undefined}
          httpError={{
            status: status,
            statusText: "请求失败",
            message: (error?.detail as string) || "发生错误",
          }}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <InfiniteScroll
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      className={blockMenuContainerStyle}
    >
      {allAgents.map((agent) => (
        <UGCAgentBlock
          key={agent.id}
          title={agent.name}
          edited_time={agent.updated_at}
          version={agent.graph_version}
          isLoading={isGettingAgentDetails && selectedAgentId === agent.id}
          image_url={agent.image_url}
          onClick={() => handleAddBlock(agent)}
        />
      ))}
    </InfiniteScroll>
  );
};

import React from "react";
import { BlocksList } from "../BlockList/BlockList";
import { InfiniteScroll } from "@/components/contextual/InfiniteScroll/InfiniteScroll";
import { usePaginatedBlocks } from "./usePaginatedBlocks";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { blockMenuContainerStyle } from "../style";
import { BUILDER_ERROR_CARD_I18N } from "@/app/(platform)/build/i18n";

interface PaginatedBlocksContentProps {
  type?: "all" | "input" | "action" | "output" | null;
}

export const PaginatedBlocksContent: React.FC<PaginatedBlocksContentProps> = ({
  type,
}) => {
  const {
    allBlocks: blocks,
    status,
    blocksLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
    refetch,
  } = usePaginatedBlocks({
    type,
  });

  if (error) {
    return (
      <div className="h-full px-4">
        <ErrorCard
          isSuccess={false}
          httpError={{
            status: status,
            statusText: "请求失败",
            message: (error?.detail as string) || "发生错误",
          }}
          responseError={error || undefined}
          i18n={BUILDER_ERROR_CARD_I18N}
          context="模块菜单"
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
      <BlocksList blocks={blocks} loading={blocksLoading} />
    </InfiniteScroll>
  );
};

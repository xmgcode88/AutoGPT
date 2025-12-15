import React, { Fragment } from "react";
import { Block } from "../Block";
import { Button } from "@/components/__legacy__/ui/button";
import { Separator } from "@/components/__legacy__/ui/separator";
import { useAllBlockContent } from "./useAllBlockContent";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { blockMenuContainerStyle } from "../style";
import { useNodeStore } from "../../../../stores/nodeStore";
import {
  BUILDER_ERROR_CARD_I18N,
  localizeBlockCategoryName,
} from "@/app/(platform)/build/i18n";

export const AllBlocksContent = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    handleRefetchBlocks,
    isLoadingMore,
    isErrorOnLoadingMore,
  } = useAllBlockContent();

  const addBlock = useNodeStore((state) => state.addBlock);

  if (isLoading) {
    return (
      <div className={blockMenuContainerStyle}>
        {[0, 1, 2, 3, 4].map((skeletonIndex) => (
          <Block.Skeleton key={`skeleton-${skeletonIndex}`} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full p-4">
        <ErrorCard
          isSuccess={false}
          responseError={error || undefined}
          i18n={BUILDER_ERROR_CARD_I18N}
          httpError={{
            status: data?.status,
            statusText: "请求失败",
            message: (error?.detail as string) || "发生错误",
          }}
          context="模块菜单"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const categories = data?.categories;

  return (
    <div className={blockMenuContainerStyle}>
      {categories?.map((category, index) => (
        <Fragment key={category.name}>
          {index > 0 && <Separator className="h-[1px] w-full text-zinc-300" />}

          {/* Category Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm font-medium leading-[1.375rem] text-zinc-800">
                {category.name && localizeBlockCategoryName(category.name)}
              </p>
              <span className="rounded-full bg-zinc-100 px-[0.375rem] font-sans text-sm leading-[1.375rem] text-zinc-600">
                {category.total_blocks}
              </span>
            </div>

            <div className="space-y-2">
              {category.blocks.map((block) => (
                <Block
                  key={`${category.name}-${block.id}`}
                  title={block.name as string}
                  description={block.description as string}
                  onClick={() => addBlock(block)}
                  blockData={block}
                />
              ))}

              {isLoadingMore(category.name) && (
                <>
                  {[0, 1, 2].map((skeletonIndex) => (
                    <Block.Skeleton
                      key={`skeleton-${category.name}-${skeletonIndex}`}
                    />
                  ))}
                </>
              )}

              {!isErrorOnLoadingMore && (
                <ErrorCard
                  isSuccess={false}
                  responseError={{ message: "加载模块失败" }}
                  i18n={BUILDER_ERROR_CARD_I18N}
                  context="模块"
                  onRetry={() => handleRefetchBlocks(category.name)}
                />
              )}

              {category.total_blocks > category.blocks.length && (
                <Button
                  variant={"link"}
                  className="px-0 font-sans text-sm leading-[1.375rem] text-zinc-600 underline hover:text-zinc-800"
                  disabled={isLoadingMore(category.name)}
                  onClick={() => handleRefetchBlocks(category.name)}
                >
                  查看全部
                </Button>
              )}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

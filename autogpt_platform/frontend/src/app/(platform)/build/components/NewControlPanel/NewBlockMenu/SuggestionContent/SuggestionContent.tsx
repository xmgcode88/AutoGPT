import React from "react";
import { IntegrationChip } from "../IntegrationChip";
import { Block } from "../Block";
import { useSuggestionContent } from "./useSuggestionContent";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { blockMenuContainerStyle } from "../style";
import { useBlockMenuStore } from "../../../../stores/blockMenuStore";
import { DefaultStateType } from "../types";
import { BUILDER_ERROR_CARD_I18N } from "@/app/(platform)/build/i18n";

export const SuggestionContent = () => {
  const { setIntegration, setDefaultState } = useBlockMenuStore();
  const { data, isLoading, isError, error, refetch } = useSuggestionContent();

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
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const suggestions = data?.suggestions;

  return (
    <div className={blockMenuContainerStyle}>
      <div className="w-full space-y-6 pb-4">
        {/* Integrations */}
        <div className="space-y-2.5 px-4">
          <p className="font-sans text-sm font-medium leading-[1.375rem] text-zinc-800">
            集成
          </p>
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            {!isLoading && suggestions
              ? suggestions.providers.map((provider, index) => (
                  <IntegrationChip
                    key={`integration-${index}`}
                    icon_url={`/integrations/${provider}.png`}
                    name={provider}
                    onClick={() => {
                      setDefaultState(DefaultStateType.INTEGRATIONS);
                      setIntegration(provider);
                    }}
                  />
                ))
              : Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <IntegrationChip.Skeleton
                      key={`integration-skeleton-${index}`}
                    />
                  ))}
          </div>
        </div>

        {/* Top blocks */}
        <div className="space-y-2.5 px-4">
          <p className="font-sans text-sm font-medium leading-[1.375rem] text-zinc-800">
            热门模块
          </p>
          <div className="space-y-2">
            {!isLoading && suggestions
              ? suggestions.top_blocks.map((block, index) => (
                  <Block
                    key={`block-${index}`}
                    title={block.name}
                    description={block.description}
                    blockData={block}
                  />
                ))
              : Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Block.Skeleton key={`block-skeleton-${index}`} />
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { getGetV2GetBuilderItemCountsQueryKey } from "@/app/api/__generated__/endpoints/default/default";
import {
  getGetV2ListLibraryAgentsQueryKey,
  usePostV2AddMarketplaceAgent,
} from "@/app/api/__generated__/endpoints/library/library";
import {
  getV2GetSpecificAgent,
  useGetV2ListStoreAgentsInfinite,
} from "@/app/api/__generated__/endpoints/store/store";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { StoreAgentsResponse } from "@/lib/autogpt-server-api";
import { getQueryClient } from "@/lib/react-query/queryClient";
import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { useAddAgentToBuilder } from "../hooks/useAddAgentToBuilder";
import { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";

export const useMarketplaceAgentsContent = () => {
  const { toast } = useToast();
  const [addingAgent, setAddingAgent] = useState<string | null>(null);
  const { addAgentToBuilder } = useAddAgentToBuilder();

  const {
    data: listStoreAgents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListStoreAgentsLoading,
    isError: isListStoreAgentsError,
    error: listStoreAgentsError,
    refetch: refetchListStoreAgents,
  } = useGetV2ListStoreAgentsInfinite(
    {
      page: 1,
      page_size: 10,
    },
    {
      query: {
        getNextPageParam: (lastPage) => {
          const pagination = (lastPage.data as StoreAgentsResponse).pagination;
          const isMore =
            pagination.current_page * pagination.page_size <
            pagination.total_items;

          return isMore ? pagination.current_page + 1 : undefined;
        },
      },
    },
  );

  const allAgents =
    listStoreAgents?.pages?.flatMap((page) => {
      const response = page.data as StoreAgentsResponse;
      return response.agents;
    }) ?? [];

  const status = listStoreAgents?.pages[0]?.status;

  const { mutateAsync: addMarketplaceAgent } = usePostV2AddMarketplaceAgent({
    mutation: {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: getGetV2ListLibraryAgentsQueryKey(),
        });

        queryClient.refetchQueries({
          queryKey: getGetV2GetBuilderItemCountsQueryKey(),
        });
      },
      onError: (error) => {
        Sentry.captureException(error);
        toast({
          title: "添加智能体到个人库失败",
          description: ((error as any).message as string) || "发生未知错误。",
          variant: "destructive",
        });
      },
    },
  });

  const handleAddStoreAgent = async ({
    creator_name,
    slug,
  }: {
    creator_name: string;
    slug: string;
  }) => {
    try {
      setAddingAgent(slug);
      const { data: agent, status } = await getV2GetSpecificAgent(
        creator_name,
        slug,
      );
      if (status !== 200) {
        Sentry.captureException("Store listing version not found");
        throw new Error("未找到商店条目版本");
      }

      const response = await addMarketplaceAgent({
        data: {
          store_listing_version_id: agent?.store_listing_version_id,
        },
      });

      const libraryAgent = response.data as LibraryAgent;
      addAgentToBuilder(libraryAgent);

      toast({
        title: "智能体已添加",
        description: "智能体已添加到个人库并加入搭建器",
      });
    } catch (error) {
      Sentry.captureException(error);
      toast({
        title: "添加智能体到个人库失败",
        description: ((error as any).message as string) || "发生未知错误。",
        variant: "destructive",
      });
    } finally {
      setAddingAgent(null);
    }
  };

  return {
    handleAddStoreAgent,
    listStoreAgents: allAgents,
    status,
    addingAgent,
    isListStoreAgentsLoading,
    isListStoreAgentsError,
    listStoreAgentsError,
    refetchListStoreAgents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

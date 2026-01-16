"use client";
import {
  getGetV1ListUserApiKeysQueryKey,
  useDeleteV1RevokeApiKey,
  useGetV1ListUserApiKeys,
} from "@/app/api/__generated__/endpoints/api-keys/api-keys";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { getQueryClient } from "@/lib/react-query/queryClient";

export const useAPISection = () => {
  const queryClient = getQueryClient();
  const { toast } = useToast();

  const { data: apiKeys, isLoading } = useGetV1ListUserApiKeys({
    query: {
      select: (res) => {
        if (res.status !== 200) return undefined;

        return res.data.filter((key) => key.status === "ACTIVE");
      },
    },
  });

  const { mutateAsync: revokeAPIKey, isPending: isDeleting } =
    useDeleteV1RevokeApiKey({
      mutation: {
        onSettled: () => {
          return queryClient.invalidateQueries({
            queryKey: getGetV1ListUserApiKeysQueryKey(),
          });
        },
      },
    });

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeAPIKey({
        keyId: keyId,
      });

      toast({
        title: "成功",
        description: "AutoGPT Platform API 密钥已成功撤销",
      });
    } catch {
      toast({
        title: "错误",
        description: "撤销 AutoGPT Platform API 密钥失败",
        variant: "destructive",
      });
    }
  };

  return {
    apiKeys,
    isLoading,
    isDeleting,
    handleRevokeKey,
  };
};

import { useState, useEffect } from "react";
import {
  usePostV1EnableExecutionSharing,
  useDeleteV1DisableExecutionSharing,
} from "@/app/api/__generated__/endpoints/default/default";
import { useToast } from "@/components/molecules/Toast/use-toast";

interface UseShareRunButtonProps {
  graphId: string;
  executionId: string;
  isShared?: boolean;
  shareToken?: string | null;
}

export function useShareRunButton({
  graphId,
  executionId,
  isShared: initialIsShared = false,
  shareToken: initialShareToken,
}: UseShareRunButtonProps) {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [shareToken, setShareToken] = useState(initialShareToken || null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Sync state when props change (e.g., after re-fetching run data)
  useEffect(() => {
    setIsShared(initialIsShared);
    setShareToken(initialShareToken || null);
  }, [initialIsShared, initialShareToken]);

  // Generate the share URL from the token
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || window.location.origin;

  const shareUrl = shareToken ? `${baseUrl}/share/${shareToken}` : "";

  const { mutateAsync: enableSharing, isPending: isEnabling } =
    usePostV1EnableExecutionSharing();
  const { mutateAsync: disableSharing, isPending: isDisabling } =
    useDeleteV1DisableExecutionSharing();

  const loading = isEnabling || isDisabling;

  async function handleShare() {
    try {
      const response = await enableSharing({
        graphId,
        graphExecId: executionId,
        data: {}, // Empty ShareRequest
      });

      if (response.status === 200) {
        setShareToken(response.data.share_token);
        setIsShared(true);
        toast({
          title: "已启用分享",
          description: "该运行已通过分享链接公开可访问。",
        });
      } else {
        toast({
          title: "错误",
          description: "启用分享失败，请重试。",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "错误",
        description: "启用分享失败，请重试。",
        variant: "destructive",
      });
    }
  }

  async function handleStopSharing() {
    try {
      await disableSharing({
        graphId,
        graphExecId: executionId,
      });

      setIsShared(false);
      setShareToken(null);
      toast({
        title: "已停止分享",
        description: "分享链接已不可访问。",
      });
    } catch {
      toast({
        title: "错误",
        description: "停止分享失败，请重试。",
        variant: "destructive",
      });
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "已复制！",
        description: "分享链接已复制到剪贴板。",
      });
    } catch {
      toast({
        title: "错误",
        description: "复制链接失败，请重试。",
        variant: "destructive",
      });
    }
  }

  return {
    isShared,
    shareToken,
    shareUrl,
    copied,
    loading,
    handleShare,
    handleStopSharing,
    handleCopy,
  };
}

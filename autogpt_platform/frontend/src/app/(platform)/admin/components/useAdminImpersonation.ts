"use client";

import { useState, useCallback } from "react";
import { ImpersonationState } from "@/lib/impersonation";
import { useToast } from "@/components/molecules/Toast/use-toast";

interface AdminImpersonationState {
  isImpersonating: boolean;
  impersonatedUserId: string | null;
}

interface AdminImpersonationActions {
  startImpersonating: (userId: string) => void;
  stopImpersonating: () => void;
}

type AdminImpersonationHook = AdminImpersonationState &
  AdminImpersonationActions;

export function useAdminImpersonation(): AdminImpersonationHook {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(
    ImpersonationState.get,
  );
  const { toast } = useToast();

  const isImpersonating = Boolean(impersonatedUserId);

  const startImpersonating = useCallback(
    (userId: string) => {
      if (!userId.trim()) {
        toast({
          title: "模拟需要填写用户 ID",
          variant: "destructive",
        });
        return;
      }

      try {
        ImpersonationState.set(userId);
        setImpersonatedUserId(userId);
        window.location.reload();
      } catch (error) {
        console.error("Failed to start impersonation:", error);
        toast({
          title: "开始模拟失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const stopImpersonating = useCallback(() => {
    try {
      ImpersonationState.clear();
      setImpersonatedUserId(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to stop impersonation:", error);
      toast({
        title: "停止模拟失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    isImpersonating,
    impersonatedUserId,
    startImpersonating,
    stopImpersonating,
  };
}

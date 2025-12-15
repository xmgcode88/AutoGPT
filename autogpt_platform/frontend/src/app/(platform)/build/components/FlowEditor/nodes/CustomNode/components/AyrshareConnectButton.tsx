"use client";

import React, { useState } from "react";

import { Key } from "lucide-react";
import { getV1GetAyrshareSsoUrl } from "@/app/api/__generated__/endpoints/integrations/integrations";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { Button } from "@/components/atoms/Button/Button";

// This SSO button is not a part of inputSchema - that's why we are not rendering it using Input renderer
export const AyrshareConnectButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await getV1GetAyrshareSsoUrl();
      if (status !== 200) {
        throw new Error(data.detail);
      }
      const popup = window.open(data.sso_url, "_blank", "popup=true");
      if (!popup) {
        throw new Error("请允许此站点弹出窗口，以便使用 Ayrshare 登录");
      }
      toast({
        title: "成功",
        description: "请在弹出窗口中完成认证",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: `获取 SSO URL 失败：${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // TODO :Need better UI to show user which social media accounts are connected
    <div className="mt-4 flex flex-col gap-2 px-4">
      <Button
        type="button"
        onClick={handleSSOLogin}
        disabled={isLoading}
        className="h-fit w-full py-2"
        loading={isLoading}
        leftIcon={<Key className="mr-2 h-4 w-4" />}
      >
        连接社交媒体账号
      </Button>
    </div>
  );
};

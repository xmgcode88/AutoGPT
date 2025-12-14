"use client";

import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import { Alert, AlertDescription } from "@/components/molecules/Alert/Alert";
import {
  ShareFatIcon,
  CopyIcon,
  CheckIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useShareRunButton } from "./useShareRunButton";
import { Input } from "@/components/atoms/Input/Input";
import { Text } from "@/components/atoms/Text/Text";

interface Props {
  graphId: string;
  executionId: string;
  isShared?: boolean;
  shareToken?: string | null;
}

export function ShareRunButton({
  graphId,
  executionId,
  isShared: initialIsShared = false,
  shareToken: initialShareToken,
}: Props) {
  const {
    isShared,
    shareUrl,
    copied,
    loading,
    handleShare,
    handleStopSharing,
    handleCopy,
  } = useShareRunButton({
    graphId,
    executionId,
    isShared: initialIsShared,
    shareToken: initialShareToken,
  });

  return (
    <Dialog title="分享运行" styling={{ maxWidth: "36rem", minWidth: "auto" }}>
      <Dialog.Trigger>
        <Button
          variant={isShared ? "primary" : "secondary"}
          size="small"
          className={isShared ? "relative" : ""}
        >
          <ShareFatIcon size={16} />
          {isShared ? "已分享" : "分享"}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <div className="flex flex-col gap-4">
          <Text variant="large">
            {isShared
              ? "该运行当前已分享，任何拥有链接的人都可以查看输出。"
              : "生成一个公开链接，用于与他人分享本次运行的输出。"}
          </Text>

          {!isShared ? (
            <>
              <div className="!mb-4">
                <Alert>
                  <WarningIcon className="h-4 w-4" />
                  <Text variant="body">
                    启用分享后，本次运行的输出将对所有拥有链接的人公开可见。分享页会包含
                    noindex 指令以降低被搜索引擎收录的可能性，但无法完全保证。
                  </Text>
                </Alert>
              </div>
              <Button
                onClick={handleShare}
                loading={loading}
                className="mt-6 w-full"
              >
                启用分享
              </Button>
            </>
          ) : (
            <>
              <div className="flex w-full items-center gap-4">
                <Input
                  type="text"
                  value={shareUrl}
                  readOnly
                  label="分享链接"
                  id="share-url"
                  size="small"
                  className="!m-0"
                  wrapperClassName="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  size="small"
                  className="mt-0.5 !min-w-0"
                >
                  {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                </Button>
              </div>
              <Alert>
                <WarningIcon className="h-4 w-4" />
                <AlertDescription>
                  该链接公开可访问，请仅分享给你信任的人。分享页包含 noindex
                  指令以降低被 搜索引擎收录的可能性。
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleStopSharing}
                loading={loading}
                variant="destructive"
                className="mt-6 w-full"
              >
                停止分享
              </Button>
            </>
          )}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

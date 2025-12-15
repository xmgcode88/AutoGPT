"use client";

import * as React from "react";

import Image from "next/image";
import { StepHeader } from "./StepHeader";
import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";
import { usePathname } from "next/navigation";

interface Props {
  agentName: string;
  subheader: string;
  description: string;
  onClose: () => void;
  onDone: () => void;
  onViewProgress: () => void;
  thumbnailSrc?: string;
}

export function AgentReviewStep({
  agentName,
  subheader,
  description,
  thumbnailSrc,
  onDone,
  onViewProgress,
}: Props) {
  const pathname = usePathname();
  const isDashboardPage = pathname.includes("/profile/dashboard");

  return (
    <div aria-labelledby="modal-title">
      <StepHeader
        title="智能体正在等待审核"
        description={
          isDashboardPage
            ? "审核通过后，该智能体将会上线到 AutoGPT 智能体市场。"
            : "你也可以在创作者控制台查看审核进度"
        }
      />

      <div className="flex flex-1 flex-col items-center gap-8 px-6 pt-6 sm:gap-6">
        <div className="mt-4 flex w-full flex-col items-center gap-6 sm:mt-0 sm:gap-4">
          <div className="gap- flex flex-col items-center">
            <Text
              variant="lead"
              className="line-clamp-1 text-ellipsis text-center font-semibold"
              data-testid="view-agent-name"
            >
              {agentName}
            </Text>
            <Text
              variant="large"
              className="line-clamp-1 text-ellipsis text-center !text-neutral-500"
            >
              {subheader}
            </Text>
          </div>

          <div
            className="aspect-video h-64 w-full rounded-xl bg-neutral-200"
            role="img"
            aria-label={
              thumbnailSrc ? "智能体缩略图" : "缩略图占位"
            }
          >
            {thumbnailSrc && (
              <Image
                src={thumbnailSrc}
                alt="智能体缩略图"
                width={400}
                height={280}
                className="h-full w-full rounded-xl object-cover"
                loading="lazy"
              />
            )}
          </div>

          {description ? (
            <Text
              variant="large"
              className="line-clamp-1 text-ellipsis pt-2 text-center !text-neutral-500"
            >
              {description}
            </Text>
          ) : null}
        </div>
      </div>
      <div
        className={`mt-10 flex ${
          isDashboardPage ? "justify-center" : "justify-between"
        } gap-4`}
      >
        <Button
          variant={isDashboardPage ? "primary" : "secondary"}
          onClick={onDone}
          className={isDashboardPage ? "w-1/2" : "w-full"}
        >
          完成
        </Button>
        {!isDashboardPage ? (
          <Button
            onClick={onViewProgress}
            className="w-full"
            data-testid="view-progress-button"
          >
            查看进度
          </Button>
        ) : null}
      </div>
    </div>
  );
}

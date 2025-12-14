import React from "react";
import { ArrowClockwise, Bug, DiscordLogo } from "@phosphor-icons/react";
import { handleReportError } from "../helpers";
import { ErrorCardProps } from "../ErrorCard";
import { Button } from "@/components/atoms/Button/Button";

interface ActionButtonsProps {
  onRetry?: () => void;
  responseError?: ErrorCardProps["responseError"];
  httpError?: ErrorCardProps["httpError"];
  context: string;
  labels?: {
    retry?: string;
    report?: string;
    help?: string;
  };
}

export function ActionButtons({
  onRetry,
  responseError,
  httpError,
  context,
  labels,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col flex-wrap gap-3 pt-2 sm:flex-row">
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="small">
          <ArrowClockwise size={16} weight="bold" />
          {labels?.retry ?? "Try Again"}
        </Button>
      )}

      <Button
        onClick={() => handleReportError(responseError, httpError, context)}
        variant="ghost"
        size="small"
      >
        <Bug size={16} weight="bold" />
        {labels?.report ?? "Report Error"}
      </Button>

      <Button
        as="NextLink"
        variant="ghost"
        size="small"
        href="https://discord.gg/autogpt"
        target="_blank"
        rel="noopener noreferrer"
      >
        <DiscordLogo size={16} weight="fill" />
        {labels?.help ?? "Get Help"}
      </Button>
    </div>
  );
}

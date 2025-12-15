import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/__legacy__/ui/button";
import { LogOut } from "lucide-react";
import { ClockIcon } from "@phosphor-icons/react";
import { IconPlay, IconSquare } from "@/components/__legacy__/ui/icons";

interface Props {
  onClickAgentOutputs?: () => void;
  onClickRunAgent?: () => void;
  onClickStopRun: () => void;
  onClickScheduleButton?: () => void;
  isRunning: boolean;
  isDisabled: boolean;
  className?: string;
}

export const BuildActionBar: React.FC<Props> = ({
  onClickAgentOutputs,
  onClickRunAgent,
  onClickStopRun,
  onClickScheduleButton,
  isRunning,
  isDisabled,
  className,
}) => {
  const buttonClasses =
    "flex items-center gap-2 text-sm font-medium md:text-lg";
  return (
    <div
      className={cn(
        "flex w-fit select-none items-center justify-center p-4",
        className,
      )}
    >
      <div className="flex gap-1 md:gap-4">
        {onClickAgentOutputs && (
          <Button
            className={buttonClasses}
            variant="outline"
            size="primary"
            onClick={onClickAgentOutputs}
            title="查看智能体输出"
          >
            <LogOut className="hidden size-5 md:flex" /> 智能体输出
          </Button>
        )}

        {!isRunning ? (
          <Button
            className={cn(
              buttonClasses,
              onClickRunAgent && isDisabled
                ? "cursor-default opacity-50 hover:bg-accent"
                : "",
            )}
            variant="accent"
            size="primary"
            onClick={onClickRunAgent}
            disabled={!onClickRunAgent}
            title="运行智能体"
            aria-label="运行智能体"
            data-testid="primary-action-run-agent"
          >
            <IconPlay /> 运行
          </Button>
        ) : (
          <Button
            className={buttonClasses}
            variant="destructive"
            size="primary"
            onClick={onClickStopRun}
            title="停止智能体"
            data-id="primary-action-stop-agent"
          >
            <IconSquare /> 停止
          </Button>
        )}

        {onClickScheduleButton && (
          <Button
            className={buttonClasses}
            variant="outline"
            size="primary"
            onClick={onClickScheduleButton}
            title="为智能体设置定时运行"
            data-id="primary-action-schedule-agent"
          >
            <ClockIcon className="hidden h-5 w-5 md:flex" />
            定时运行
          </Button>
        )}
      </div>
    </div>
  );
};

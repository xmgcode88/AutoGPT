"use client";

import React from "react";
import { GraphExecutionJobInfo } from "@/app/api/__generated__/models/graphExecutionJobInfo";
import { RunSidebarCard } from "./RunSidebarCard";
import { IconWrapper } from "./RunIconWrapper";
import { ClockClockwiseIcon } from "@phosphor-icons/react";
import { formatRelativeTime } from "@/lib/utils/time";

interface ScheduleListItemProps {
  schedule: GraphExecutionJobInfo;
  selected?: boolean;
  onClick?: () => void;
}

export function ScheduleListItem({
  schedule,
  selected,
  onClick,
}: ScheduleListItemProps) {
  return (
    <RunSidebarCard
      title={schedule.name}
      description={formatRelativeTime(schedule.next_run_time, "zh-CN")}
      onClick={onClick}
      selected={selected}
      icon={
        <IconWrapper className="border-slate-50 bg-slate-50">
          <ClockClockwiseIcon
            size={16}
            className="text-slate-700"
            weight="bold"
          />
        </IconWrapper>
      }
    />
  );
}

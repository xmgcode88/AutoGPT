"use client";

import { useGetV1GetUserTimezone } from "@/app/api/__generated__/endpoints/auth/auth";
import type { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Skeleton } from "@/components/__legacy__/ui/skeleton";
import { Text } from "@/components/atoms/Text/Text";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { LIBRARY_ERROR_CARD_I18N } from "@/app/(platform)/library/components/errorCardI18n";
import {
  TabsLine,
  TabsLineContent,
  TabsLineList,
  TabsLineTrigger,
} from "@/components/molecules/TabsLine/TabsLine";
import { humanizeCronExpression } from "@/lib/cron-expression-utils";
import { formatInTimezone, getTimezoneDisplayName } from "@/lib/timezone-utils";
import { AgentInputsReadOnly } from "../../modals/AgentInputsReadOnly/AgentInputsReadOnly";
import { RunDetailCard } from "../RunDetailCard/RunDetailCard";
import { RunDetailHeader } from "../RunDetailHeader/RunDetailHeader";
import { ScheduleActions } from "./components/ScheduleActions";
import { useSelectedScheduleView } from "./useSelectedScheduleView";

interface Props {
  agent: LibraryAgent;
  scheduleId: string;
  onClearSelectedRun?: () => void;
}

export function SelectedScheduleView({
  agent,
  scheduleId,
  onClearSelectedRun,
}: Props) {
  const { schedule, isLoading, error } = useSelectedScheduleView(
    agent.graph_id,
    scheduleId,
  );
  const { data: userTzRes } = useGetV1GetUserTimezone({
    query: {
      select: (res) => (res.status === 200 ? res.data.timezone : undefined),
    },
  });

  if (error) {
    return (
      <ErrorCard
        responseError={
          error
            ? {
                message: String(
                  (error as unknown as { message?: string })?.message ||
                    "加载定时任务失败",
                ),
              }
            : undefined
        }
        httpError={
          (error as any)?.status
            ? {
                status: (error as any).status,
                statusText: (error as any).statusText,
              }
            : undefined
        }
        context="定时任务"
        i18n={LIBRARY_ERROR_CARD_I18N}
      />
    );
  }

  if (isLoading && !schedule) {
    return (
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full flex-col gap-0">
            <RunDetailHeader
              agent={agent}
              run={undefined}
              scheduleRecurrence={
                schedule
                  ? `${humanizeCronExpression(schedule.cron || "", "zh-CN")} · ${getTimezoneDisplayName(schedule.timezone || userTzRes || "UTC", "zh-CN")}`
                  : undefined
              }
            />
          </div>
          {schedule ? (
            <ScheduleActions
              agent={agent}
              scheduleId={schedule.id}
              onDeleted={onClearSelectedRun}
            />
          ) : null}
        </div>
      </div>

      <TabsLine defaultValue="input">
        <TabsLineList>
          <TabsLineTrigger value="input">输入</TabsLineTrigger>
          <TabsLineTrigger value="schedule">定时</TabsLineTrigger>
        </TabsLineList>

        <TabsLineContent value="input">
          <RunDetailCard>
            <div className="relative">
              {/*                 {// TODO: re-enable edit inputs modal once the API supports it */}
              {/* {schedule && Object.keys(schedule.input_data).length > 0 && (
                <EditInputsModal agent={agent} schedule={schedule} />
              )} */}
              <AgentInputsReadOnly
                agent={agent}
                inputs={schedule?.input_data}
                credentialInputs={schedule?.input_credentials}
              />
            </div>
          </RunDetailCard>
        </TabsLineContent>

        <TabsLineContent value="schedule">
          <RunDetailCard>
            {isLoading || !schedule ? (
              <div className="text-neutral-500">加载中…</div>
            ) : (
              <div className="relative flex flex-col gap-8">
                {
                  // TODO: re-enable edit schedule modal once the API supports it
                  /* <EditScheduleModal
                  graphId={agent.graph_id}
                  schedule={schedule}
                /> */
                }
                <div className="flex flex-col gap-1.5">
                  <Text variant="body-medium" className="!text-black">
                    名称
                  </Text>
                  <p className="text-sm text-zinc-600">{schedule.name}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Text variant="body-medium" className="!text-black">
                    重复
                  </Text>
                  <p className="text-sm text-zinc-600">
                    {humanizeCronExpression(schedule.cron, "zh-CN")}
                    {" · "}
                    <span className="text-xs text-zinc-600">
                      {getTimezoneDisplayName(
                        schedule.timezone || userTzRes || "UTC",
                        "zh-CN",
                      )}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Text variant="body-medium" className="!text-black">
                    下次运行
                  </Text>
                  <p className="text-sm text-zinc-600">
                    {formatInTimezone(
                      schedule.next_run_time,
                      userTzRes || "UTC",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                      "zh-CN",
                    )}{" "}
                    ·{" "}
                    <span className="text-xs text-zinc-600">
                      {getTimezoneDisplayName(
                        schedule.timezone || userTzRes || "UTC",
                        "zh-CN",
                      )}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </RunDetailCard>
        </TabsLineContent>
      </TabsLine>
    </div>
  );
}

import { useGetV1GetUserTimezone } from "@/app/api/__generated__/endpoints/auth/auth";
import { getTimezoneDisplayName } from "@/lib/timezone-utils";
import { InfoIcon } from "@phosphor-icons/react";

export function TimezoneNotice() {
  const { data: userTimezone, isSuccess } = useGetV1GetUserTimezone({
    query: {
      select: (res) => (res.status === 200 ? res.data.timezone : undefined),
    },
  });

  if (!isSuccess) {
    return null;
  }

  if (userTimezone === "not-set") {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
        <InfoIcon className="h-4 w-4 text-amber-600" />
        <p className="text-sm text-amber-800">
          未设置时区，定时任务将以 UTC 运行。
          <a href="/profile/settings" className="ml-1 underline">
            去设置时区
          </a>
        </p>
      </div>
    );
  }

  const tzName = getTimezoneDisplayName(userTimezone || "UTC", "zh-CN");

  return (
    <div className="mt-1 flex items-center gap-2 rounded-md bg-muted/50 p-3">
      <InfoIcon className="h-4 w-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        定时任务将使用你的时区运行：{" "}
        <span className="font-medium">{tzName}</span>
      </p>
    </div>
  );
}

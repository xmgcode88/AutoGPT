const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_MINUTE = SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export function formatTimeAgo(dateStr: string, locale: string = "en"): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / MILLISECONDS_PER_MINUTE);
  const isZh = locale.toLowerCase().startsWith("zh");

  if (diffMins < 1) return isZh ? "刚刚" : "just now";
  if (diffMins < SECONDS_PER_MINUTE) return isZh ? `${diffMins} 分钟前` : `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / MINUTES_PER_HOUR);
  if (diffHours < HOURS_PER_DAY) return isZh ? `${diffHours} 小时前` : `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / HOURS_PER_DAY);
  return isZh ? `${diffDays} 天前` : `${diffDays}d ago`;
}

export function formatDate(date: Date | string, locale: string = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(
  date: Date | string,
  locale: string = "en-US",
): string {
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";

  const diffSeconds = Math.round((dateObj.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(diffSeconds, "second");
  if (absSeconds < 60 * 60)
    return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 60 * 60 * 24)
    return rtf.format(Math.round(diffSeconds / (60 * 60)), "hour");
  return rtf.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");
}

export function formatDurationSeconds(
  seconds: number,
  locale: string = "en-US",
): string {
  const totalSeconds = Math.max(0, Math.round(seconds || 0));
  const isZh = locale.toLowerCase().startsWith("zh");

  if (totalSeconds < 60) {
    return isZh
      ? `${totalSeconds} 秒`
      : `${totalSeconds} ${totalSeconds === 1 ? "second" : "seconds"}`;
  }

  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 60) {
    return isZh
      ? `${totalMinutes} 分钟`
      : `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;
  }

  const totalHours = Math.round(totalMinutes / 60);
  if (totalHours < 24) {
    return isZh
      ? `${totalHours} 小时`
      : `${totalHours} ${totalHours === 1 ? "hour" : "hours"}`;
  }

  const totalDays = Math.round(totalHours / 24);
  return isZh
    ? `${totalDays} 天`
    : `${totalDays} ${totalDays === 1 ? "day" : "days"}`;
}

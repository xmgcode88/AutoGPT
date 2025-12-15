import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/__legacy__/ui/select";
import { Label } from "@/components/__legacy__/ui/label";
import { Input } from "@/components/__legacy__/ui/input";
import { Button } from "@/components/__legacy__/ui/button";
import { CronFrequency, makeCronExpression } from "@/lib/cron-expression-utils";

const weekDays = [
  { label: "日", value: 0 },
  { label: "一", value: 1 },
  { label: "二", value: 2 },
  { label: "三", value: 3 },
  { label: "四", value: 4 },
  { label: "五", value: 5 },
  { label: "六", value: 6 },
];

const months = [
  { label: "1月", value: "January" },
  { label: "2月", value: "February" },
  { label: "3月", value: "March" },
  { label: "4月", value: "April" },
  { label: "5月", value: "May" },
  { label: "6月", value: "June" },
  { label: "7月", value: "July" },
  { label: "8月", value: "August" },
  { label: "9月", value: "September" },
  { label: "10月", value: "October" },
  { label: "11月", value: "November" },
  { label: "12月", value: "December" },
];

type CronSchedulerProps = {
  onCronExpressionChange: (cronExpression: string) => void;
  initialCronExpression?: string;
};

export function CronScheduler({
  onCronExpressionChange,
  initialCronExpression,
}: CronSchedulerProps): React.ReactElement {
  const [frequency, setFrequency] = useState<CronFrequency>("daily");
  const [selectedMinute, setSelectedMinute] = useState<string>("0");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [customInterval, setCustomInterval] = useState<{
    value: number;
    unit: "minutes" | "hours" | "days";
  }>({ value: 1, unit: "minutes" });

  // Parse initial cron expression and set state
  useEffect(() => {
    if (!initialCronExpression) {
      // Reset to defaults when no initial expression
      setFrequency("daily");
      setSelectedWeekDays([]);
      setSelectedMonthDays([]);
      setSelectedMonths([]);
      return;
    }

    const parts = initialCronExpression.trim().split(/\s+/);
    if (parts.length !== 5) return;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Reset all state first
    setSelectedWeekDays([]);
    setSelectedMonthDays([]);
    setSelectedMonths([]);

    // Parse patterns in order of specificity
    if (
      minute === "*" &&
      hour === "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*"
    ) {
      setFrequency("every minute");
    } else if (
      hour === "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*" &&
      !minute.includes("/")
    ) {
      setFrequency("hourly");
      setSelectedMinute(minute);
    } else if (
      minute.startsWith("*/") &&
      hour === "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*"
    ) {
      setFrequency("custom");
      const interval = parseInt(minute.substring(2));
      if (!isNaN(interval)) {
        setCustomInterval({ value: interval, unit: "minutes" });
      }
    } else if (
      hour.startsWith("*/") &&
      minute === "0" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*"
    ) {
      setFrequency("custom");
      const interval = parseInt(hour.substring(2));
      if (!isNaN(interval)) {
        setCustomInterval({ value: interval, unit: "hours" });
      }
    } else if (
      dayOfMonth.startsWith("*/") &&
      month === "*" &&
      dayOfWeek === "*" &&
      !minute.includes("/") &&
      !hour.includes("/")
    ) {
      setFrequency("custom");
      const interval = parseInt(dayOfMonth.substring(2));
      if (!isNaN(interval)) {
        setCustomInterval({ value: interval, unit: "days" });
        const hourNum = parseInt(hour);
        const minuteNum = parseInt(minute);
        if (!isNaN(hourNum) && !isNaN(minuteNum)) {
          setSelectedTime(
            `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`,
          );
        }
      }
    } else if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      setFrequency("daily");
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (!isNaN(hourNum) && !isNaN(minuteNum)) {
        setSelectedTime(
          `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`,
        );
      }
    } else if (dayOfWeek !== "*" && dayOfMonth === "*" && month === "*") {
      setFrequency("weekly");
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (!isNaN(hourNum) && !isNaN(minuteNum)) {
        setSelectedTime(
          `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`,
        );
      }
      const days = dayOfWeek
        .split(",")
        .map((d) => parseInt(d))
        .filter((d) => !isNaN(d));
      setSelectedWeekDays(days);
    } else if (dayOfMonth !== "*" && month === "*" && dayOfWeek === "*") {
      setFrequency("monthly");
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (!isNaN(hourNum) && !isNaN(minuteNum)) {
        setSelectedTime(
          `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`,
        );
      }
      const days = dayOfMonth
        .split(",")
        .map((d) => parseInt(d))
        .filter((d) => !isNaN(d) && d >= 1 && d <= 31);
      setSelectedMonthDays(days);
    } else if (dayOfMonth !== "*" && month !== "*" && dayOfWeek === "*") {
      setFrequency("yearly");
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (!isNaN(hourNum) && !isNaN(minuteNum)) {
        setSelectedTime(
          `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`,
        );
      }
      const months = month
        .split(",")
        .map((m) => parseInt(m))
        .filter((m) => !isNaN(m) && m >= 1 && m <= 12);
      setSelectedMonths(months);
    }
  }, [initialCronExpression]);

  useEffect(() => {
    const cronExpr = makeCronExpression({
      frequency,
      minute:
        frequency === "hourly"
          ? parseInt(selectedMinute)
          : parseInt(selectedTime.split(":")[1]),
      hour: parseInt(selectedTime.split(":")[0]),
      days:
        frequency === "weekly"
          ? selectedWeekDays
          : frequency === "monthly"
            ? selectedMonthDays
            : [],
      months: frequency === "yearly" ? selectedMonths : [],
      customInterval:
        frequency === "custom" ? customInterval : { unit: "minutes", value: 1 },
    });
    onCronExpressionChange(cronExpr);
  }, [
    frequency,
    selectedMinute,
    selectedTime,
    selectedWeekDays,
    selectedMonthDays,
    selectedMonths,
    customInterval,
    onCronExpressionChange,
  ]);

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">重复</Label>

        <Select
          value={frequency}
          onValueChange={(value: CronFrequency) => setFrequency(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择频率" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">每小时</SelectItem>
            <SelectItem value="daily">每天</SelectItem>
            <SelectItem value="weekly">每周</SelectItem>
            <SelectItem value="monthly">每月</SelectItem>
            <SelectItem value="yearly">每年</SelectItem>
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>

        {frequency === "hourly" && (
          <div className="flex items-center gap-2">
            <Label>分钟</Label>
            <Select value={selectedMinute} onValueChange={setSelectedMinute}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="选择分钟" />
              </SelectTrigger>
              <SelectContent>
                {[0, 15, 30, 45].map((min) => (
                  <SelectItem key={min} value={min.toString()}>
                    {min}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {frequency === "custom" && (
          <div className="flex items-center gap-2">
            <Label>每</Label>
            <Input
              type="number"
              min="1"
              className="w-20"
              value={customInterval.value}
              onChange={(e) =>
                setCustomInterval({
                  ...customInterval,
                  value: parseInt(e.target.value),
                })
              }
            />
            <Select
              value={customInterval.unit}
              onValueChange={(value: any) =>
                setCustomInterval({ ...customInterval, unit: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">分钟</SelectItem>
                <SelectItem value="hours">小时</SelectItem>
                <SelectItem value="days">天</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {frequency === "weekly" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>重复于</Label>
            <Button
              variant="outline"
              className="h-8 px-2 py-1 text-xs"
              onClick={() => {
                if (selectedWeekDays.length === weekDays.length) {
                  setSelectedWeekDays([]);
                } else {
                  setSelectedWeekDays(weekDays.map((day) => day.value));
                }
              }}
            >
              {selectedWeekDays.length === weekDays.length
                ? "取消全选"
                : "全选"}
            </Button>
            <Button
              variant="outline"
              className="h-8 px-2 py-1 text-xs"
              onClick={() => setSelectedWeekDays([1, 2, 3, 4, 5])}
            >
              工作日
            </Button>
            <Button
              variant="outline"
              className="h-8 px-2 py-1 text-xs"
              onClick={() => setSelectedWeekDays([0, 6])}
            >
              周末
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <Button
                key={day.value}
                variant={
                  selectedWeekDays.includes(day.value) ? "default" : "outline"
                }
                className="h-10 w-10 p-0"
                onClick={() => {
                  setSelectedWeekDays((prev) =>
                    prev.includes(day.value)
                      ? prev.filter((d) => d !== day.value)
                      : [...prev, day.value],
                  );
                }}
              >
                {day.label}
              </Button>
            ))}
          </div>
          {selectedWeekDays.length === 0 && (
            <p className="text-sm text-red-500">请选择至少一个星期几</p>
          )}
        </div>
      )}
      {frequency === "monthly" && (
        <div className="space-y-4">
          <Label>每月日期</Label>
          <div className="flex gap-2">
            <Button
              variant={selectedMonthDays.length === 31 ? "default" : "outline"}
              onClick={() => {
                setSelectedMonthDays(
                  Array.from({ length: 31 }, (_, i) => i + 1),
                );
              }}
            >
              全选
            </Button>
            <Button
              variant={
                selectedMonthDays.length < 31 && selectedMonthDays.length > 0
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                setSelectedMonthDays([]);
              }}
            >
              自定义
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedMonthDays([15])}
            >
              15 日
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedMonthDays([31])}
            >
              最后一天
            </Button>
          </div>
          {selectedMonthDays.length < 31 && (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 31 }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={
                    selectedMonthDays.includes(i + 1) ? "default" : "outline"
                  }
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    setSelectedMonthDays((prev) =>
                      prev.includes(i + 1)
                        ? prev.filter((d) => d !== i + 1)
                        : [...prev, i + 1],
                    );
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
          {selectedMonthDays.length === 0 && (
            <p className="text-sm text-red-500">请选择至少一个日期</p>
          )}
        </div>
      )}
      {frequency === "yearly" && (
        <div className="space-y-4">
          <Label>月份</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 px-2 py-1 text-xs"
              onClick={() => {
                if (selectedMonths.length === months.length) {
                  setSelectedMonths([]);
                } else {
                  setSelectedMonths(
                    Array.from({ length: 12 }, (_, i) => i + 1),
                  );
                }
              }}
            >
              {selectedMonths.length === months.length ? "取消全选" : "全选"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {months.map((month, i) => {
              const monthNumber = i + 1;
              return (
                <Button
                  key={i}
                  variant={
                    selectedMonths.includes(monthNumber) ? "default" : "outline"
                  }
                  className="px-2 py-1"
                  onClick={() => {
                    setSelectedMonths((prev) =>
                      prev.includes(monthNumber)
                        ? prev.filter((m) => m !== monthNumber)
                        : [...prev, monthNumber],
                    );
                  }}
                >
                  {month.label}
                </Button>
              );
            })}
          </div>
          {selectedMonths.length === 0 && (
            <p className="text-sm text-red-500">请选择至少一个月份</p>
          )}
        </div>
      )}

      {frequency !== "hourly" && (
        <div className="flex items-center gap-4 space-y-2">
          <Label className="pt-2">时间</Label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

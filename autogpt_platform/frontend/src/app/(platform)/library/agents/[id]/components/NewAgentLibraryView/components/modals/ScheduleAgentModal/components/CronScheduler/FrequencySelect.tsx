"use client";

import React from "react";
import { Select } from "@/components/atoms/Select/Select";

type CronFrequency =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom"
  | "every minute";

export function FrequencySelect({
  value,
  onChange,
  selectedMinute,
  onMinuteChange,
}: {
  value: CronFrequency;
  onChange: (v: CronFrequency) => void;
  selectedMinute: string;
  onMinuteChange: (v: string) => void;
}) {
  return (
    <>
      <Select
        id="repeat"
        label="重复"
        size="small"
        value={value}
        onValueChange={(v) => onChange(v as CronFrequency)}
        options={[
          { label: "每小时", value: "hourly" },
          { label: "每天", value: "daily" },
          { label: "每周", value: "weekly" },
          { label: "每月", value: "monthly" },
          { label: "每年", value: "yearly" },
          { label: "自定义", value: "custom" },
        ]}
        className="max-w-80"
      />
      {value === "hourly" && (
        <Select
          id="at-minute"
          label="分钟"
          size="small"
          value={selectedMinute}
          onValueChange={(v) => onMinuteChange(v)}
          options={["0", "15", "30", "45"].map((m) => ({ label: m, value: m }))}
          className="max-w-32"
        />
      )}
    </>
  );
}

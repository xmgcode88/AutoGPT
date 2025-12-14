"use client";

import React from "react";
import { Text } from "@/components/atoms/Text/Text";
import { MultiToggle } from "@/components/molecules/MultiToggle/MultiToggle";

const weekDays = [
  { label: "日", value: 0 },
  { label: "一", value: 1 },
  { label: "二", value: 2 },
  { label: "三", value: 3 },
  { label: "四", value: 4 },
  { label: "五", value: 5 },
  { label: "六", value: 6 },
];

export function WeeklyPicker({
  values,
  onChange,
}: {
  values: number[];
  onChange: (v: number[]) => void;
}) {
  function toggleAll() {
    if (values.length === weekDays.length) onChange([]);
    else onChange(weekDays.map((d) => d.value));
  }
  function setWeekdays() {
    onChange([1, 2, 3, 4, 5]);
  }
  function setWeekends() {
    onChange([0, 6]);
  }
  const items = weekDays.map((d) => ({
    value: String(d.value),
    label: d.label,
  }));
  const selectedValues = values.map((v) => String(v));

  return (
    <div className="mb-8 space-y-3">
      <Text variant="body-medium" as="span" className="text-black">
        重复于
      </Text>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="h-[2.25rem] rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium leading-[16px] text-black hover:bg-zinc-100"
          onClick={toggleAll}
        >
          全选
        </button>
        <button
          type="button"
          className="h-[2.25rem] rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium leading-[16px] text-black hover:bg-zinc-100"
          onClick={setWeekdays}
        >
          工作日
        </button>
        <button
          type="button"
          className="h-[2.25rem] rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium leading-[16px] text-black hover:bg-zinc-100"
          onClick={setWeekends}
        >
          周末
        </button>
      </div>
      <MultiToggle
        items={items}
        selectedValues={selectedValues}
        onChange={(sv) => onChange(sv.map((s) => parseInt(s)))}
        aria-label="选择星期"
      />
    </div>
  );
}

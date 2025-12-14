"use client";

import React from "react";
import { Text } from "@/components/atoms/Text/Text";
import { MultiToggle } from "@/components/molecules/MultiToggle/MultiToggle";

const months = [
  { label: "1月", value: 1 },
  { label: "2月", value: 2 },
  { label: "3月", value: 3 },
  { label: "4月", value: 4 },
  { label: "5月", value: 5 },
  { label: "6月", value: 6 },
  { label: "7月", value: 7 },
  { label: "8月", value: 8 },
  { label: "9月", value: 9 },
  { label: "10月", value: 10 },
  { label: "11月", value: 11 },
  { label: "12月", value: 12 },
];

export function YearlyPicker({
  values,
  onChange,
}: {
  values: number[];
  onChange: (v: number[]) => void;
}) {
  function toggleAll() {
    if (values.length === months.length) onChange([]);
    else onChange(months.map((m) => m.value));
  }
  const items = months.map((m) => ({ value: String(m.value), label: m.label }));
  const selected = values.map((v) => String(v));

  return (
    <div className="mb-6 space-y-2">
      <Text variant="body-medium" as="span" className="text-black">
        月份
      </Text>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-[2.25rem] rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium leading-[16px] text-black hover:bg-zinc-100"
          onClick={toggleAll}
        >
          {values.length === months.length ? "取消全选" : "全选"}
        </button>
      </div>
      <MultiToggle
        items={items}
        selectedValues={selected}
        onChange={(sv) => onChange(sv.map((s) => parseInt(s)))}
        aria-label="选择月份"
      />
    </div>
  );
}

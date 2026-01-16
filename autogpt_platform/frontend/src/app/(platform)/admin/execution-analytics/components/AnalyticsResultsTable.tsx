"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Text } from "@/components/atoms/Text/Text";
import { Badge } from "@/components/atoms/Badge/Badge";
import { DownloadIcon, EyeIcon, CopyIcon } from "@phosphor-icons/react";
import { useToast } from "@/components/molecules/Toast/use-toast";
import type { ExecutionAnalyticsResponse } from "@/app/api/__generated__/models/executionAnalyticsResponse";

interface Props {
  results: ExecutionAnalyticsResponse;
}

export function AnalyticsResultsTable({ results }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const createCopyableId = (value: string, label: string) => (
    <div
      className="group flex cursor-pointer items-center gap-1 font-mono text-xs text-gray-500 hover:text-gray-700"
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast({
          title: "已复制",
          description: `已复制${label}到剪贴板`,
        });
      }}
      title={`点击复制${label}`}
    >
      {value.substring(0, 8)}...
      <CopyIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );

  const toggleRowExpansion = (execId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(execId)) {
      newExpanded.delete(execId);
    } else {
      newExpanded.add(execId);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    const headers = [
      "智能体 ID",
      "版本",
      "用户 ID",
      "执行 ID",
      "状态",
      "得分",
      "摘要内容",
      "错误信息",
    ];

    const csvData = results.results.map((result) => [
      result.agent_id,
      result.version_id.toString(),
      result.user_id,
      result.exec_id,
      result.status,
      result.score?.toString() || "",
      `"${(result.summary_text || "").replace(/"/g, '""')}"`, // Escape quotes in summary
      `"${(result.error_message || "").replace(/"/g, '""')}"`, // Escape quotes in error
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `execution-analytics-results-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="success">成功</Badge>;
      case "failed":
        return <Badge variant="error">失败</Badge>;
      case "skipped":
        return <Badge variant="info">已跳过</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const getScoreDisplay = (score?: number) => {
    if (score === undefined || score === null) return "—";

    const percentage = Math.round(score * 100);
    let colorClass = "";

    if (score >= 0.8) colorClass = "text-green-600";
    else if (score >= 0.6) colorClass = "text-yellow-600";
    else if (score >= 0.4) colorClass = "text-orange-600";
    else colorClass = "text-red-600";

    return <span className={colorClass}>{percentage}%</span>;
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="rounded-lg bg-gray-50 p-4">
        <Text variant="h3" className="mb-3">
          分析汇总
        </Text>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
          <div>
            <Text variant="body" className="text-gray-600">
              总执行数：
            </Text>
            <Text variant="h4" className="font-semibold">
              {results.total_executions}
            </Text>
          </div>
          <div>
            <Text variant="body" className="text-gray-600">
              已处理：
            </Text>
            <Text variant="h4" className="font-semibold">
              {results.processed_executions}
            </Text>
          </div>
          <div>
            <Text variant="body" className="text-gray-600">
              成功：
            </Text>
            <Text variant="h4" className="font-semibold text-green-600">
              {results.successful_analytics}
            </Text>
          </div>
          <div>
            <Text variant="body" className="text-gray-600">
              失败：
            </Text>
            <Text variant="h4" className="font-semibold text-red-600">
              {results.failed_analytics}
            </Text>
          </div>
          <div>
            <Text variant="body" className="text-gray-600">
              已跳过：
            </Text>
            <Text variant="h4" className="font-semibold text-gray-600">
              {results.skipped_executions}
            </Text>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={results.results.length === 0}
        >
          <DownloadIcon size={16} className="mr-2" />
          导出 CSV
        </Button>
      </div>

      {/* Results Table */}
      {results.results.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      智能体 ID
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      版本
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      用户 ID
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      执行 ID
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      状态
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      得分
                    </Text>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Text variant="body" className="font-medium text-gray-600">
                      操作
                    </Text>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.results.map((result) => (
                  <React.Fragment key={result.exec_id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {createCopyableId(result.agent_id, "智能体 ID")}
                      </td>
                      <td className="px-4 py-3">
                        <Text variant="body">{result.version_id}</Text>
                      </td>
                      <td className="px-4 py-3">
                        {createCopyableId(result.user_id, "用户 ID")}
                      </td>
                      <td className="px-4 py-3">
                        {createCopyableId(result.exec_id, "执行 ID")}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(result.status)}
                      </td>
                      <td className="px-4 py-3">
                        {getScoreDisplay(
                          typeof result.score === "number"
                            ? result.score
                            : undefined,
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(result.summary_text || result.error_message) && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => toggleRowExpansion(result.exec_id)}
                          >
                            <EyeIcon size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>

                    {expandedRows.has(result.exec_id) && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 px-4 py-3">
                          <div className="space-y-3">
                            {result.summary_text && (
                              <div>
                                <Text
                                  variant="body"
                                  className="mb-1 font-medium text-gray-700"
                                >
                                  摘要：
                                </Text>
                                <Text
                                  variant="body"
                                  className="leading-relaxed text-gray-600"
                                >
                                  {result.summary_text}
                                </Text>
                              </div>
                            )}

                            {result.error_message && (
                              <div>
                                <Text
                                  variant="body"
                                  className="mb-1 font-medium text-red-700"
                                >
                                  错误：
                                </Text>
                                <Text
                                  variant="body"
                                  className="leading-relaxed text-red-600"
                                >
                                  {result.error_message}
                                </Text>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <Text variant="body" className="text-gray-500">
            没有处理任何执行记录。
          </Text>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  TableRow,
  TableCell,
  Table,
  TableHeader,
  TableHead,
  TableBody,
} from "@/components/__legacy__/ui/table";
import { Badge } from "@/components/__legacy__/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  type StoreListingWithVersions,
  type StoreSubmission,
  SubmissionStatus,
} from "@/lib/autogpt-server-api/types";
import { ApproveRejectButtons } from "./ApproveRejectButton";
import { DownloadAgentAdminButton } from "./DownloadAgentButton";

// Moved the getStatusBadge function into the client component
const getStatusBadge = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.PENDING:
      return <Badge className="bg-amber-500">待审核</Badge>;
    case SubmissionStatus.APPROVED:
      return <Badge className="bg-green-500">已通过</Badge>;
    case SubmissionStatus.REJECTED:
      return <Badge className="bg-red-500">已拒绝</Badge>;
    default:
      return <Badge className="bg-gray-500">草稿</Badge>;
  }
};

export function ExpandableRow({
  listing,
  latestVersion,
}: {
  listing: StoreListingWithVersions;
  latestVersion: StoreSubmission | null;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </TableCell>
        <TableCell
          className="font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {latestVersion?.name || "未命名智能体"}
        </TableCell>
        <TableCell onClick={() => setExpanded(!expanded)}>
          {listing.creator_email || "未知"}
        </TableCell>
        <TableCell onClick={() => setExpanded(!expanded)}>
          {latestVersion?.sub_heading || "无描述"}
        </TableCell>
        <TableCell onClick={() => setExpanded(!expanded)}>
          {latestVersion?.status && getStatusBadge(latestVersion.status)}
        </TableCell>
        <TableCell onClick={() => setExpanded(!expanded)}>
          {latestVersion?.date_submitted
            ? formatDistanceToNow(new Date(latestVersion.date_submitted), {
                addSuffix: true,
                locale: zhCN,
              })
            : "未知"}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {latestVersion?.store_listing_version_id && (
              <DownloadAgentAdminButton
                storeListingVersionId={latestVersion.store_listing_version_id}
              />
            )}

            {(latestVersion?.status === SubmissionStatus.PENDING ||
              latestVersion?.status === SubmissionStatus.APPROVED) && (
              <ApproveRejectButtons version={latestVersion} />
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded version history */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={7} className="border-t-0 p-0">
            <div className="bg-muted/30 px-4 py-3">
              <h4 className="mb-2 text-sm font-semibold">版本历史</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>版本</TableHead>
                    <TableHead>状态</TableHead>
                    {/* <TableHead>Changes</TableHead> */}
                    <TableHead>提交时间</TableHead>
                    <TableHead>审核时间</TableHead>
                    <TableHead>外部备注</TableHead>
                    <TableHead>内部备注</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>副标题</TableHead>
                    <TableHead>描述</TableHead>
                    {/* <TableHead>Categories</TableHead> */}
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listing.versions
                    .sort((a, b) => (b.version ?? 1) - (a.version ?? 0))
                    .map((version) => (
                      <TableRow key={version.store_listing_version_id}>
                        <TableCell>
                          v{version.version || "?"}
                          {version.store_listing_version_id ===
                            listing.active_version_id && (
                            <Badge className="ml-2 bg-blue-500">当前</Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(version.status)}</TableCell>
                        {/* <TableCell>
                          {version.changes_summary || "No summary"}
                        </TableCell> */}
                        <TableCell>
                          {version.date_submitted
                            ? formatDistanceToNow(
                                new Date(version.date_submitted),
                                { addSuffix: true, locale: zhCN },
                              )
                            : "未知"}
                        </TableCell>
                        <TableCell>
                          {version.reviewed_at
                            ? formatDistanceToNow(
                                new Date(version.reviewed_at),
                                {
                                  addSuffix: true,
                                  locale: zhCN,
                                },
                              )
                            : "未审核"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {version.review_comments ? (
                            <div
                              className="truncate"
                              title={version.review_comments}
                            >
                              {version.review_comments}
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              无外部备注
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {version.internal_comments ? (
                            <div
                              className="truncate text-pink-600"
                              title={version.internal_comments}
                            >
                              {version.internal_comments}
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              无内部备注
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{version.name}</TableCell>
                        <TableCell>{version.sub_heading}</TableCell>
                        <TableCell>{version.description}</TableCell>
                        {/* <TableCell>{version.categories.join(", ")}</TableCell> */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {version.store_listing_version_id && (
                              <DownloadAgentAdminButton
                                storeListingVersionId={
                                  version.store_listing_version_id
                                }
                              />
                            )}
                            {(version.status === SubmissionStatus.PENDING ||
                              version.status === SubmissionStatus.APPROVED) && (
                              <ApproveRejectButtons version={version} />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

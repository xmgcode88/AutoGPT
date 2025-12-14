"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/DropdownMenu/DropdownMenu";
import Link from "next/link";
import {
  FileArrowDownIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { getV1GetGraphVersion } from "@/app/api/__generated__/endpoints/graphs/graphs";
import { exportAsJSONFile } from "@/lib/utils";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import { useRouter } from "next/navigation";
import { useDeleteV2DeleteLibraryAgent } from "@/app/api/__generated__/endpoints/library/library";
import { Text } from "@/components/atoms/Text/Text";

interface Props {
  agent: LibraryAgent;
}

export function AgentActionsDropdown({ agent }: Props) {
  const { toast } = useToast();
  const { mutateAsync: deleteAgent } = useDeleteV2DeleteLibraryAgent();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDelete() {
    if (!agent.id) return;

    setIsDeleting(true);

    try {
      await deleteAgent({ libraryAgentId: agent.id });
      toast({ title: "智能体已删除" });
      setShowDeleteDialog(false);
      router.push("/library");
    } catch (error: unknown) {
      toast({
        title: "删除智能体失败",
        description: error instanceof Error ? error.message : "发生未知错误。",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleExport() {
    try {
      const res = await getV1GetGraphVersion(
        agent.graph_id,
        agent.graph_version,
        { for_export: true },
      );
      if (res.status === 200) {
        const filename = `${agent.name}_v${agent.graph_version}.json`;
        exportAsJSONFile(res.data as any, filename);
        toast({ title: "智能体已导出" });
      } else {
        toast({ title: "导出智能体失败", variant: "destructive" });
      }
    } catch (e: any) {
      toast({
        title: "导出智能体失败",
        description: e?.message,
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="small" className="min-w-fit">
            更多
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`/build?flowID=${agent.graph_id}&flowVersion=${agent.graph_version}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              <PencilSimpleIcon size={16} /> 编辑智能体
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <FileArrowDownIcon size={16} /> 导出智能体
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <TrashIcon size={16} /> 删除智能体
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        controlled={{
          isOpen: showDeleteDialog,
          set: setShowDeleteDialog,
        }}
        styling={{ maxWidth: "32rem" }}
        title="删除智能体"
      >
        <Dialog.Content>
          <div>
            <Text variant="large">
              确定要删除这个智能体吗？此操作无法撤销。
            </Text>
            <Dialog.Footer>
              <Button
                variant="secondary"
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(false)}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={isDeleting}
              >
                删除
              </Button>
            </Dialog.Footer>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

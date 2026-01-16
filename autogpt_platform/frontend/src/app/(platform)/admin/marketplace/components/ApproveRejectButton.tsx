"use client";

import { useState } from "react";
import { Button } from "@/components/__legacy__/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/__legacy__/ui/dialog";
import { Label } from "@/components/__legacy__/ui/label";
import { Textarea } from "@/components/__legacy__/ui/textarea";
import type { StoreSubmission } from "@/lib/autogpt-server-api/types";
import { useRouter } from "next/navigation";
import {
  approveAgent,
  rejectAgent,
} from "@/app/(platform)/admin/marketplace/actions";

export function ApproveRejectButtons({
  version,
}: {
  version: StoreSubmission;
}) {
  const router = useRouter();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const isApproved = version.status === "APPROVED";

  const handleApproveSubmit = async (formData: FormData) => {
    setIsApproveDialogOpen(false);
    try {
      await approveAgent(formData);
      router.refresh(); // Refresh the current route
    } catch (error) {
      console.error("Error approving agent:", error);
    }
  };

  const handleRejectSubmit = async (formData: FormData) => {
    setIsRejectDialogOpen(false);
    try {
      await rejectAgent(formData);
      router.refresh(); // Refresh the current route
    } catch (error) {
      console.error("Error rejecting agent:", error);
    }
  };

  return (
    <>
      {!isApproved && (
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={(e) => {
            e.stopPropagation();
            setIsApproveDialogOpen(true);
          }}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          通过
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={(e) => {
          e.stopPropagation();
          setIsRejectDialogOpen(true);
        }}
      >
        <XCircle className="mr-2 h-4 w-4" />
        {isApproved ? "撤销" : "拒绝"}
      </Button>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>通过智能体</DialogTitle>
            <DialogDescription>
              确定通过该智能体吗？通过后将显示在市场中。
            </DialogDescription>
          </DialogHeader>

          <form action={handleApproveSubmit}>
            <input
              type="hidden"
              name="id"
              value={version.store_listing_version_id || ""}
            />

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="comments">备注（可选）</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="给智能体创建者的备注"
                  defaultValue="符合所有要求"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApproveDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">通过</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApproved ? "撤销已通过的智能体" : "拒绝智能体"}
            </DialogTitle>
            <DialogDescription>
              {isApproved
                ? "确定撤销该智能体的通过状态吗？这将从市场中移除。"
                : "请填写拒绝原因反馈给创建者。"}
            </DialogDescription>
          </DialogHeader>

          <form action={handleRejectSubmit}>
            <input
              type="hidden"
              name="id"
              value={version.store_listing_version_id || ""}
            />

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="comments">给创建者的备注</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="请输入给创建者的反馈"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="internal_comments">内部备注</Label>
                <Textarea
                  id="internal_comments"
                  name="internal_comments"
                  placeholder="添加内部备注（创建者不可见）"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" variant="destructive">
                {isApproved ? "撤销" : "拒绝"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/__legacy__/ui/button";
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
import { Input } from "@/components/__legacy__/ui/input";
import { useRouter } from "next/navigation";
import { addDollars } from "@/app/(platform)/admin/spending/actions";
import { useToast } from "@/components/molecules/Toast/use-toast";

export function AdminAddMoneyButton({
  userId,
  userEmail,
  currentBalance,
  defaultAmount,
  defaultComments,
}: {
  userId: string;
  userEmail: string;
  currentBalance: number;
  defaultAmount?: number;
  defaultComments?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddMoneyDialogOpen, setIsAddMoneyDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dollarAmount, setDollarAmount] = useState(
    defaultAmount ? Math.abs(defaultAmount / 100).toFixed(2) : "1.00",
  );

  const handleApproveSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addDollars(formData);
      setIsAddMoneyDialogOpen(false);
      toast({
        title: "成功",
        description: `已向 ${userEmail} 余额添加 $${dollarAmount}`,
      });
      router.refresh(); // Refresh the current route
    } catch (error) {
      console.error("Error adding dollars:", error);
      toast({
        title: "错误",
        description: "添加金额失败，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          setIsAddMoneyDialogOpen(true);
        }}
      >
        添加金额
      </Button>

      {/* Add $$$ Dialog */}
      <Dialog
        open={isAddMoneyDialogOpen}
        onOpenChange={setIsAddMoneyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加金额</DialogTitle>
            <DialogDescription className="pt-2">
              <div className="mb-2">
                <span className="font-medium">用户：</span> {userEmail}
              </div>
              <div>
                <span className="font-medium">当前余额：</span> $
                {(currentBalance / 100).toFixed(2)}
              </div>
            </DialogDescription>
          </DialogHeader>

          <form action={handleApproveSubmit}>
            <input type="hidden" name="id" value={userId} />
            <input
              type="hidden"
              name="amount"
              value={Math.round(parseFloat(dollarAmount) * 100)}
            />

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dollarAmount">金额（美元）</Label>
                <div className="flex">
                  <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-gray-50 px-3 text-gray-500">
                    $
                  </div>
                  <Input
                    id="dollarAmount"
                    type="number"
                    step="0.01"
                    className="rounded-l-none"
                    value={dollarAmount}
                    onChange={(e) => setDollarAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="comments">备注（可选）</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="请输入添加金额的原因"
                  defaultValue={defaultComments || "感谢支持！"}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMoneyDialogOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "添加中..." : "添加金额"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

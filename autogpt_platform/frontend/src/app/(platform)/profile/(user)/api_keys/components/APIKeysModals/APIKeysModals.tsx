"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/__legacy__/ui/dialog";
import { LuCopy } from "react-icons/lu";
import { Label } from "@/components/__legacy__/ui/label";
import { Input } from "@/components/__legacy__/ui/input";
import { Checkbox } from "@/components/__legacy__/ui/checkbox";
import { Button } from "@/components/__legacy__/ui/button";

import { useAPIkeysModals } from "./useAPIkeysModals";
import { APIKeyPermission } from "@/app/api/__generated__/models/aPIKeyPermission";

const translatePermission = (permission: string): string => {
  const permissionTranslations: Record<string, string> = {
    [APIKeyPermission.EXECUTE_GRAPH]: "执行图",
    [APIKeyPermission.READ_GRAPH]: "读取图",
    [APIKeyPermission.EXECUTE_BLOCK]: "执行块",
    [APIKeyPermission.READ_BLOCK]: "读取块",
  };
  return permissionTranslations[permission] || permission;
};

export const APIKeysModals = () => {
  const {
    isCreating,
    handleCreateKey,
    handleCopyKey,
    setIsCreateOpen,
    setIsKeyDialogOpen,
    isCreateOpen,
    isKeyDialogOpen,
    keyState,
    setKeyState,
  } = useAPIkeysModals();

  return (
    <div className="mb-4 flex justify-end">
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button>创建密钥</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新的 API 密钥</DialogTitle>
            <DialogDescription>
              创建一个新的 AutoGPT Platform API 密钥
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                value={keyState.newKeyName}
                onChange={(e) =>
                  setKeyState((prev) => ({
                    ...prev,
                    newKeyName: e.target.value,
                  }))
                }
                placeholder="My AutoGPT Platform API Key"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述（可选）</Label>
              <Input
                id="description"
                value={keyState.newKeyDescription}
                onChange={(e) =>
                  setKeyState((prev) => ({
                    ...prev,
                    newKeyDescription: e.target.value,
                  }))
                }
                placeholder="Used for..."
              />
            </div>
            <div className="grid gap-2">
              <Label>权限</Label>
              {Object.values(APIKeyPermission).map((permission) => (
                <div className="flex items-center space-x-2" key={permission}>
                  <Checkbox
                    id={permission}
                    checked={keyState.selectedPermissions.includes(permission)}
                    onCheckedChange={(checked: boolean) => {
                      setKeyState((prev) => ({
                        ...prev,
                        selectedPermissions: checked
                          ? [...prev.selectedPermissions, permission]
                          : prev.selectedPermissions.filter(
                              (p) => p !== permission,
                            ),
                      }));
                    }}
                  />
                  <Label htmlFor={permission}>{translatePermission(permission)}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateKey} disabled={isCreating}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AutoGPT Platform API 密钥已创建</DialogTitle>
            <DialogDescription>
              请立即复制您的 AutoGPT API 密钥。您将无法再次查看它！
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <code className="flex-1 rounded-md bg-secondary p-2 text-sm">
              {keyState.newApiKey}
            </code>
            <Button size="icon" variant="outline" onClick={handleCopyKey}>
              <LuCopy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsKeyDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

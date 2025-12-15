import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/__legacy__/ui/sheet";
import { ScrollArea } from "@/components/__legacy__/ui/scroll-area";
import { Label } from "@/components/__legacy__/ui/label";
import { Textarea } from "@/components/__legacy__/ui/textarea";
import { Button } from "@/components/__legacy__/ui/button";
import { Clipboard } from "lucide-react";
import { useToast } from "@/components/molecules/Toast/use-toast";

export type OutputNodeInfo = {
  metadata: {
    name: string;
    description: string;
  };
  result?: any;
};

interface OutputModalProps {
  isOpen: boolean;
  doClose: () => void;
  outputs: OutputNodeInfo[];
  graphExecutionError?: string | null;
}

const formatOutput = (output: any): string => {
  if (typeof output === "object") {
    try {
      if (
        Array.isArray(output) &&
        output.every((item) => typeof item === "string")
      ) {
        return output.join("\n").replace(/\\n/g, "\n");
      }
      return JSON.stringify(output, null, 2);
    } catch (error) {
      return `格式化输出时出错：${(error as Error).message}`;
    }
  }
  if (typeof output === "string") {
    return output.replace(/\\n/g, "\n");
  }
  return String(output);
};

export function RunnerOutputUI({
  isOpen,
  doClose,
  outputs,
  graphExecutionError,
}: OutputModalProps) {
  const { toast } = useToast();

  const copyOutput = (name: string, output: any) => {
    const formattedOutput = formatOutput(output);
    navigator.clipboard.writeText(formattedOutput).then(() => {
      toast({
        title: `"${name}" 输出已复制到剪贴板！`,
        duration: 2000,
      });
    });
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={doClose}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden sm:max-w-[600px]"
      >
        <SheetHeader className="px-2 py-2">
          <SheetTitle className="text-xl">运行输出</SheetTitle>
          <SheetDescription className="mt-1 text-sm">
            查看本次智能体运行的输出。
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto px-2 py-2">
          <ScrollArea className="h-full overflow-auto pr-4">
            <div className="space-y-4">
              {graphExecutionError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>错误：</strong> {graphExecutionError}
                  </p>
                </div>
              )}
              {outputs && outputs.length > 0 ? (
                outputs.map((output, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-base font-semibold">
                      {output.metadata.name || "未命名输出"}
                    </Label>

                    {output.metadata.description && (
                      <Label className="block text-sm text-gray-600">
                        {output.metadata.description}
                      </Label>
                    )}

                    <div className="group relative rounded-md bg-gray-100 p-2">
                      <Button
                        className="absolute right-1 top-1 z-10 m-1 hidden p-2 group-hover:block"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyOutput(
                            output.metadata.name || "未命名输出",
                            output.result,
                          )
                        }
                        title="复制输出"
                      >
                        <Clipboard size={18} />
                      </Button>
                      <Textarea
                        readOnly
                        value={formatOutput(output.result ?? "暂无输出")}
                        className="w-full resize-none whitespace-pre-wrap break-words border-none bg-transparent text-sm"
                        style={{
                          height: "auto",
                          minHeight: "2.5rem",
                          maxHeight: "400px",
                        }}
                        ref={(el) => {
                          if (el) {
                            adjustTextareaHeight(el);
                            if (el.scrollHeight > 400) {
                              el.style.height = "400px";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>暂无输出模块。</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RunnerOutputUI;

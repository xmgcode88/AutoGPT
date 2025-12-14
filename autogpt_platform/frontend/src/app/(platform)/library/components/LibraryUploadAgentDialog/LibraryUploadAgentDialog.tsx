"use client";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/__legacy__/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/__legacy__/ui/dialog";
import { z } from "zod";
import { FileUploader } from "react-drag-drop-files";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/__legacy__/ui/form";
import { Input } from "@/components/__legacy__/ui/input";
import { Textarea } from "@/components/__legacy__/ui/textarea";
import { useLibraryUploadAgentDialog } from "./useLibraryUploadAgentDialog";

const fileTypes = ["JSON"];

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "请选择文件",
});

export const uploadAgentFormSchema = z.object({
  agentFile: fileSchema,
  agentName: z.string().min(1, "请输入智能体名称"),
  agentDescription: z.string(),
});

export default function LibraryUploadAgentDialog(): React.ReactNode {
  const {
    onSubmit,
    isUploading,
    isOpen,
    setIsOpen,
    isDroped,
    handleChange,
    form,
    setisDroped,
    agentObject,
    clearAgentFile,
  } = useLibraryUploadAgentDialog();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="upload-agent-button"
          variant="primary"
          className="w-fit sm:w-[177px]"
        >
          <Upload className="h-5 w-5 sm:mr-2" />
          <span className="hidden items-center sm:inline-flex">上传智能体</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8 text-center">上传智能体</DialogTitle>
          <DialogDescription>
            请提供名称、描述和 JSON 文件以上传你的智能体。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>智能体名称</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full rounded-[10px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="w-full rounded-[10px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentFile"
              render={({ field }) => (
                <FormItem className="rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-600">
                  <FormControl>
                    {field.value ? (
                      <div className="relative flex rounded-[10px] border p-2 font-sans text-sm font-medium text-[#525252] outline-none">
                        <span className="line-clamp-1">{field.value.name}</span>
                        <Button
                          onClick={clearAgentFile}
                          className="absolute left-[-10px] top-[-16px] mt-2 h-fit border-none bg-red-200 p-1"
                        >
                          <X
                            className="m-0 h-[12px] w-[12px] text-red-600"
                            strokeWidth={3}
                          />
                        </Button>
                      </div>
                    ) : (
                      <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}
                        label={"在此上传智能体..."}
                        uploadedLabel={"上传成功"}
                        required={true}
                        hoverTitle={"将智能体拖到这里..."}
                        maxSize={10}
                        classes={"drop-style"}
                        onDrop={() => {
                          setisDroped(true);
                        }}
                        onSelect={() => setisDroped(true)}
                      >
                        <div
                          style={{
                            minHeight: "150px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            outline: "none",
                            color: "#525252",
                            fontSize: "14px",
                            fontWeight: "500",
                            borderWidth: "0px",
                          }}
                        >
                          {isDroped ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-neutral-800"></div>
                            </div>
                          ) : (
                            <>
                              <span>将智能体拖到这里</span>
                              <span>或</span>
                              <span>点击上传</span>
                            </>
                          )}
                        </div>
                      </FileUploader>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="primary"
              className="mt-2 self-end"
              disabled={!agentObject || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                  <span>上传中...</span>
                </div>
              ) : (
                "上传智能体"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

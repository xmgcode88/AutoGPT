import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadAgentFormSchema } from "./LibraryUploadAgentDialog";
import { usePostV1CreateNewGraph } from "@/app/api/__generated__/endpoints/graphs/graphs";
import { GraphModel } from "@/app/api/__generated__/models/graphModel";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { useState } from "react";
import { Graph } from "@/app/api/__generated__/models/graph";
import { sanitizeImportedGraph } from "@/lib/autogpt-server-api";

export const useLibraryUploadAgentDialog = () => {
  const [isDroped, setisDroped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [agentObject, setAgentObject] = useState<Graph | null>(null);

  const { mutateAsync: createGraph, isPending: isUploading } =
    usePostV1CreateNewGraph({
      mutation: {
        onSuccess: ({ data }) => {
          setIsOpen(false);
          toast({
            title: "成功",
            description: "智能体上传成功",
            variant: "default",
          });
          const qID = "flowID";
          window.location.href = `/build?${qID}=${(data as GraphModel).id}`;
        },
        onError: () => {
          toast({
            title: "错误",
            description: "上传智能体时出错",
            variant: "destructive",
          });
        },
      },
    });

  const form = useForm<z.infer<typeof uploadAgentFormSchema>>({
    resolver: zodResolver(uploadAgentFormSchema),
    defaultValues: {
      agentName: "",
      agentDescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadAgentFormSchema>) => {
    if (!agentObject) {
      form.setError("root", { message: "没有可保存的智能体对象" });
      return;
    }

    const payload: Graph = {
      ...agentObject,
      name: values.agentName,
      description: values.agentDescription,
      is_active: true,
    };

    await createGraph({
      data: {
        graph: payload,
      },
    });
  };

  const handleChange = (file: File) => {
    setTimeout(() => {
      setisDroped(false);
    }, 2000);

    form.setValue("agentFile", file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (
          !["name", "description", "nodes", "links"].every(
            (key) => key in obj && obj[key] != null,
          )
        ) {
          throw new Error(
            "无效的智能体文件。请上传一个从 AutoGPT Platform 导出的有效 agent.json 文件。文件必须包含字段：name、description、nodes、links。",
          );
        }
        const agent = obj as Graph;
        sanitizeImportedGraph(agent);
        setAgentObject(agent);
        if (!form.getValues("agentName")) {
          form.setValue("agentName", agent.name);
        }
        if (!form.getValues("agentDescription")) {
          form.setValue("agentDescription", agent.description);
        }
      } catch (error) {
        console.error("Error loading agent file:", error);

        toast({
          title: "无效的智能体文件",
          description:
            "请上传一个从 AutoGPT Platform 导出的有效 agent.json 文件。文件必须包含字段：name、description、nodes、links。",
          duration: 5000,
          variant: "destructive",
        });

        form.resetField("agentFile");
        setAgentObject(null);
      }
    };
    reader.readAsText(file);
    setisDroped(false);
  };

  const clearAgentFile = () => {
    const currentName = form.getValues("agentName");
    const currentDescription = form.getValues("agentDescription");
    const prevAgent = agentObject;

    form.setValue("agentFile", undefined as any);
    if (prevAgent && currentName === prevAgent.name) {
      form.setValue("agentName", "");
    }
    if (prevAgent && currentDescription === prevAgent.description) {
      form.setValue("agentDescription", "");
    }

    setAgentObject(null);
  };

  return {
    onSubmit,
    isUploading,
    isOpen,
    setIsOpen,
    form,
    agentObject,
    isDroped,
    handleChange,
    setisDroped,
    clearAgentFile,
  };
};

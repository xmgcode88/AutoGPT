import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
} from "@/components/__legacy__/ui/form";
import useCredentials from "@/hooks/useCredentials";
import {
  BlockIOCredentialsSubSchema,
  CredentialsMetaInput,
} from "@/lib/autogpt-server-api/types";
import { getHostFromUrl } from "@/lib/utils/url";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

type Props = {
  schema: BlockIOCredentialsSubSchema;
  open: boolean;
  onClose: () => void;
  onCredentialsCreate: (creds: CredentialsMetaInput) => void;
  siblingInputs?: Record<string, any>;
};

export function HostScopedCredentialsModal({
  schema,
  open,
  onClose,
  onCredentialsCreate,
  siblingInputs,
}: Props) {
  const credentials = useCredentials(schema, siblingInputs);

  // Get current host from siblingInputs or discriminator_values
  const currentUrl = credentials?.discriminatorValue;
  const currentHost = currentUrl ? getHostFromUrl(currentUrl) : "";

  const formSchema = z.object({
    host: z.string().min(1, "请输入主机"),
    title: z.string().optional(),
    headers: z.record(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: currentHost || "",
      title: currentHost || "手动输入",
      headers: {},
    },
  });

  const [headerPairs, setHeaderPairs] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "", value: "" }]);

  // Update form values when siblingInputs change
  useEffect(() => {
    if (currentHost) {
      form.setValue("host", currentHost);
      form.setValue("title", currentHost);
    } else {
      // Reset to empty when no current host
      form.setValue("host", "");
      form.setValue("title", "手动输入");
    }
  }, [currentHost, form]);

  if (
    !credentials ||
    credentials.isLoading ||
    !credentials.supportsHostScoped
  ) {
    return null;
  }

  const { provider, providerName, createHostScopedCredentials } = credentials;

  const addHeaderPair = () => {
    setHeaderPairs([...headerPairs, { key: "", value: "" }]);
  };

  const removeHeaderPair = (index: number) => {
    if (headerPairs.length > 1) {
      setHeaderPairs(headerPairs.filter((_, i) => i !== index));
    }
  };

  const updateHeaderPair = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newPairs = [...headerPairs];
    newPairs[index][field] = value;
    setHeaderPairs(newPairs);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert header pairs to object, filtering out empty pairs
    const headers = headerPairs.reduce(
      (acc, pair) => {
        if (pair.key.trim() && pair.value.trim()) {
          acc[pair.key.trim()] = pair.value.trim();
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const newCredentials = await createHostScopedCredentials({
      host: values.host,
      title: currentHost || values.host,
      headers,
    });

    onCredentialsCreate({
      provider,
      id: newCredentials.id,
      type: "host_scoped",
      title: newCredentials.title,
    });
  }

  return (
    <Dialog
      title={`为 ${providerName} 添加敏感请求头`}
      controlled={{
        isOpen: open,
        set: (isOpen) => {
          if (!isOpen) onClose();
        },
      }}
      onClose={onClose}
      styling={{
        maxWidth: "25rem",
      }}
    >
      <Dialog.Content>
        {schema.description && (
          <p className="mb-4 text-sm text-zinc-600">{schema.description}</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <Input
                  id="host"
                  label="主机模式"
                  type="text"
                  size="small"
                  readOnly={!!currentHost}
                  hint={
                    currentHost
                      ? "已从 URL 字段自动填充。请求发送到该主机时会自动附加这些请求头。"
                      : "请输入要匹配请求 URL 的主机/域名（例如 api.example.com）。"
                  }
                  placeholder={
                    currentHost
                      ? undefined
                      : "请输入主机（例如 api.example.com）"
                  }
                  {...field}
                />
              )}
            />

            <div className="space-y-2">
              <FormLabel>请求头</FormLabel>
              <FormDescription className="max-w-md">
                添加敏感请求头（如
                Authorization、X-API-Key），将自动附加到指定主机的请求中。
              </FormDescription>

              {headerPairs.map((pair, index) => (
                <div key={index} className="flex w-full items-center gap-4">
                  <Input
                    id={`header-${index}-key`}
                    label="请求头名称"
                    placeholder="请求头名称（如 Authorization）"
                    size="small"
                    value={pair.key}
                    className="flex-1"
                    onChange={(e) =>
                      updateHeaderPair(index, "key", e.target.value)
                    }
                  />

                  <Input
                    id={`header-${index}-value`}
                    label="请求头值"
                    size="small"
                    type="password"
                    className="flex-2"
                    placeholder="请求头值（如 Bearer token123）"
                    value={pair.value}
                    onChange={(e) =>
                      updateHeaderPair(index, "value", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => removeHeaderPair(index)}
                    disabled={headerPairs.length === 1}
                  >
                    <TrashIcon className="size-4" /> 移除
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={addHeaderPair}
              >
                <PlusIcon className="size-4" /> 添加另一条请求头
              </Button>
            </div>

            <div className="pt-8">
              <Button type="submit" className="w-full" size="small">
                保存并使用这些凭据
              </Button>
            </div>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}

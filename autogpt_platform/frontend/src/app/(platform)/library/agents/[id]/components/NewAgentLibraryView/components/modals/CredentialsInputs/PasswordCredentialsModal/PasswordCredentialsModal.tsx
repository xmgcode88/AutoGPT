import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import { Form, FormField } from "@/components/__legacy__/ui/form";
import useCredentials from "@/hooks/useCredentials";
import {
  BlockIOCredentialsSubSchema,
  CredentialsMetaInput,
} from "@/lib/autogpt-server-api/types";

type Props = {
  schema: BlockIOCredentialsSubSchema;
  open: boolean;
  onClose: () => void;
  onCredentialsCreate: (creds: CredentialsMetaInput) => void;
  siblingInputs?: Record<string, any>;
};

export function PasswordCredentialsModal({
  schema,
  open,
  onClose,
  onCredentialsCreate,
  siblingInputs,
}: Props) {
  const credentials = useCredentials(schema, siblingInputs);

  const formSchema = z.object({
    username: z.string().min(1, "请输入用户名"),
    password: z.string().min(1, "请输入密码"),
    title: z.string().min(1, "请输入名称"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      title: "",
    },
  });

  if (
    !credentials ||
    credentials.isLoading ||
    !credentials.supportsUserPassword
  ) {
    return null;
  }

  const { provider, providerName, createUserPasswordCredentials } = credentials;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newCredentials = await createUserPasswordCredentials({
      username: values.username,
      password: values.password,
      title: values.title,
    });
    onCredentialsCreate({
      provider,
      id: newCredentials.id,
      type: "user_password",
      title: newCredentials.title,
    });
  }

  return (
    <Dialog
      title={`为 ${providerName} 添加新的用户名和密码`}
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 pt-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <Input
                  id="username"
                  label="用户名"
                  type="text"
                  placeholder="请输入用户名..."
                  size="small"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input
                  id="password"
                  label="密码"
                  type="password"
                  placeholder="请输入密码..."
                  size="small"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  label="名称"
                  type="text"
                  placeholder="请输入此登录方式的名称..."
                  size="small"
                  {...field}
                />
              )}
            />
            <Button type="submit" size="small" className="min-w-68">
              保存并使用该登录方式
            </Button>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}

import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/molecules/Dialog/Dialog";
import {
  Form,
  FormDescription,
  FormField,
} from "@/components/__legacy__/ui/form";
import {
  BlockIOCredentialsSubSchema,
  CredentialsMetaInput,
} from "@/lib/autogpt-server-api/types";
import { useAPIKeyCredentialsModal } from "./useAPIKeyCredentialsModal";

type Props = {
  schema: BlockIOCredentialsSubSchema;
  open: boolean;
  onClose: () => void;
  onCredentialsCreate: (creds: CredentialsMetaInput) => void;
  siblingInputs?: Record<string, any>;
};

export function APIKeyCredentialsModal({
  schema,
  open,
  onClose,
  onCredentialsCreate,
  siblingInputs,
}: Props) {
  const {
    form,
    isLoading,
    supportsApiKey,
    providerName,
    schemaDescription,
    onSubmit,
  } = useAPIKeyCredentialsModal({ schema, siblingInputs, onCredentialsCreate });

  if (isLoading || !supportsApiKey) {
    return null;
  }

  return (
    <Dialog
      title={`为 ${providerName ?? ""} 添加新的 API 密钥`}
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
        {schemaDescription && (
          <p className="mb-4 text-sm text-zinc-600">{schemaDescription}</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <>
                  <Input
                    id="apiKey"
                    label="API 密钥"
                    type="password"
                    placeholder="请输入 API 密钥..."
                    size="small"
                    hint={
                      schema.credentials_scopes ? (
                        <FormDescription>
                          该模块所需权限范围：{" "}
                          {schema.credentials_scopes?.map((s, i, a) => (
                            <span key={i}>
                              <code className="text-xs font-bold">{s}</code>
                              {i < a.length - 1 && ", "}
                            </span>
                          ))}
                        </FormDescription>
                      ) : null
                    }
                    {...field}
                  />
                </>
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
                  placeholder="请输入此 API 密钥的名称..."
                  size="small"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <Input
                  id="expiresAt"
                  label="过期时间"
                  type="datetime-local"
                  placeholder="选择过期时间..."
                  size="small"
                  {...field}
                />
              )}
            />
            <Button type="submit" size="small" className="min-w-68">
              保存并使用该 API 密钥
            </Button>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}

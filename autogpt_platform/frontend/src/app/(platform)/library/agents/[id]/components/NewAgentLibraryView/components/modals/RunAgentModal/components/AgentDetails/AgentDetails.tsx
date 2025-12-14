import { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Text } from "@/components/atoms/Text/Text";
import { Badge } from "@/components/atoms/Badge/Badge";
import { formatDate } from "@/lib/utils/time";

interface Props {
  agent: LibraryAgent;
}

export function AgentDetails({ agent }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-5">
      <div>
        <Text variant="body-medium" className="mb-1 !text-black">
          版本
        </Text>
        <div className="flex items-center gap-2">
          <Text variant="body" className="!text-zinc-700">
            v{agent.graph_version}
          </Text>
          {agent.is_latest_version && (
            <Badge variant="success" size="small">
              最新
            </Badge>
          )}
        </div>
      </div>
      <div>
        <Text variant="body-medium" className="mb-1 !text-black">
          最近更新
        </Text>
        <Text variant="body" className="!text-zinc-700">
          {formatDate(agent.updated_at, "zh-CN")}
        </Text>
      </div>
      {agent.has_external_trigger && (
        <div>
          <Text variant="body-medium" className="mb-1">
            触发类型
          </Text>
          <Text variant="body" className="!text-neutral-700">
            外部 Webhook
          </Text>
        </div>
      )}
    </div>
  );
}

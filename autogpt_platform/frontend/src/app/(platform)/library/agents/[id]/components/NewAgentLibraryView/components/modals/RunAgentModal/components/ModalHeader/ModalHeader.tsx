import { Badge } from "@/components/atoms/Badge/Badge";
import { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Text } from "@/components/atoms/Text/Text";
import { ShowMoreText } from "@/components/molecules/ShowMoreText/ShowMoreText";
import { ClockIcon, InfoIcon } from "@phosphor-icons/react";
import { humanizeCronExpression } from "@/lib/cron-expression-utils";

interface ModalHeaderProps {
  agent: LibraryAgent;
}

export function ModalHeader({ agent }: ModalHeaderProps) {
  const isUnknownCreator = agent.creator_name === "Unknown";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="info">新建运行</Badge>
      </div>
      <div>
        <Text variant="h3">{agent.name}</Text>
        {!isUnknownCreator ? (
          <Text variant="body-medium">作者：{agent.creator_name}</Text>
        ) : null}
        <ShowMoreText
          previewLimit={80}
          variant="small"
          className="mt-4 !text-zinc-700"
        >
          {agent.description}
        </ShowMoreText>

        {/* Schedule recommendation tip */}
        {agent.recommended_schedule_cron && !agent.has_external_trigger && (
          <div className="mt-4 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-600">
              <strong>提示：</strong> 为了获得最佳效果，建议按{" "}
              {humanizeCronExpression(agent.recommended_schedule_cron, "zh-CN")}{" "}
              运行该智能体
            </p>
          </div>
        )}

        {/* Setup Instructions */}
        {agent.instructions && (
          <div className="mt-4 flex items-start gap-2">
            <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
            <div className="text-sm text-gray-600">
              <strong>配置说明：</strong>{" "}
              <span className="whitespace-pre-wrap">{agent.instructions}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

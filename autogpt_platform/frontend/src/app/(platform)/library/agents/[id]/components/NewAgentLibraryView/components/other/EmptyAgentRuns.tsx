import { LibraryAgent } from "@/app/api/__generated__/models/libraryAgent";
import { Button } from "@/components/atoms/Button/Button";
import { Link } from "@/components/atoms/Link/Link";
import { Text } from "@/components/atoms/Text/Text";
import { ShowMoreText } from "@/components/molecules/ShowMoreText/ShowMoreText";
import { formatDate } from "@/lib/utils/time";
import { RunAgentModal } from "../modals/RunAgentModal/RunAgentModal";
import { RunDetailCard } from "../selected-views/RunDetailCard/RunDetailCard";
import { EmptyRunsIllustration } from "./EmptyRunsIllustration";

type Props = {
  agent: LibraryAgent;
};

export function EmptyAgentRuns({ agent }: Props) {
  const isPublished = Boolean(agent.marketplace_listing);
  const createdAt = formatDate(agent.created_at, "zh-CN");
  const updatedAt = formatDate(agent.updated_at, "zh-CN");
  const isUpdated = updatedAt !== createdAt;

  return (
    <div className="min-h-0 flex-1 flex-col flex-nowrap gap-2 px-2 lg:flex lg:flex-row">
      <RunDetailCard className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center gap-0">
          <EmptyRunsIllustration className="-mt-20" />
          <div className="flex flex-col items-center gap-12">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col items-center gap-2">
                <Text variant="h3" className="text-center text-[1.375rem]">
                  准备开始了吗？
                </Text>
                <Text variant="large" className="text-center">
                  运行你的智能体，这里将显示它的活动记录
                </Text>
              </div>
            </div>
            <RunAgentModal
              triggerSlot={
                <Button
                  variant="primary"
                  size="large"
                  className="inline-flex w-[19.75rem]"
                >
                  配置任务
                </Button>
              }
              agent={agent}
              agentId={agent.id.toString()}
            />
          </div>
        </div>
      </RunDetailCard>
      {isPublished ? (
        <div className="mt-4 flex flex-col gap-10 rounded-large border border-zinc-200 p-6 lg:mt-0 lg:w-[29.5rem]">
          <Text variant="label" className="text-zinc-500">
            关于此智能体
          </Text>
          <div className="flex flex-col gap-2">
            <Text variant="h4">{agent.name}</Text>
            <Text variant="body">
              作者：{" "}
              <Link
                href={`/marketplace/creator/${agent.marketplace_listing?.creator.slug}`}
                variant="secondary"
              >
                {agent.marketplace_listing?.creator.name}
              </Link>
            </Text>
          </div>
          <ShowMoreText previewLimit={170} variant="body" className="-mt-4">
            {agent.description || "暂无描述。"}
          </ShowMoreText>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-20">
              <div className="flex flex-col gap-2">
                <Text variant="body-medium" className="text-black">
                  创建时间
                </Text>
                <Text variant="body">{createdAt}</Text>
              </div>
              {isUpdated ? (
                <div className="flex flex-col gap-2">
                  <Text variant="body-medium" className="text-black">
                    更新时间
                  </Text>
                  <Text variant="body">{updatedAt}</Text>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" size="small">
                编辑智能体
              </Button>
              <Button variant="secondary" size="small">
                导出智能体到文件
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

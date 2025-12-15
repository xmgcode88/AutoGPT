"use client";
import { Separator } from "@/components/__legacy__/ui/separator";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs/Breadcrumbs";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { MarketplaceAgentPageParams } from "../../agent/[creator]/[slug]/page";
import { AgentImages } from "../AgentImages/AgentImage";
import { AgentInfo } from "../AgentInfo/AgentInfo";
import { AgentPageLoading } from "../AgentPageLoading";
import { AgentsSection } from "../AgentsSection/AgentsSection";
import { BecomeACreator } from "../BecomeACreator/BecomeACreator";
import { useMainAgentPage } from "./useMainAgentPage";
import { MARKETPLACE_ERROR_CARD_I18N } from "@/app/(platform)/marketplace/i18n";

type MainAgentPageProps = {
  params: MarketplaceAgentPageParams;
};

export const MainAgentPage = ({ params }: MainAgentPageProps) => {
  const {
    agent,
    otherAgents,
    similarAgents,
    libraryAgent,
    isLoading,
    hasError,
    user,
  } = useMainAgentPage({ params });

  if (isLoading) {
    return <AgentPageLoading />;
  }
  if (hasError) {
    return (
      <div className="mx-auto w-full max-w-[1360px]">
        <main className="px-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <ErrorCard
              isSuccess={false}
              responseError={{ message: "加载智能体数据失败" }}
              context="智能体页面"
              onRetry={() => window.location.reload()}
              className="w-full max-w-md"
              i18n={MARKETPLACE_ERROR_CARD_I18N}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="mx-auto w-full max-w-[1360px]">
        <main className="px-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <ErrorCard
              isSuccess={false}
              responseError={{ message: "未找到该智能体" }}
              context="智能体页面"
              onRetry={() => window.location.reload()}
              className="w-full max-w-md"
              i18n={MARKETPLACE_ERROR_CARD_I18N}
            />
          </div>
        </main>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "智能体市场", link: "/marketplace" },
    {
      name: agent.creator,
      link: `/marketplace/creator/${encodeURIComponent(agent.creator)}`,
    },
    { name: agent.agent_name, link: "#" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1360px]">
      <main className="mt-5 px-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-4 flex flex-col items-start gap-4 sm:mt-6 sm:gap-6 md:mt-8 md:flex-row md:gap-8">
          <div className="w-full md:w-auto md:shrink-0">
            <AgentInfo
              user={user}
              agentId={agent.active_version_id ?? "–"}
              name={agent.agent_name}
              creator={agent.creator}
              shortDescription={agent.sub_heading}
              longDescription={agent.description}
              rating={agent.rating}
              runs={agent.runs}
              categories={agent.categories}
              lastUpdated={agent.last_updated.toISOString()}
              version={agent.versions[agent.versions.length - 1]}
              storeListingVersionId={agent.store_listing_version_id}
              isAgentAddedToLibrary={Boolean(libraryAgent)}
            />
          </div>
          <AgentImages
            images={
              agent.agent_video
                ? [agent.agent_video, ...agent.agent_image]
                : agent.agent_image
            }
          />
        </div>
        <Separator className="mb-[25px] mt-[60px]" />
        {otherAgents && (
          <AgentsSection
            margin="32px"
            agents={otherAgents.agents}
            sectionTitle={`作者 ${agent.creator} 的其他智能体`}
          />
        )}
        <Separator className="mb-[25px] mt-[60px]" />
        {similarAgents && (
          <AgentsSection
            margin="32px"
            agents={similarAgents.agents}
            sectionTitle="相似智能体"
          />
        )}
        <Separator className="mb-[25px] mt-[60px]" />
        <BecomeACreator
          title="成为创作者"
          description="加入不断壮大的创作者社区，与更多同好一起创造与分享"
          buttonText="成为创作者"
        />
      </main>
    </div>
  );
};

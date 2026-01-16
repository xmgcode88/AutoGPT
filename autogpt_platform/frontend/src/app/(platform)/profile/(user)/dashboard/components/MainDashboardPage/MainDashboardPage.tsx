import { useMainDashboardPage } from "./useMainDashboardPage";
import { Separator } from "@/components/__legacy__/ui/separator";
import { AgentTable } from "../AgentTable/AgentTable";
import { PublishAgentModal } from "@/components/contextual/PublishAgentModal/PublishAgentModal";
import { EditAgentModal } from "@/components/contextual/EditAgentModal/EditAgentModal";
import { Button } from "@/components/atoms/Button/Button";
import { EmptySubmissions } from "./components/EmptySubmissions";
import { SubmissionLoadError } from "./components/SumbmissionLoadError";
import { SubmissionsLoading } from "./components/SubmissionsLoading";
import { Text } from "@/components/atoms/Text/Text";

export const MainDashboardPage = () => {
  const {
    onDeleteSubmission,
    onViewSubmission,
    onEditSubmission,
    onEditSuccess,
    onEditClose,
    onOpenSubmitModal,
    onPublishStateChange,
    publishState,
    editState,
    // API data
    submissions,
    isLoading,
    error,
  } = useMainDashboardPage();

  return (
    <main className="flex-1 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-6">
          <Text variant="h1" size="h3">
            Agent 仪表板
          </Text>
          <div className="space-y-2">
            <Text
              variant="h2"
              size="large-medium"
              className="text-neutral-900 dark:text-neutral-100"
            >
              提交新的 Agent
            </Text>
            <Text variant="body" size="small">
              从您当前的 Agent 列表中选择，或从本地计算机上传。
            </Text>
          </div>
        </div>
        <PublishAgentModal
          targetState={publishState}
          onStateChange={onPublishStateChange}
          trigger={
            <Button
              data-testid="submit-agent-button"
              size="small"
              onClick={onOpenSubmitModal}
            >
              提交 Agent
            </Button>
          }
        />
      </div>

      <Separator className="mb-8" />

      {/* Agents Section */}
      <div>
        <Text
          variant="h2"
          size="large-medium"
          className="mb-4 text-neutral-900 dark:text-neutral-100"
        >
          您上传的 Agent
        </Text>

        {error ? (
          <SubmissionLoadError />
        ) : isLoading ? (
          <SubmissionsLoading />
        ) : submissions && submissions.submissions.length > 0 ? (
          <AgentTable
            agents={submissions.submissions.map((submission, index) => ({
              id: index,
              agent_id: submission.agent_id,
              agent_version: submission.agent_version,
              sub_heading: submission.sub_heading,
              agentName: submission.name,
              description: submission.description,
              imageSrc: submission.image_urls || [""],
              dateSubmitted: submission.date_submitted,
              status: submission.status,
              runs: submission.runs,
              rating: submission.rating,
              video_url: submission.video_url || undefined,
              categories: submission.categories,
              slug: submission.slug,
              store_listing_version_id:
                submission.store_listing_version_id || undefined,
            }))}
            onViewSubmission={onViewSubmission}
            onDeleteSubmission={onDeleteSubmission}
            onEditSubmission={onEditSubmission}
          />
        ) : (
          <EmptySubmissions />
        )}
      </div>

      <EditAgentModal
        isOpen={editState.isOpen}
        onClose={onEditClose}
        submission={editState.submission}
        onSuccess={onEditSuccess}
      />
    </main>
  );
};

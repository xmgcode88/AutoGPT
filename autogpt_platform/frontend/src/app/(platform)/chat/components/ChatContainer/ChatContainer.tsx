import { cn } from "@/lib/utils";
import { ChatInput } from "@/app/(platform)/chat/components/ChatInput/ChatInput";
import { MessageList } from "@/app/(platform)/chat/components/MessageList/MessageList";
import { QuickActionsWelcome } from "@/app/(platform)/chat/components/QuickActionsWelcome/QuickActionsWelcome";
import { useChatContainer } from "./useChatContainer";
import type { SessionDetailResponse } from "@/app/api/__generated__/models/sessionDetailResponse";
import {
  CHAT_WELCOME_TITLE_ZH,
  CHAT_WELCOME_DESCRIPTION_ZH,
  CHAT_LOADING_CREATING_SESSION_ZH,
  CHAT_INPUT_PLACEHOLDER_ZH,
} from "../../i18n";

export interface ChatContainerProps {
  sessionId: string | null;
  initialMessages: SessionDetailResponse["messages"];
  onRefreshSession: () => Promise<void>;
  className?: string;
}

export function ChatContainer({
  sessionId,
  initialMessages,
  onRefreshSession,
  className,
}: ChatContainerProps) {
  const { messages, streamingChunks, isStreaming, sendMessage } =
    useChatContainer({
      sessionId,
      initialMessages,
      onRefreshSession,
    });

  const quickActions = [
    "寻找社交媒体管理智能体",
    "显示内容创作智能体",
    "帮助我自动化业务",
    "你能帮助我做什么？",
  ];

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Messages or Welcome Screen */}
      {messages.length === 0 ? (
        <QuickActionsWelcome
          title={CHAT_WELCOME_TITLE_ZH}
          description={CHAT_WELCOME_DESCRIPTION_ZH}
          actions={quickActions}
          onActionClick={sendMessage}
          disabled={isStreaming || !sessionId}
        />
      ) : (
        <MessageList
          messages={messages}
          streamingChunks={streamingChunks}
          isStreaming={isStreaming}
          onSendMessage={sendMessage}
          className="flex-1"
        />
      )}

      {/* Input - Always visible */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <ChatInput
          onSend={sendMessage}
          disabled={isStreaming || !sessionId}
          placeholder={
            sessionId ? CHAT_INPUT_PLACEHOLDER_ZH : CHAT_LOADING_CREATING_SESSION_ZH
          }
        />
      </div>
    </div>
  );
}

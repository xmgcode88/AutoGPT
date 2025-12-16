import { toast } from "sonner";
import type { StreamChunk } from "@/app/(platform)/chat/useChatStream";
import type { HandlerDependencies } from "./useChatContainer.handlers";
import {
  handleTextChunk,
  handleTextEnded,
  handleToolCallStart,
  handleToolResponse,
  handleLoginNeeded,
  handleStreamEnd,
  handleError,
} from "./useChatContainer.handlers";
import { CHAT_ERROR_OCCURRED_ZH } from "../../i18n";

export function createStreamEventDispatcher(
  deps: HandlerDependencies,
): (chunk: StreamChunk) => void {
  return function dispatchStreamEvent(chunk: StreamChunk): void {
    switch (chunk.type) {
      case "text_chunk":
        handleTextChunk(chunk, deps);
        break;

      case "text_ended":
        handleTextEnded(chunk, deps);
        break;

      case "tool_call_start":
        handleToolCallStart(chunk, deps);
        break;

      case "tool_response":
        handleToolResponse(chunk, deps);
        break;

      case "login_needed":
      case "need_login":
        handleLoginNeeded(chunk, deps);
        break;

      case "stream_end":
        handleStreamEnd(chunk, deps);
        break;

      case "error":
        handleError(chunk, deps);
        // Show toast at dispatcher level to avoid circular dependencies
        toast.error("聊天错误", {
          description: chunk.message || chunk.content || CHAT_ERROR_OCCURRED_ZH,
        });
        break;

      case "usage":
        // TODO: Handle usage for display
        break;

      default:
        console.warn("Unknown stream chunk type:", chunk);
    }
  };
}

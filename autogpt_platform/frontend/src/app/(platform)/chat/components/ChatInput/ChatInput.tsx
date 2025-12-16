import { cn } from "@/lib/utils";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/atoms/Button/Button";
import { useChatInput } from "./useChatInput";
import {
  CHAT_INPUT_PLACEHOLDER_ZH,
  CHAT_INPUT_LABEL_ZH,
  CHAT_INPUT_HINT_ZH,
  CHAT_SEND_BUTTON_LABEL_ZH,
} from "../../i18n";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = CHAT_INPUT_PLACEHOLDER_ZH,
  className,
}: ChatInputProps) {
  const { value, setValue, handleKeyDown, handleSend, textareaRef } =
    useChatInput({
      onSend,
      disabled,
      maxRows: 5,
    });

  return (
    <div className={cn("flex gap-2", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        autoComplete="off"
        aria-label={CHAT_INPUT_LABEL_ZH}
        aria-describedby="chat-input-hint"
        className={cn(
          "flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm",
          "placeholder:text-neutral-400",
          "focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20",
          "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <span id="chat-input-hint" className="sr-only">
        {CHAT_INPUT_HINT_ZH}
      </span>

      <Button
        variant="primary"
        size="small"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="self-end"
        aria-label={CHAT_SEND_BUTTON_LABEL_ZH}
      >
        <PaperPlaneRightIcon className="h-4 w-4" weight="fill" />
      </Button>
    </div>
  );
}

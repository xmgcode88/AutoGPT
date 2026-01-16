import { Tray } from "@phosphor-icons/react/dist/ssr";
import { Text } from "@/components/atoms/Text/Text";

export function EmptySubmissions() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-700">
          <Tray className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="space-y-2">
          <Text
            variant="large-medium"
            className="text-neutral-900 dark:text-neutral-100"
          >
            尚未提交任何 Agent
          </Text>
          <Text
            variant="body"
            className="text-neutral-600 dark:text-neutral-400"
          >
            您还没有向商店提交任何 Agent。
            <br />
            点击上方的&quot;提交 Agent&quot;开始使用。
          </Text>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Text } from "@/components/atoms/Text/Text";

interface Props {
  errorMessage: string;
  introText: string;
}

export function ErrorMessage({ errorMessage, introText }: Props) {
  return (
    <div className="space-y-2">
      <Text variant="body" className="text-zinc-700">
        {introText}
      </Text>
      <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <Text variant="body" className="!text-red-700">
          {errorMessage}
        </Text>
      </div>
    </div>
  );
}

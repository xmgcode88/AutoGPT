import React from "react";
import { getErrorMessage, getHttpErrorMessage } from "./helpers";
import { CardWrapper } from "./components/CardWrapper";
import { ErrorHeader } from "./components/ErrorHeader";
import { ErrorMessage } from "./components/ErrorMessage";
import { ActionButtons } from "./components/ActionButtons";

export type ErrorCardI18n = {
  title?: string;
  intro?: (context: string) => string;
  retryButton?: string;
  reportButton?: string;
  helpButton?: string;
};

export interface ErrorCardProps {
  isSuccess?: boolean;
  responseError?: {
    detail?: Array<{ msg: string }> | string;
    message?: string;
  };
  httpError?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
  context?: string;
  onRetry?: () => void;
  className?: string;
  i18n?: ErrorCardI18n;
}

export function ErrorCard({
  isSuccess = false,
  responseError,
  httpError,
  context = "data",
  onRetry,
  className = "",
  i18n,
}: ErrorCardProps) {
  if (isSuccess && !responseError && !httpError) {
    return null;
  }

  const hasResponseDetail = !!(
    responseError &&
    ((typeof responseError.detail === "string" &&
      responseError.detail.length > 0) ||
      (Array.isArray(responseError.detail) &&
        responseError.detail.length > 0) ||
      (responseError.message && responseError.message.length > 0))
  );

  const errorMessage = hasResponseDetail
    ? getErrorMessage(responseError)
    : getHttpErrorMessage(httpError);

  const introText =
    i18n?.intro?.(context) ??
    `We had the following error when retrieving ${context ?? "your data"}:`;

  return (
    <CardWrapper className={className}>
      <div className="relative space-y-4 p-6">
        <ErrorHeader title={i18n?.title} />
        <ErrorMessage errorMessage={errorMessage} introText={introText} />
        <ActionButtons
          onRetry={onRetry}
          responseError={responseError}
          httpError={httpError}
          context={context}
          labels={{
            retry: i18n?.retryButton,
            report: i18n?.reportButton,
            help: i18n?.helpButton,
          }}
        />
      </div>
    </CardWrapper>
  );
}

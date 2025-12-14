import { CredentialsMetaResponseType } from "@/app/api/__generated__/models/credentialsMetaResponseType";

export function getCredentialTypeDisplayName(type: string): string {
  const typeDisplayMap: Record<CredentialsMetaResponseType, string> = {
    [CredentialsMetaResponseType.api_key]: "API 密钥",
    [CredentialsMetaResponseType.oauth2]: "OAuth2",
    [CredentialsMetaResponseType.user_password]: "用户名/密码",
    [CredentialsMetaResponseType.host_scoped]: "主机范围",
  };

  return typeDisplayMap[type as CredentialsMetaResponseType] || type;
}

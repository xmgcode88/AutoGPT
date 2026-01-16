"use server";

import BackendApi from "@/lib/autogpt-server-api";
import { AdminUsersResponse } from "@/lib/autogpt-server-api/types";

export async function getAdminUsers(
  page: number = 1,
  pageSize: number = 20,
  search?: string,
): Promise<AdminUsersResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {
    page,
    page_size: pageSize,
  };

  if (search) {
    params.search = search;
  }

  const api = new BackendApi();
  return await api.getAdminUsers(params);
}

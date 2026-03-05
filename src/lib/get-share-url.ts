import { PREVIEW_BASE_URL } from "@/api/client";

export function getShareUrl(fileId: string): string {
  return `${PREVIEW_BASE_URL}/${encodeURIComponent(fileId)}`;
}

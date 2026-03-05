import type {
  FileRecord,
  SingleFileUploadResponse,
} from "@/api/types/files.types";
import { mapUploadResponseToFileRecord } from "@/api/types/files.types";
import { api, UPLOAD_DIRECTORY_ID } from "../client";

/** Uploads the file. Returns FileRecord on success; throws on API or network error. */
export async function uploadFile(file: File): Promise<FileRecord> {
  const form = new FormData();
  form.append("file", file);
  form.append("directory_id", UPLOAD_DIRECTORY_ID);
  form.append("is_public", "true");

  const { data } = await api.post<SingleFileUploadResponse>(
    "/clients/v1/files",
    form,
  );

  if (data.status !== "success" || !data.data) {
    throw new Error(data.message ?? "Upload failed");
  }
  return mapUploadResponseToFileRecord(data.data);
}

export { getShareUrl } from "@/lib/get-share-url";

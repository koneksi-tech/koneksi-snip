import { useMutation } from "@tanstack/react-query";
import { uploadFile, getShareUrl } from "@/api/services/files";
import { addToUploadHistory } from "@/lib/upload-history";
import { useUploadStore } from "@/stores/upload-store";
import type { FileRecord } from "@/api/types/files.types";

export function useUploadFile() {
  return useMutation<FileRecord, Error, File>({
    mutationFn: uploadFile,
    onSuccess: (record) => {
      addToUploadHistory({
        file_id: record.file_id,
        file_name: record.file_name,
        share_url: getShareUrl(record.file_id),
      });
      useUploadStore.getState().setUploadedFile(record);
      useUploadStore.getState().setUploadedFileName(record.file_name);
      useUploadStore.getState().refreshUploadHistory();
    },
  });
}

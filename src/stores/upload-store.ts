import { create } from "zustand";
import { getUploadHistory } from "@/lib/upload-history";
import type { FileRecord } from "@/api/types/files.types";
import type { StoredUpload } from "@/lib/upload-history";

interface UploadState {
  dragging: boolean;
  preview: string | null;
  uploadedFile: FileRecord | null;
  uploadedFileName: string;
  historyOpen: boolean;
  uploadHistory: StoredUpload[];

  setDragging: (value: boolean) => void;
  setPreview: (url: string | null) => void;
  setUploadedFile: (record: FileRecord | null) => void;
  setUploadedFileName: (name: string) => void;
  setHistoryOpen: (open: boolean) => void;
  refreshUploadHistory: () => void;
  resetUpload: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  dragging: false,
  preview: null,
  uploadedFile: null,
  uploadedFileName: "",
  historyOpen: false,
  uploadHistory: getUploadHistory(),

  setDragging: (value) => set({ dragging: value }),
  setPreview: (url) => set({ preview: url }),
  setUploadedFile: (record) => set({ uploadedFile: record }),
  setUploadedFileName: (name) => set({ uploadedFileName: name }),
  setHistoryOpen: (open) => set({ historyOpen: open }),
  refreshUploadHistory: () => set({ uploadHistory: getUploadHistory() }),
  resetUpload: () =>
    set({
      preview: null,
      uploadedFile: null,
      uploadedFileName: "",
    }),
}));

// ─── Single file upload (POST /clients/v1/files) ─────────────

export interface SingleFileUploadData {
  file_id: string;
  name: string;
  size: number;
  hash: string;
  content_type: string;
  access: string;
  is_encrypted: boolean;
  directory_id: string;
}

export interface SingleFileUploadResponse {
  status: "success" | "error";
  message: string;
  data?: SingleFileUploadData;
}

/** Normalized file record used by the app (ShareModal, history). */
export interface FileRecord {
  file_id: string;
  file_name: string;
  file_size: number;
  file_hash: string;
  content_type: string;
  access: string;
  is_encrypted: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Generic API Error ───────────────────────────────────────

export interface ApiErrorBody {
  success?: false;
  message?: string;
  error?: {
    code?: string;
    details?: unknown;
  };
}

export function mapUploadResponseToFileRecord(
  d: SingleFileUploadData,
): FileRecord {
  return {
    file_id: d.file_id,
    file_name: d.name,
    file_size: d.size,
    file_hash: d.hash,
    content_type: d.content_type,
    access: d.access,
    is_encrypted: d.is_encrypted,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

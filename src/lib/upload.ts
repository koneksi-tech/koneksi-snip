/** Maximum upload size: 100 MB */
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export const MAX_UPLOAD_MB = 100;

export function isAcceptedUploadType(file: File): boolean {
  return (
    file.type.startsWith("image/") || file.type.startsWith("video/")
  );
}

export function isWithinUploadSizeLimit(file: File): boolean {
  return file.size <= MAX_UPLOAD_BYTES;
}

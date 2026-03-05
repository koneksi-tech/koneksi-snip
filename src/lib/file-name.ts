/** Common generic names from clipboard/screenshot/recording that we want to replace. */
const GENERIC_PATTERNS = [
  /^image$/i,
  /^image\.(png|jpe?g|gif|webp)$/i,
  /^image\s*\(\d+\)\.(png|jpe?g|gif|webp)$/i,
  /^paste\.(png|jpe?g|gif|webp)$/i,
  /^blob$/i,
  /^download(\.\w+)?$/i,
  /^video\.(webm|mp4|mov|ogg)$/i,
  /^recording\.(webm|mp4|mov|ogg)$/i,
];

function isGenericName(name: string): boolean {
  const base = name.trim() || "";
  return GENERIC_PATTERNS.some((re) => re.test(base));
}

function getExtension(name: string): string | null {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : null;
}

function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "video/webm": "webm",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/ogg": "ogg",
  };
  if (map[mime]) return map[mime];
  if (mime.startsWith("image/")) return "png";
  if (mime.startsWith("video/")) return "webm";
  return "bin";
}

function formatDateTime(d: Date): string {
  const y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${M}-${D} ${h}-${m}-${s}`;
}

/**
 * Returns a File with a clearer name when the original is generic
 * (e.g. "image.png" → "Screenshot 2025-03-05 14-30-22.png",
 * "video.webm" → "Video 2025-03-05 14-30-22.webm").
 */
export function ensureFileDisplayName(file: File): File {
  const name = file.name?.trim() || "";
  if (!isGenericName(name)) return file;

  const ext =
    getExtension(name) || getExtensionFromMime(file.type || "image/png");
  const prefix = file.type.startsWith("video/") ? "Video" : "Screenshot";
  const newName = `${prefix} ${formatDateTime(new Date())}.${ext}`;
  return new File([file], newName, { type: file.type });
}

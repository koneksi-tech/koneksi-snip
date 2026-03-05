const STORAGE_KEY = "koneksi-snip-uploads";
const MAX_ITEMS = 50;

export interface StoredUpload {
  file_id: string;
  file_name: string;
  share_url: string;
  created_at: string; // ISO
}

function parseStored(raw: string): StoredUpload[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (x): x is StoredUpload =>
        typeof x?.file_id === "string" &&
        typeof x?.file_name === "string" &&
        typeof x?.share_url === "string" &&
        typeof x?.created_at === "string"
    );
  } catch {
    return [];
  }
}

export function getUploadHistory(): StoredUpload[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return parseStored(raw);
}

export function addToUploadHistory(entry: Omit<StoredUpload, "created_at">): void {
  const list = getUploadHistory();
  const created_at = new Date().toISOString();
  const newList = [{ ...entry, created_at }, ...list].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
}

export function removeFromUploadHistory(fileId: string): void {
  const list = getUploadHistory().filter((u) => u.file_id !== fileId);
  if (list.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function clearUploadHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

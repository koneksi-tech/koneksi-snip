import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_KONEKSI_API_URL ?? "http://localhost:3000",
  headers: {
    "Client-ID": import.meta.env.VITE_KONEKSI_CLIENT_ID ?? "",
    "Client-Secret": import.meta.env.VITE_KONEKSI_CLIENT_SECRET ?? "",
  },
});

export const UPLOAD_DIRECTORY_ID =
  import.meta.env.VITE_KONEKSI_DIRECTORY_ID ?? "";
export const PREVIEW_BASE_URL =
  import.meta.env.VITE_KONEKSI_WEBAPP_URL ?? "http://localhost:5173/preview";

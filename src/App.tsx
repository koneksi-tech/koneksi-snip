import { useRef, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUploadFile } from "@/api/queries/use-files";
import { useUploadStore } from "@/stores/upload-store";
import { ShareModal } from "@/components/ShareModal";
import { UploadHistory } from "@/components/UploadHistory";
import { ensureFileDisplayName } from "@/lib/file-name";
import { Upload, Loader2, AlertCircle, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function SnipPage() {
  const dragging = useUploadStore((s) => s.dragging);
  const uploadedFile = useUploadStore((s) => s.uploadedFile);
  const uploadedFileName = useUploadStore((s) => s.uploadedFileName);
  const historyOpen = useUploadStore((s) => s.historyOpen);
  const uploadHistory = useUploadStore((s) => s.uploadHistory);
  const setDragging = useUploadStore((s) => s.setDragging);
  const setUploadedFile = useUploadStore((s) => s.setUploadedFile);
  const setHistoryOpen = useUploadStore((s) => s.setHistoryOpen);
  const resetUpload = useUploadStore((s) => s.resetUpload);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const { mutate: upload, isPending, error, reset } = useUploadFile();

  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.userAgent);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      reset();
      setUploadedFile(null);

      const fileToUpload = ensureFileDisplayName(file);
      upload(fileToUpload);
    },
    [upload, reset],
  );

  // Paste handler (global)
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const files = e.clipboardData?.files;
      if (!files?.length) return;
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) {
          e.preventDefault();
          handleFile(f);
          return;
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  // Drag & drop handlers
  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    for (const f of Array.from(files)) {
      if (f.type.startsWith("image/")) {
        handleFile(f);
        return;
      }
    }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  const handleReset = useCallback(() => {
    reset();
    resetUpload();
  }, [reset, resetUpload]);

  const showModal = !!uploadedFile;

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#1e1e2e]"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag overlay */}
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-sky-500/10 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-sky-400/50 bg-[#2a2a3a]/80 px-16 py-12 text-center">
            <Upload className="mx-auto mb-3 size-12 text-sky-400" />
            <p className="text-lg font-medium text-white">
              Drop your image here
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative flex items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/koneksi-logo.png"
            alt="KonekSnip"
            className="h-12 w-12 object-contain"
          />
          <span className="cursor-pointer text-2xl font-semibold tracking-tight text-white">
            Konek<span className="text-sky-400">Snip</span>
          </span>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="gap-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <HistoryIcon className="size-5" />
            History
          </Button>
          {historyOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                aria-hidden
                onClick={() => setHistoryOpen(false)}
              />
              <UploadHistory
                items={uploadHistory}
                onRefresh={() =>
                  useUploadStore.getState().refreshUploadHistory()
                }
                onClose={() => setHistoryOpen(false)}
              />
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20">
        {isPending ? (
          /* Uploading — no preview, just spinner until share modal */
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-sky-400" />
            <p className="text-sm font-medium text-white/80">Uploading...</p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex w-full max-w-md flex-col items-center gap-4">
            <div className="flex w-full items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Upload failed
                </p>
                <p className="mt-0.5 text-sm text-red-300/70">
                  {error.message}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-white/10 text-white/70 hover:text-white"
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Hero area */}
            <div className="mb-6 text-center">
              <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Konek<span className="text-sky-400">Snip</span>
              </h1>
              <p className="text-lg text-white/50">
                Paste, drop, or pick a file — get a link to share in seconds.
              </p>
            </div>

            {/* Upload instructions — short and clear */}
            <div className="w-full max-w-xl rounded-2xl border border-white/6 bg-[#2a2a3a] p-8 shadow-xl">
              <p className="text-center text-base text-white/80">
                Paste from your clipboard (
                {isMac ? (
                  <>
                    <Kbd>Cmd</Kbd> + <Kbd>V</Kbd>
                  </>
                ) : (
                  <>
                    <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
                  </>
                )}
                ) to upload screenshots or images, or{" "}
                <span className="font-medium text-white/90">drag and drop</span>{" "}
                onto this page, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer font-medium text-sky-400 underline underline-offset-2 transition-colors hover:text-sky-300"
                >
                  pick a file
                </button>
                .
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-white/50">
        Powered by{" "}
        <a
          href="https://koneksi.co.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-muted-foreground hover:text-white"
        >
          Koneksi
        </a>{" "}
        &mdash; Privatized, Decentralized Storage on IPFS
      </footer>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileInput}
      />

      {/* Share modal */}
      {showModal && (
        <ShareModal
          fileId={uploadedFile.file_id}
          fileName={uploadedFileName}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-sm font-semibold text-sky-300">
      {children}
    </kbd>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnipPage />
    </QueryClientProvider>
  );
}

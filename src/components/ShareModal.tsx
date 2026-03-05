import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getShareUrl } from "@/api/services/files";
import { Check, Copy, X, ExternalLink } from "lucide-react";

interface ShareModalProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
}

export function ShareModal({ fileId, fileName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareUrl = getShareUrl(fileId);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      inputRef.current?.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-4 w-full max-w-lg rounded-xl border border-white/10 bg-[#2a2a3a] p-4 shadow-2xl sm:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-emerald-500/20 p-2">
            <Check className="size-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Upload Complete</h2>
        </div>

        <p className="mb-2 text-sm text-white/60">
          <span className="font-medium text-white/80">{fileName}</span> has been
          uploaded. Share the link below.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            ref={inputRef}
            readOnly
            value={shareUrl}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
            onFocus={(e) => e.target.select()}
          />
          <Button
            onClick={handleCopy}
            className="w-full shrink-0 gap-1.5 bg-sky-600 text-white hover:bg-sky-500 sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="size-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-4" /> Copy
              </>
            )}
          </Button>
        </div>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-sky-400 transition-colors hover:text-sky-300"
        >
          <ExternalLink className="size-3.5" /> Open in new tab
        </a>
      </div>
    </div>
  );
}

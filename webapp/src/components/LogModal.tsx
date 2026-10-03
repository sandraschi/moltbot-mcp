import { useEffect, useState } from "react";
import { fetchLogs, type LogEntry, type LogsResponse } from "../api/client";

interface LogModalProps {
  open: boolean;
  onClose: () => void;
}

const LEVEL_CLASS: Record<string, string> = {
  DEBUG: "text-gray-500",
  INFO: "text-gray-300",
  WARNING: "text-amber-400",
  ERROR: "text-red-400",
};

export function LogModal({ open, onClose }: LogModalProps) {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLogs(300);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reload-on-open only; load is redefined per render and subscribing to it would refetch in a loop.
  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismissal is pointer-only by design; keyboard path is the Close button + the global Escape listener above.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-modal-title"
      onClick={onClose}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: content wrapper only stops backdrop-click propagation; keyboard dismissal is the Close button + the global Escape listener. */}
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-lg border border-gray-700 bg-gray-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
          <h2
            id="log-modal-title"
            className="text-lg font-medium text-gray-100"
          >
            Server logs
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="rounded border border-gray-600 bg-gray-800 px-2.5 py-1.5 text-sm text-gray-200 hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-600 bg-gray-800 px-2.5 py-1.5 text-sm text-gray-200 hover:bg-gray-700"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm">
          {error && (
            <p className="text-amber-400">Failed to load logs: {error}</p>
          )}
          {data && !data.ok && (
            <p className="text-amber-400">{data.error ?? "Unknown error"}</p>
          )}
          {data?.entries && data.entries.length === 0 && !error && (
            <p className="text-gray-500">No log entries yet.</p>
          )}
          {data?.entries && data.entries.length > 0 && (
            <ul className="space-y-1">
              {data.entries.map((entry: LogEntry) => (
                <li
                  key={`${entry.ts}-${entry.level}-${entry.message.length}`}
                  className={`flex flex-wrap gap-x-2 gap-y-0.5 ${LEVEL_CLASS[entry.level] ?? "text-gray-400"}`}
                >
                  <span className="shrink-0 text-gray-500">{entry.ts}</span>
                  <span className="shrink-0 font-semibold">
                    [{entry.level}]
                  </span>
                  <span className="min-w-0 break-all">{entry.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

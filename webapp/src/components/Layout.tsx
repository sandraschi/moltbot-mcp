import { useState } from "react";
import { LogModal } from "./LogModal";

interface LayoutProps {
  children: React.ReactNode;
  activeView: "dashboard" | "docs";
  onNavigate: (view: "dashboard" | "docs") => void;
}

export function Layout({ children, activeView, onNavigate }: LayoutProps) {
  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-semibold text-gray-100">
            Moltbot MCP
          </span>
          <nav className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className={`text-sm font-medium ${
                activeView === "dashboard"
                  ? "text-gray-100 underline underline-offset-4"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate("docs")}
              className={`text-sm font-medium ${
                activeView === "docs"
                  ? "text-gray-100 underline underline-offset-4"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Docs
            </button>
            <button
              type="button"
              onClick={() => setLogsOpen(true)}
              className="rounded border border-gray-600 bg-gray-800/80 px-2.5 py-1 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-200"
            >
              Logs
            </button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <LogModal open={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  );
}

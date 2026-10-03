import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  Terminal,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import type { View } from "../App";
import { LogModal } from "./LogModal";

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  { id: "chat", label: "Chat", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "tools", label: "Tools", icon: <Wrench className="h-4 w-4" /> },
  { id: "skills", label: "Skills", icon: <BookOpen className="h-4 w-4" /> },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings2 className="h-4 w-4" />,
  },
  { id: "help", label: "Help", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "docs", label: "Docs", icon: <FileText className="h-4 w-4" /> },
];

export function Layout({ children, activeView, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-gray-800 bg-gray-900/50 transition-all duration-200 ${
          sidebarOpen ? "w-48" : "w-12"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 px-3 py-3">
          {sidebarOpen && (
            <span className="text-sm font-semibold text-gray-100">Moltbot</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                activeView === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
              title={item.label}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-800 px-2 py-2">
          <button
            type="button"
            onClick={() => setLogsOpen(true)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            title="Logs"
          >
            <Terminal className="h-4 w-4" />
            {sidebarOpen && <span>Logs</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>

      <LogModal open={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  );
}

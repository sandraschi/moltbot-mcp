import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Docs } from "./pages/Docs";

const DOC_SECTION_IDS = [
  "docs", "intro", "moltbot-overview", "moltbot-architecture", "moltbot-channels",
  "moltbot-tools", "moltbot-nodes", "moltbot-security", "mcp-overview", "mcp-moltbot-ops",
  "mcp-help", "mcp-config", "mcp-usage", "dashboard",
];

function isDocsHash() {
  const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  return h === "docs" || DOC_SECTION_IDS.includes(h);
}

function App() {
  const [view, setView] = useState<"dashboard" | "docs">(() =>
    typeof window !== "undefined" && isDocsHash() ? "docs" : "dashboard"
  );

  useEffect(() => {
    const onHash = () => setView(isDocsHash() ? "docs" : "dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleNavigate = (v: "dashboard" | "docs") => {
    setView(v);
    window.location.hash = v === "docs" ? "#docs" : "";
  };

  return (
    <Layout activeView={view} onNavigate={handleNavigate}>
      {view === "dashboard" ? <Dashboard /> : <Docs />}
    </Layout>
  );
}

export default App;
